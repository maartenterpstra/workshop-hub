import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toCsv, downloadCsv, todayStamp } from "@/lib/csv";

interface Props {
  abstracts: { id: string; title: string }[];
}

interface LogRow {
  id: string;
  sent_at: string;
  abstract_id: string | null;
  recipient_email: string;
  subject: string;
  kind: string;
  status: string;
  error: string | null;
}

const ALL = "__all__";

const errMsg = async (error: unknown) =>
  error instanceof FunctionsHttpError ? await error.context.text() : (error as Error).message;

const AdminEmailAuthors = ({ abstracts }: Props) => {
  const [target, setTarget] = useState<string>(ALL);
  const [includeWithdrawn, setIncludeWithdrawn] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<LogRow[]>([]);
  const [logFilter, setLogFilter] = useState<string>(ALL);

  const titleById = new Map(abstracts.map((a) => [a.id, a.title]));

  const loadLog = async () => {
    const { data, error } = await supabase
      .from("email_log")
      .select("id, sent_at, abstract_id, recipient_email, subject, kind, status, error")
      .order("sent_at", { ascending: false })
      .limit(1000);
    if (error) return toast.error(error.message);
    setLog((data ?? []) as LogRow[]);
  };

  useEffect(() => {
    loadLog();
  }, []);

  const payload = () => ({
    abstractId: target === ALL ? null : target,
    includeWithdrawn,
    subject,
    body,
  });

  const send = async () => {
    if (!subject.trim() || !body.trim()) return toast.error("Please fill in a subject and a message.");
    setSending(true);
    try {
      const { data: preview, error: pErr } = await supabase.functions.invoke("send-author-email", {
        body: { ...payload(), dryRun: true },
      });
      if (pErr) throw new Error(await errMsg(pErr));
      const n = (preview as any).recipients as number;
      if (n === 0) return toast.info("No recipients found.");
      if (!window.confirm(`Send this email to ${n} recipient${n === 1 ? "" : "s"}?`)) return;
      const { data, error } = await supabase.functions.invoke("send-author-email", { body: payload() });
      if (error) throw new Error(await errMsg(error));
      const r = data as { sent: number; total: number };
      if (r.sent === r.total) toast.success(`Sent to ${r.sent} recipients.`);
      else toast.warning(`Sent ${r.sent} of ${r.total}. See the log for failures.`);
      setSubject("");
      setBody("");
      await loadLog();
    } catch (e: any) {
      toast.error(e.message ?? "Sending failed.");
    } finally {
      setSending(false);
    }
  };

  const shown = log.filter((l) => logFilter === ALL || l.abstract_id === logFilter);

  const exportLog = () => {
    const csv = toCsv([
      ["Sent at", "Type", "Abstract", "Recipient", "Subject", "Status", "Error"],
      ...shown.map((l) => [
        l.sent_at,
        l.kind,
        l.abstract_id ? titleById.get(l.abstract_id) ?? l.abstract_id : "",
        l.recipient_email,
        l.subject,
        l.status,
        l.error ?? "",
      ]),
    ]);
    downloadCsv(csv, `aiinrt2027-sent-emails-${todayStamp()}.csv`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email authors
        </CardTitle>
        <CardDescription>
          Sent to the submitting account and every listed author, one email each. Use {"{title}"} to insert the
          abstract title.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Recipients</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All submissions</SelectItem>
                {abstracts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {target === ALL && (
            <label className="flex items-center gap-2 text-sm self-end pb-2">
              <Checkbox checked={includeWithdrawn} onCheckedChange={(v) => setIncludeWithdrawn(v === true)} />
              Include withdrawn abstracts
            </label>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mail-subject">Subject</Label>
          <Input id="mail-subject" value={subject} maxLength={200} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mail-body">Message</Label>
          <Textarea id="mail-body" rows={8} value={body} maxLength={10000} onChange={(e) => setBody(e.target.value)} />
        </div>
        <Button onClick={send} disabled={sending}>
          {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {sending ? "Sending…" : "Send email"}
        </Button>

        <div className="space-y-3 border-t pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Sent emails ({shown.length})</h3>
            <div className="flex gap-2">
              <Select value={logFilter} onValueChange={setLogFilter}>
                <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All abstracts</SelectItem>
                  {abstracts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportLog} disabled={shown.length === 0}>
                <Download className="mr-2 h-4 w-4" />CSV
              </Button>
            </div>
          </div>
          <div className="max-h-96 overflow-auto rounded border">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr className="text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Abstract</th>
                  <th className="p-2">Recipient</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No emails yet.</td></tr>
                )}
                {shown.map((l) => (
                  <tr key={l.id} className="border-t align-top">
                    <td className="p-2 whitespace-nowrap">{new Date(l.sent_at).toLocaleString("en-GB")}</td>
                    <td className="p-2">
                      {l.subject}
                      {l.kind === "confirmation" && <span className="ml-1 text-xs text-muted-foreground">(automatic)</span>}
                    </td>
                    <td className="p-2">{l.abstract_id ? titleById.get(l.abstract_id) ?? "—" : "—"}</td>
                    <td className="p-2">{l.recipient_email}</td>
                    <td className="p-2">
                      <Badge variant={l.status === "sent" ? "default" : "destructive"}>{l.status}</Badge>
                      {l.error && <div className="text-xs text-destructive mt-1">{l.error}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminEmailAuthors;
