import { useCallback, useEffect, useMemo, useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { ArrowDown, ArrowUp, CalendarCheck, Lock, LockOpen, Mail, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { proposeSchedule, retime, sessions, type Slot } from "@/lib/proposeSchedule";

export interface WorkflowAbstract {
  id: string; title: string; topic: string | null; avgScore: number | null; status: string; firstAuthor: string; reviewCount: number;
}
type Decision = "oral" | "poster" | "revise" | "reject";
interface DecisionRow {
  abstract_id: string; decision: Decision; note: string | null; confirmed_at: string | null;
  emailed_at: string | null; revision_due_at: string | null;
}

const LABEL: Record<Decision, string> = { oral: "Accept (oral)", poster: "Accept (poster)", revise: "Revise", reject: "Reject" };
const DEFAULT_DUE = "2027-01-08T12:00";
const selectCls = "h-9 rounded-md border border-input bg-background px-2 text-sm";

const errText = async (e: unknown) => (e instanceof FunctionsHttpError ? await e.context.text() : (e as Error)?.message ?? "Failed");

const SocDecisionsWorkflow = ({ abstracts }: { abstracts: WorkflowAbstract[] }) => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const active = useMemo(() => abstracts.filter((a) => a.status !== "withdrawn"), [abstracts]);
  const byId = useMemo(() => new Map(abstracts.map((a) => [a.id, a])), [abstracts]);

  const [decisions, setDecisions] = useState<Map<string, DecisionRow>>(new Map());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [due, setDue] = useState(DEFAULT_DUE);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const load = useCallback(async () => {
    const [{ data: d }, { data: s }, { data: c }] = await Promise.all([
      supabase.from("abstract_decisions").select("*"),
      supabase.from("schedule_slots").select("*"),
      supabase.from("app_config").select("schedule_published_at").eq("id", true).maybeSingle(),
    ]);
    setDecisions(new Map((d ?? []).map((r: any) => [r.abstract_id, r as DecisionRow])));
    setSlots((s ?? []).map((r: any) => ({ abstractId: r.abstract_id, sessionId: r.session_id, kind: r.kind, position: r.position, startTime: r.start_time, endTime: r.end_time })));
    setPublishedAt((c as any)?.schedule_published_at ?? null);
  }, []);
  useEffect(() => { load(); }, [load]);

  const allDecided = active.length > 0 && active.every((a) => decisions.has(a.id));
  const allConfirmed = allDecided && active.every((a) => decisions.get(a.id)?.confirmed_at);

  // ---- Step 1: decisions ----
  const saveDecision = async (id: string, patch: Partial<DecisionRow>) => {
    const cur = decisions.get(id);
    const row = { abstract_id: id, decision: patch.decision ?? cur?.decision ?? "oral", note: patch.note !== undefined ? patch.note : cur?.note ?? null };
    const { error } = await supabase.from("abstract_decisions").upsert(row);
    if (error) return toast.error(error.message);
    setDecisions((m) => new Map(m).set(id, { ...(cur ?? { confirmed_at: null, emailed_at: null, revision_due_at: null }), ...row } as DecisionRow));
  };

  const confirmAll = async () => {
    setBusy(true);
    const now = new Date().toISOString();
    const dueIso = new Date(`${due}:00+01:00`).toISOString();
    for (const a of active) {
      const d = decisions.get(a.id)!;
      if (d.confirmed_at) continue;
      const { error } = await supabase.from("abstract_decisions").update({
        confirmed_at: now, revision_due_at: d.decision === "revise" ? dueIso : null,
      }).eq("abstract_id", a.id);
      if (error) { toast.error(error.message); break; }
    }
    setBusy(false);
    toast.success("Decisions confirmed and locked.");
    load();
  };

  const unlockAll = async () => {
    setBusy(true);
    const { error } = await supabase.from("abstract_decisions").update({ confirmed_at: null }).not("confirmed_at", "is", null);
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Decisions unlocked."); load(); }
  };

  // ---- Step 2: schedule ----
  const propose = () => {
    const cands = active.flatMap((a) => {
      const d = decisions.get(a.id);
      return d?.confirmed_at && (d.decision === "oral" || d.decision === "poster")
        ? [{ abstractId: a.id, topic: a.topic, score: a.avgScore, decision: d.decision }] : [];
    });
    setSlots(proposeSchedule(cands));
    toast.info("Schedule proposed — review it, then save.");
  };
  const move = (id: string, patch: Partial<Slot>) =>
    setSlots((ss) => retime(ss.map((s) => (s.abstractId === id ? { ...s, ...patch, position: patch.position ?? (patch.sessionId || patch.kind ? 999 : s.position) } : s))));
  const shift = (s: Slot, dir: -1 | 1) => {
    const peers = slots.filter((x) => x.sessionId === s.sessionId && x.kind === s.kind).sort((a, b) => a.position - b.position);
    const other = peers.find((x) => x.position === s.position + dir);
    if (!other) return;
    setSlots((ss) => retime(ss.map((x) => x.abstractId === s.abstractId ? { ...x, position: other.position } : x.abstractId === other.abstractId ? { ...x, position: s.position } : x)));
  };
  const saveSchedule = async () => {
    setBusy(true);
    const ids = slots.map((s) => s.abstractId);
    const del = supabase.from("schedule_slots").delete();
    const { error: dErr } = ids.length ? await del.not("abstract_id", "in", `(${ids.join(",")})`) : await del.neq("session_id", "");
    const { error } = slots.length ? await supabase.from("schedule_slots").upsert(slots.map((s) => ({
      abstract_id: s.abstractId, session_id: s.sessionId, kind: s.kind, position: s.position,
      start_time: s.startTime, end_time: s.endTime, updated_at: new Date().toISOString(),
    }))) : { error: null };
    setBusy(false);
    if (dErr || error) toast.error((dErr || error)!.message); else toast.success("Schedule saved.");
  };
  const setPublished = async (on: boolean) => {
    if (on) await saveSchedule();
    const { error } = await supabase.from("app_config").update({ schedule_published_at: on ? new Date().toISOString() : null }).eq("id", true);
    if (error) return toast.error(error.message);
    setPublishedAt(on ? new Date().toISOString() : null);
    toast.success(on ? "Schedule published on the Program page." : "Schedule hidden from the website.");
  };

  // ---- Step 3: emails ----
  const runEmails = async (dryRun: boolean) => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("send-author-email", { body: { mode: "decision", dryRun } });
    setBusy(false);
    if (error) return toast.error(await errText(error));
    if (dryRun) setPreview(data);
    else { setPreview(null); toast.success(`Sent ${data.sent} emails${data.failed ? `, ${data.failed} failed` : ""}.`); load(); }
  };

  const unsent = active.filter((a) => decisions.get(a.id)?.confirmed_at && !decisions.get(a.id)?.emailed_at).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" />Decisions, schedule & notifications</CardTitle>
        <CardDescription>1) Record draft decisions while the SOC meets · 2) Confirm · 3) Propose and publish the schedule · 4) Send decision emails.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="decisions">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="decisions">Decisions</TabsTrigger>
            <TabsTrigger value="schedule" disabled={!allConfirmed}>Schedule</TabsTrigger>
            <TabsTrigger value="emails" disabled={!allConfirmed}>Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="decisions" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr><th className="py-2 pr-2">Abstract</th><th className="pr-2">Avg</th><th className="pr-2">Decision</th><th>Note to authors</th></tr>
                </thead>
                <tbody>
                  {[...active].sort((a, b) => (b.avgScore ?? -1) - (a.avgScore ?? -1)).map((a) => {
                    const d = decisions.get(a.id);
                    const locked = Boolean(d?.confirmed_at);
                    return (
                      <tr key={a.id} className="border-t border-border align-top">
                        <td className="py-2 pr-2">
                          <div className="font-medium">{a.title}</div>
                          <div className="text-xs text-muted-foreground">{a.firstAuthor} · {a.topic ?? "No session"} · {a.reviewCount} reviews</div>
                        </td>
                        <td className="py-2 pr-2 font-semibold">{a.avgScore?.toFixed(2) ?? "—"}</td>
                        <td className="py-2 pr-2">
                          <select className={selectCls} disabled={locked} value={d?.decision ?? ""}
                            onChange={(e) => saveDecision(a.id, { decision: e.target.value as Decision })}>
                            <option value="" disabled>Choose…</option>
                            {(Object.keys(LABEL) as Decision[]).map((k) => <option key={k} value={k}>{LABEL[k]}</option>)}
                          </select>
                          {d?.emailed_at && <Badge variant="outline" className="ml-1 mt-1">emailed</Badge>}
                        </td>
                        <td className="py-2">
                          <Input disabled={locked || !d} defaultValue={d?.note ?? ""} placeholder="Optional"
                            onBlur={(e) => d && e.target.value !== (d.note ?? "") && saveDecision(a.id, { note: e.target.value || null })} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              {!allConfirmed && (
                <>
                  <label className="text-sm">
                    <span className="block text-muted-foreground mb-1">Revision deadline (Amsterdam)</span>
                    <Input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} className="w-56" />
                  </label>
                  <Button onClick={confirmAll} disabled={!allDecided || busy}><Lock className="h-4 w-4" />Confirm all decisions</Button>
                  {!allDecided && <span className="text-sm text-muted-foreground">Every active abstract needs a decision first.</span>}
                </>
              )}
              {allConfirmed && <Badge className="h-7">All decisions confirmed</Badge>}
              {isAdmin && [...decisions.values()].some((d) => d.confirmed_at) && (
                <Button variant="outline" onClick={unlockAll} disabled={busy}><LockOpen className="h-4 w-4" />Unlock (admin)</Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="outline" onClick={propose}><Sparkles className="h-4 w-4" />Propose schedule</Button>
              <Button variant="outline" onClick={saveSchedule} disabled={busy}>Save</Button>
              {isAdmin ? (
                publishedAt
                  ? <Button variant="outline" onClick={() => setPublished(false)}>Hide from website</Button>
                  : <Button onClick={() => setPublished(true)} disabled={!slots.length}>Publish schedule</Button>
              ) : <span className="text-sm text-muted-foreground">An admin publishes the schedule.</span>}
              {publishedAt && <Badge>Live on the Program page</Badge>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {sessions.map((s) => {
                const inS = slots.filter((x) => x.sessionId === s.id);
                return (
                  <div key={s.id} className="rounded-lg border border-border p-3">
                    <div className="font-semibold text-primary text-sm mb-2"><span className="font-mono mr-1">{s.id}</span>{s.title} <span className="text-muted-foreground font-normal">· {s.time}</span></div>
                    {(["oral", "poster"] as const).map((k) => (
                      <div key={k} className="mb-2">
                        <div className="text-xs uppercase font-semibold text-muted-foreground">{k === "oral" ? "Talks" : "Posters"}</div>
                        {inS.filter((x) => x.kind === k).sort((a, b) => a.position - b.position).map((x) => (
                          <div key={x.abstractId} className="flex items-center gap-2 py-1 text-sm border-t border-border first:border-0">
                            <span className="font-mono text-xs w-20 shrink-0 text-muted-foreground">{x.startTime ? `${x.startTime}–${x.endTime}` : "poster"}</span>
                            <span className="min-w-0 flex-1 truncate" title={byId.get(x.abstractId)?.title}>{byId.get(x.abstractId)?.title}</span>
                            <span className="text-xs font-semibold">{byId.get(x.abstractId)?.avgScore?.toFixed(1) ?? "—"}</span>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => shift(x, -1)} aria-label="Move up"><ArrowUp className="h-3 w-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => shift(x, 1)} aria-label="Move down"><ArrowDown className="h-3 w-3" /></Button>
                            <select className={`${selectCls} h-7 text-xs`} value={x.sessionId} onChange={(e) => move(x.abstractId, { sessionId: e.target.value })} aria-label="Session">
                              {sessions.map((o) => <option key={o.id} value={o.id}>{o.id}</option>)}
                            </select>
                            <select className={`${selectCls} h-7 text-xs`} value={x.kind} onChange={(e) => move(x.abstractId, { kind: e.target.value as Slot["kind"] })} aria-label="Format">
                              <option value="oral">Oral</option><option value="poster">Poster</option>
                            </select>
                          </div>
                        ))}
                        {k === "oral" && inS.filter((x) => x.kind === "oral").length > 5 && (
                          <p className="text-xs text-destructive">More than 5 talks — the session will overrun.</p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="emails" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Every listed author of each abstract gets one email with the decision (talks include session and time). Save the schedule first.
              {" "}{unsent} abstract{unsent === 1 ? "" : "s"} not yet emailed.
            </p>
            {isAdmin ? (
              <Button onClick={() => runEmails(true)} disabled={busy || unsent === 0}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}Preview decision emails
              </Button>
            ) : <p className="text-sm">An admin sends the decision emails.</p>}
          </TabsContent>
        </Tabs>
      </CardContent>

      <AlertDialog open={Boolean(preview)} onOpenChange={(o) => !o && setPreview(null)}>
        <AlertDialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Send {preview?.recipients} emails for {preview?.abstracts} abstracts?</AlertDialogTitle>
            <AlertDialogDescription>
              {Object.entries(preview?.byKind ?? {}).map(([k, n]) => `${LABEL[k as Decision] ?? k}: ${n}`).join(" · ")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {Object.entries(preview?.samples ?? {}).map(([k, m]: any) => (
              <div key={k} className="rounded-md border border-border p-3 text-sm">
                <div className="font-semibold">{m.subject}</div>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-muted-foreground">{m.body}</pre>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => runEmails(false)}><Send className="h-4 w-4" />Confirm and send</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SocDecisionsWorkflow;
