import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppConfig } from "@/hooks/useAppConfig";

interface Assignment {
  id: string;
  abstract: {
    id: string;
    title: string;
    background: string | null;
    methods: string | null;
    results: string | null;
    conclusion: string | null;
    file_path: string | null;
    topic: { name: string } | null;
  };
  existingReview?: ReviewRow;
  fileUrl?: string;
}

interface ReviewRow {
  id?: string;
  score_technical: number | null;
  score_relevance: number | null;
  score_novelty: number | null;
  score_reproducibility: number | null;
  score_fit_session: number | null;
  recommendation: "accept_oral" | "accept_poster" | "reject" | null;
  comments_for_authors: string | null;
  comments_for_soc: string | null;
}

const emptyReview: ReviewRow = {
  score_technical: null,
  score_relevance: null,
  score_novelty: null,
  score_reproducibility: null,
  score_fit_session: null,
  recommendation: null,
  comments_for_authors: "",
  comments_for_soc: "",
};

const scoreFields: { key: keyof ReviewRow; label: string }[] = [
  { key: "score_technical", label: "Technical rigor" },
  { key: "score_relevance", label: "Clinical / translational relevance to RT" },
  { key: "score_novelty", label: "Novelty" },
  { key: "score_reproducibility", label: "Reproducibility (data + code)" },
  { key: "score_fit_session", label: "Fit to session" },
];

const Review = () => {
  const { user } = useAuth();
  const { submissionClosed, debug, loading: cfgLoading } = useAppConfig();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ReviewRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!user || (!submissionClosed && !debug)) { setLoading(false); return; }
    (async () => {
      const { data: assigns } = await supabase
        .from("review_assignments")
        .select(`id, abstract:abstracts(id, title, background, methods, results, conclusion, file_path, topic:topics(name))`)
        .eq("reviewer_id", user.id);

      const rows = (assigns ?? []) as any[];
      const enriched: Assignment[] = [];
      const nextDrafts: Record<string, ReviewRow> = {};

      for (const a of rows) {
        const { data: existing } = await supabase
          .from("reviews")
          .select("*")
          .eq("assignment_id", a.id)
          .maybeSingle();

        let fileUrl: string | undefined;
        if (a.abstract?.file_path) {
          const { data: signed } = await supabase.storage
            .from("abstracts")
            .createSignedUrl(a.abstract.file_path, 3600);
          fileUrl = signed?.signedUrl;
        }
        enriched.push({ ...a, existingReview: existing ?? undefined, fileUrl });
        nextDrafts[a.id] = existing
          ? {
              id: existing.id,
              score_technical: existing.score_technical,
              score_relevance: existing.score_relevance,
              score_novelty: existing.score_novelty,
              score_reproducibility: existing.score_reproducibility,
              score_fit_session: existing.score_fit_session,
              recommendation: existing.recommendation,
              comments_for_authors: existing.comments_for_authors,
              comments_for_soc: existing.comments_for_soc,
            }
          : { ...emptyReview };
      }
      setAssignments(enriched);
      setDrafts(nextDrafts);
      setLoading(false);
    })();
  }, [user, submissionClosed, debug]);

  const setField = (aid: string, patch: Partial<ReviewRow>) =>
    setDrafts((prev) => ({ ...prev, [aid]: { ...prev[aid], ...patch } }));

  const submitReview = async (a: Assignment) => {
    const d = drafts[a.id];
    if (!d) return;
    for (const f of scoreFields) {
      if (!d[f.key]) { toast.error(`Please score: ${f.label}`); return; }
    }
    if (!d.recommendation) { toast.error("Please pick a recommendation."); return; }

    setSaving(a.id);
    try {
      const payload = {
        assignment_id: a.id,
        score_technical: d.score_technical,
        score_relevance: d.score_relevance,
        score_novelty: d.score_novelty,
        score_reproducibility: d.score_reproducibility,
        score_fit_session: d.score_fit_session,
        recommendation: d.recommendation,
        comments_for_authors: d.comments_for_authors,
        comments_for_soc: d.comments_for_soc,
      };
      const { error } = d.id
        ? await supabase.from("reviews").update(payload).eq("id", d.id)
        : await supabase.from("reviews").insert(payload);
      if (error) throw error;
      await supabase.from("review_assignments").update({ status: "done" }).eq("id", a.id);
      toast.success("Review saved.");
    } catch (err: any) {
      toast.error(err.message ?? "Save failed.");
    } finally {
      setSaving(null);
    }
  };

  if (cfgLoading || loading) {
    return <div className="container py-16 text-center text-muted-foreground">Loading…</div>;
  }

  if (!submissionClosed && !debug) {
    return (
      <div className="container max-w-2xl py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold">Reviews open after submission closes</h1>
        <p className="text-muted-foreground">You'll see your assigned abstracts here once the submission window has closed.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviewer dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {assignments.length} abstract{assignments.length === 1 ? "" : "s"} assigned. Authors are blinded.
        </p>
      </div>

      {assignments.length === 0 && (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No assignments.</CardContent></Card>
      )}

      {assignments.map((a) => {
        const d = drafts[a.id];
        return (
          <Card key={a.id}>
            <CardHeader>
              <div className="text-xs uppercase tracking-wide text-secondary font-semibold">
                {a.abstract.topic?.name ?? "—"}
              </div>
              <CardTitle>{a.abstract.title}</CardTitle>
              <CardDescription>Assignment {a.id.slice(0, 8)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {a.fileUrl && (
                <div className="border rounded-md overflow-hidden">
                  <div className="flex items-center gap-2 p-2 text-sm bg-muted">
                    <FileText className="h-4 w-4" /> Abstract PDF
                    <a href={a.fileUrl} target="_blank" rel="noreferrer" className="ml-auto text-primary underline">Open</a>
                  </div>
                  <iframe src={a.fileUrl} title="abstract" className="w-full" style={{ height: 480 }} />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {scoreFields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label>{f.label} (1–5)</Label>
                    <Select
                      value={d[f.key] ? String(d[f.key]) : ""}
                      onValueChange={(v) => setField(a.id, { [f.key]: Number(v) } as any)}
                    >
                      <SelectTrigger><SelectValue placeholder="Score…" /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <div className="space-y-1">
                  <Label>Recommendation</Label>
                  <Select
                    value={d.recommendation ?? ""}
                    onValueChange={(v) => setField(a.id, { recommendation: v as any })}
                  >
                    <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accept_oral">Oral</SelectItem>
                      <SelectItem value="accept_poster">Poster</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Comments to authors</Label>
                <Textarea rows={3} value={d.comments_for_authors ?? ""} onChange={(e) => setField(a.id, { comments_for_authors: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Confidential comments to chairs</Label>
                <Textarea rows={3} value={d.comments_for_soc ?? ""} onChange={(e) => setField(a.id, { comments_for_soc: e.target.value })} />
              </div>

              <Button onClick={() => submitReview(a)} disabled={saving === a.id}>
                {saving === a.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : d.id ? "Update review" : "Submit review"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Review;
