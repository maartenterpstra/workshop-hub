import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, Lock, Unlock, UserPlus, X, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { reviewerImportRoster, DEFAULT_REVIEWER_PASSWORD } from "@/data/reviewerImport";

interface ReviewerInfo {
  id: string;
  name: string;
  email: string | null;
  affiliation: string | null;
  topicIds: string[];
}

interface AssignmentRow {
  id: string;
  reviewer_id: string;
  status: string;
}

interface AbstractRow {
  id: string;
  title: string;
  topic_id: string | null;
  topicName: string;
  submitted_at: string;
  reviewers_confirmed_at: string | null;
  assignments: AssignmentRow[];
}

const AdminAssignments = () => {
  const [abstracts, setAbstracts] = useState<AbstractRow[]>([]);
  const [reviewers, setReviewers] = useState<ReviewerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    const [{ data: abs }, { data: roleRows }, { data: profileRows }, { data: expertise }] =
      await Promise.all([
        supabase
          .from("abstracts")
          .select(
            "id, title, topic_id, submitted_at, reviewers_confirmed_at, topic:topics(name), assignments:review_assignments(id, reviewer_id, status)",
          )
          .order("submitted_at", { ascending: false }),
        supabase.from("user_roles").select("user_id").eq("role", "reviewer"),
        supabase.from("profiles").select("id, full_name, email, affiliation"),
        supabase.from("reviewer_expertise").select("reviewer_id, topic_id"),
      ]);

    const reviewerIds = new Set((roleRows ?? []).map((r) => r.user_id));
    const expByReviewer = new Map<string, string[]>();
    for (const e of expertise ?? []) {
      expByReviewer.set(e.reviewer_id, [...(expByReviewer.get(e.reviewer_id) ?? []), e.topic_id]);
    }

    setReviewers(
      (profileRows ?? [])
        .filter((p) => reviewerIds.has(p.id))
        .map((p) => ({
          id: p.id,
          name: p.full_name ?? p.email ?? p.id.slice(0, 8),
          email: p.email,
          affiliation: p.affiliation,
          topicIds: expByReviewer.get(p.id) ?? [],
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );

    setAbstracts(
      ((abs ?? []) as any[]).map((a) => ({
        id: a.id,
        title: a.title,
        topic_id: a.topic_id,
        topicName: a.topic?.name ?? "—",
        submitted_at: a.submitted_at,
        reviewers_confirmed_at: a.reviewers_confirmed_at,
        assignments: a.assignments ?? [],
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const reviewerById = useMemo(
    () => new Map(reviewers.map((r) => [r.id, r])),
    [reviewers],
  );

  const loadPerReviewer = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of abstracts) {
      for (const asn of a.assignments) {
        counts.set(asn.reviewer_id, (counts.get(asn.reviewer_id) ?? 0) + 1);
      }
    }
    return counts;
  }, [abstracts]);

  const importReviewers = async () => {
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("import-reviewers", {
        body: { password: DEFAULT_REVIEWER_PASSWORD, reviewers: reviewerImportRoster },
      });
      if (error) throw error;
      const res = data as {
        created: number;
        updated: number;
        total: number;
        unknownTopics: string[];
        errors: string[];
      };
      toast.success(
        `${res.created} accounts created, ${res.updated} updated (of ${res.total}).`,
      );
      if (res.unknownTopics?.length) toast.warning(`Unmatched topics: ${res.unknownTopics.join(", ")}`);
      if (res.errors?.length) toast.error(res.errors.slice(0, 3).join(" | "));
      await load();
    } catch (e: any) {
      toast.error(e.message ?? "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  const addReviewer = async (abstractId: string, reviewerId: string) => {
    setBusy(abstractId);
    const { error } = await supabase
      .from("review_assignments")
      .insert({ abstract_id: abstractId, reviewer_id: reviewerId, status: "pending" });
    setBusy(null);
    if (error) return toast.error(error.message);
    await load();
  };

  const removeAssignment = async (abstractId: string, assignmentId: string) => {
    setBusy(abstractId);
    const { error } = await supabase.from("review_assignments").delete().eq("id", assignmentId);
    setBusy(null);
    if (error) return toast.error(error.message);
    await load();
  };

  const setConfirmed = async (abstractId: string, confirmed: boolean) => {
    setBusy(abstractId);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("abstracts")
      .update({
        reviewers_confirmed_at: confirmed ? new Date().toISOString() : null,
        reviewers_confirmed_by: confirmed ? userData.user?.id ?? null : null,
      })
      .eq("id", abstractId);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(confirmed ? "Panel confirmed — visible to reviewers." : "Panel re-opened.");
    await load();
  };

  const confirmAll = async () => {
    const pending = abstracts.filter((a) => !a.reviewers_confirmed_at);
    if (pending.length === 0) return toast.info("All panels are already confirmed.");
    setBusy("all");
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("abstracts")
      .update({
        reviewers_confirmed_at: new Date().toISOString(),
        reviewers_confirmed_by: userData.user?.id ?? null,
      })
      .in(
        "id",
        pending.map((a) => a.id),
      );
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`${pending.length} panel${pending.length === 1 ? "" : "s"} confirmed.`);
    await load();
  };

  if (loading) {
    return <div className="container py-16 text-center text-muted-foreground">Loading…</div>;
  }

  const filtered = abstracts.filter(
    (a) =>
      !search.trim() ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.topicName.toLowerCase().includes(search.toLowerCase()),
  );

  const confirmedCount = abstracts.filter((a) => a.reviewers_confirmed_at).length;

  return (
    <div className="container max-w-6xl py-12 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reviewer assignments</h1>
          <p className="text-muted-foreground mt-1">
            {abstracts.length} abstract{abstracts.length === 1 ? "" : "s"} · {confirmedCount}{" "}
            confirmed · {reviewers.length} reviewer accounts
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={importReviewers} disabled={importing}>
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />Importing…
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />Import reviewer roster
              </>
            )}
          </Button>
          <Button onClick={confirmAll} disabled={busy === "all"}>
            <CheckCircle2 className="mr-2 h-4 w-4" />Confirm all
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> Reviewer load
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-xs">
          {reviewers.length === 0 && (
            <span className="text-muted-foreground">
              No reviewer accounts yet — run “Import reviewer roster”. Default password:{" "}
              <code>{DEFAULT_REVIEWER_PASSWORD}</code> (reviewers must change it at first sign-in).
            </span>
          )}
          {reviewers.map((r) => (
            <Badge key={r.id} variant="outline">
              {r.name}: {loadPerReviewer.get(r.id) ?? 0}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Input
        placeholder="Filter abstracts by title or topic…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No abstracts yet.
          </CardContent>
        </Card>
      )}

      {filtered.map((a) => {
        const assigned = new Set(a.assignments.map((x) => x.reviewer_id));
        const candidates = reviewers.filter((r) => !assigned.has(r.id));
        const mismatch = a.assignments.filter(
          (x) => a.topic_id && !(reviewerById.get(x.reviewer_id)?.topicIds ?? []).includes(a.topic_id),
        ).length;
        return (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-secondary font-semibold">
                    {a.topicName}
                  </div>
                  <CardTitle className="mt-1">{a.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {a.assignments.length} reviewer{a.assignments.length === 1 ? "" : "s"}
                    {a.assignments.length < 5 && " · fewer than 5"}
                    {mismatch > 0 && ` · ${mismatch} outside topic expertise`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {a.reviewers_confirmed_at ? (
                    <Badge className="gap-1">
                      <Lock className="h-3 w-3" /> Confirmed
                    </Badge>
                  ) : (
                    <Badge variant="outline">Tentative</Badge>
                  )}
                  <Button
                    size="sm"
                    variant={a.reviewers_confirmed_at ? "outline" : "default"}
                    disabled={busy === a.id}
                    onClick={() => setConfirmed(a.id, !a.reviewers_confirmed_at)}
                  >
                    {a.reviewers_confirmed_at ? (
                      <>
                        <Unlock className="mr-1 h-3.5 w-3.5" />Re-open
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />Confirm reviewers
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {a.assignments.length === 0 && (
                  <span className="text-sm text-muted-foreground">No reviewers assigned.</span>
                )}
                {a.assignments.map((asn) => {
                  const r = reviewerById.get(asn.reviewer_id);
                  const matches = a.topic_id ? (r?.topicIds ?? []).includes(a.topic_id) : false;
                  return (
                    <span
                      key={asn.id}
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span className={matches ? "" : "text-muted-foreground"}>
                        {r?.name ?? asn.reviewer_id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({loadPerReviewer.get(asn.reviewer_id) ?? 0})
                      </span>
                      {asn.status !== "pending" && (
                        <Badge variant="secondary" className="text-[10px]">
                          {asn.status}
                        </Badge>
                      )}
                      <button
                        type="button"
                        aria-label={`Remove ${r?.name ?? "reviewer"}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeAssignment(a.id, asn.id)}
                        disabled={busy === a.id}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>

              <div className="max-w-md">
                <Select value="" onValueChange={(v) => addReviewer(a.id, v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a reviewer…" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} — {loadPerReviewer.get(r.id) ?? 0} assigned
                        {a.topic_id && r.topicIds.includes(a.topic_id) ? " · topic match" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminAssignments;
