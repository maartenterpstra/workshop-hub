import AbstractFigures from "@/components/AbstractFigures";
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
import { formatAmsterdam } from "@/lib/formatDate";

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
    abstract_number: number | null;
    figure_paths: string[] | null;
    topic: { name: string } | null;
  };
  existingReview?: ReviewRow;
}

interface ReviewRow {
  id?: string;
  score_technical: number | null;
  score_relevance: number | null;
  score_novelty: number | null;
  score_reproducibility: number | null;
  score_fit_session: number | null;
  recommendation: "accept_oral" | "accept_poster" | "reject" | "revise" | null; // poster blocked by DB constraint
  comments_for_authors: string | null;
  comments_for_soc: string | null;
  feedback_value: string | null;
  feedback_improve: string | null;
  feedback_tips: string | null;
}

const feedbackFields: { key: "feedback_value" | "feedback_improve" | "feedback_tips"; label: string; hint: string }[] = [
  { key: "feedback_value", label: "1. Where is the value?", hint: "What is the strongest part of this work?" },
  { key: "feedback_improve", label: "2. What could be done better to increase the impact?", hint: "Concrete, actionable suggestions." },
  { key: "feedback_tips", label: "3. Any tips?", hint: "E.g. references, analyses, or presentation advice." },
];

const emptyReview: ReviewRow = {
  score_technical: null,
  score_relevance: null,
  score_novelty: null,
  score_reproducibility: null,
  score_fit_session: null,
  recommendation: null,
  comments_for_authors: "",
  comments_for_soc: "",
  feedback_value: "",
  feedback_improve: "",
  feedback_tips: "",
};

const scoreFields: { key: keyof ReviewRow; label: string }[] = [
  { key: "score_technical", label: "Technical rigor" },
  { key: "score_relevance", label: "Clinical / translational relevance to RT" },
  { key: "score_novelty", label: "Novelty" },
  { key: "score_reproducibility", label: "Reproducibility (data + code)" },
  { key: "score_fit_session", label: "Fit to session" },
];

import { DEMO_ABSTRACT_ID } from "@/lib/demoAbstract";
import PdfViewerDialog from "@/components/PdfViewerDialog";
import { formatAbstractNumber } from "@/lib/abstractNumber";

const Review = () => {
  const { user } = useAuth();
  const { submissionClosed, reviewOpen, reviewClosed, reviewClosesAt, debug, loading: cfgLoading } = useAppConfig();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ReviewRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const isDemo = (a: Assignment) => a.abstract?.id === DEMO_ABSTRACT_ID;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const previewOnly = !submissionClosed && !debug;
    (async () => {
      const { data: assigns } = await supabase
        .from("review_assignments")
        .select(`id, abstract:abstracts(id, abstract_number, title, background, methods, results, conclusion, file_path, figure_paths, topic:topics(name))`)
        .eq("reviewer_id", user.id);

      const rows = ((assigns ?? []) as any[]).filter((a) => !previewOnly || a.abstract?.id === DEMO_ABSTRACT_ID)
        .sort((x, y) => Number(x.abstract?.id === DEMO_ABSTRACT_ID) - Number(y.abstract?.id === DEMO_ABSTRACT_ID));
      const enriched: Assignment[] = [];
      const nextDrafts: Record<string, ReviewRow> = {};

      for (const a of rows) {
        const { data: existing } = await supabase
          .from("reviews")
          .select("*")
          .eq("assignment_id", a.id)
          .maybeSingle();

        enriched.push({ ...a, existingReview: existing ?? undefined });
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
              feedback_value: existing.feedback_value ?? "",
              feedback_improve: existing.feedback_improve ?? "",
              feedback_tips: existing.feedback_tips ?? "",
            }
          : { ...emptyReview };
      }
      setAssignments(enriched);
      setDrafts(nextDrafts);
      const { data: noteRows } = await supabase
        .from("reviewer_notes").select("assignment_id, notes").eq("reviewer_id", user.id);
      setNotes(Object.fromEntries((noteRows ?? []).map((n) => [n.assignment_id, n.notes ?? ""])));
      setLoading(false);
    })();
  }, [user, submissionClosed, debug]);

  const [pdf, setPdf] = useState<{ path: string; title: string; number?: string } | null>(null);
  const openAbstractPdf = (filePath: string, title: string, number?: string) => setPdf({ path: filePath, title, number });

  const setField = (aid: string, patch: Partial<ReviewRow>) =>
    setDrafts((prev) => ({ ...prev, [aid]: { ...prev[aid], ...patch } }));

  const saveNotes = async (aid: string) => {
    if (!user || assignments.find((x) => x.id === aid && isDemo(x))) return;
    const { error } = await supabase.from("reviewer_notes").upsert({
      assignment_id: aid, reviewer_id: user.id, notes: notes[aid] ?? "", updated_at: new Date().toISOString(),
    });
    if (error) toast.error("Notes could not be saved.");
  };

  const submitReview = async (a: Assignment) => {
    if (!reviewOpen && !isDemo(a)) {
      toast.error("The review period is closed.");
      return;
    }
    const d = drafts[a.id];
    if (!d) return;
    for (const f of scoreFields) {
      if (!d[f.key]) { toast.error(`Please score: ${f.label}`); return; }
    }
    if (!d.recommendation) { toast.error("Please pick a recommendation."); return; }
    for (const f of feedbackFields) {
      if (!(d[f.key] ?? "").trim()) { toast.error(`Please answer: ${f.label}`); return; }
    }

    if (isDemo(a)) {
      toast.success("Looks good! This was the example abstract, so nothing was saved.");
      return;
    }
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
        feedback_value: d.feedback_value!.trim(),
        feedback_improve: d.feedback_improve!.trim(),
        feedback_tips: d.feedback_tips!.trim(),
        comments_for_authors: [
          `Where is the value? ${d.feedback_value!.trim()}`,
          `What could be done better? ${d.feedback_improve!.trim()}`,
          `Tips: ${d.feedback_tips!.trim()}`,
        ].join("\n"),
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

  if (!submissionClosed && !debug && assignments.length === 0) {
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
          {assignments.length} abstract{assignments.length === 1 ? "" : "s"} assigned. Authors are
          blinded. Abstracts appear here once the organisers have confirmed your review panel.
        </p>
        {reviewClosesAt && (
          <p className="mt-2 text-sm font-medium text-foreground">
            Reviews can be submitted and updated until {formatAmsterdam(reviewClosesAt)}.
          </p>
        )}

        {reviewClosed && (
          <p className="mt-2 text-sm text-destructive">The review period has closed. Saved reviews are read-only.</p>
        )}
      </div>

      <Card className="border-secondary/40 bg-secondary/5">
        <CardHeader><CardTitle className="text-lg">Reviewer guide</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Besides the five scores, please answer three short questions for the authors: <strong>Where is the value?</strong>, <strong>What could be done better to increase the impact?</strong> and <strong>Any tips?</strong></p>
          <p>Be specific, constructive and respectful — write as you would like to receive feedback. Never try to identify the authors, and don't reveal your own identity. Use "Confidential comments to chairs" for anything only the committee should see.</p>
        </CardContent>
      </Card>

      {assignments.length === 0 && (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No assignments.</CardContent></Card>
      )}

      {assignments.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Assigned abstracts">
          {assignments.map((a, i) => {
            const active = (activeId ?? assignments[0].id) === a.id;
            const done = !!drafts[a.id]?.id;
            return (
              <Button key={a.id} role="tab" aria-selected={active} size="sm" variant={active ? "default" : "outline"} onClick={() => setActiveId(a.id)} className="max-w-xs">
                <span className="truncate">{formatAbstractNumber(a.abstract.abstract_number, a.abstract.id)} · {a.abstract.title}</span>
                <span className="ml-2 text-xs opacity-80">{isDemo(a) ? "practice" : done ? "submitted" : "to do"}</span>
              </Button>
            );
          })}
        </div>
      )}

      {assignments.filter((a) => (activeId ?? assignments[0]?.id) === a.id).map((a) => {
        const d = drafts[a.id];
        const open = reviewOpen || isDemo(a);
        return (
          <Card key={a.id}>
            <CardHeader>
              <div className="text-xs uppercase tracking-wide text-secondary font-semibold">
                {a.abstract.topic?.name ?? "—"}
              </div>
              <CardTitle><span className="mr-2 font-mono text-sm text-muted-foreground">{formatAbstractNumber(a.abstract.abstract_number, a.abstract.id)}</span>{a.abstract.title}</CardTitle>
              <CardDescription>Assignment {a.id.slice(0, 8)}</CardDescription>
              {isDemo(a) && (
                <p className="mt-2 rounded-md border border-accent/40 bg-accent/10 p-3 text-sm text-foreground">
                  <strong>Example – not scored.</strong> This fictional abstract lets you try the review form. Nothing you enter here is saved or sent.
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {a.abstract.file_path && (
                <div className="flex items-center gap-2 rounded-md border p-3 text-sm bg-muted">
                  <FileText className="h-4 w-4" /> Abstract PDF
                  <Button
                    type="button"
                    variant="link"
                    className="ml-auto h-auto p-0"
                    onClick={() => openAbstractPdf(a.abstract.file_path!, a.abstract.title, formatAbstractNumber(a.abstract.abstract_number, a.abstract.id))}
                  >
                    Open securely
                  </Button>
                </div>
              )}

              <AbstractFigures paths={a.abstract.figure_paths} />

              <div className="grid gap-4 md:grid-cols-2">
                {scoreFields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label>{f.label} (1–5)</Label>
                    <Select
                      value={d[f.key] ? String(d[f.key]) : ""}
                      onValueChange={(v) => setField(a.id, { [f.key]: Number(v) } as any)}
                      disabled={!open}
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
                    disabled={!open}
                  >
                    <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accept_oral">Oral</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 rounded-md border p-4">
                <div>
                  <div className="font-semibold">Constructive feedback for the authors</div>
                  <p className="text-xs text-muted-foreground">Required. 1–3 sentences each. Shared anonymously with the authors with their decision.</p>
                </div>
                {feedbackFields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label>{f.label}</Label>
                    <p className="text-xs text-muted-foreground">{f.hint}</p>
                    <Textarea disabled={!open} rows={2} maxLength={2000} value={d[f.key] ?? ""} onChange={(e) => setField(a.id, { [f.key]: e.target.value } as any)} />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label>Confidential comments to chairs</Label>
                <p className="text-xs text-muted-foreground">Only visible to the scientific committee.</p>
                <Textarea disabled={!open} rows={3} value={d.comments_for_soc ?? ""} onChange={(e) => setField(a.id, { comments_for_soc: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Personal notes</Label>
                <p className="text-xs text-muted-foreground">Private to you — not shared, not scored. Saved automatically when you leave the box.</p>
                <Textarea
                  rows={3}
                  value={notes[a.id] ?? ""}
                  onChange={(e) => setNotes((p) => ({ ...p, [a.id]: e.target.value }))}
                  onBlur={() => saveNotes(a.id)}
                />
              </div>

              <Button onClick={() => submitReview(a)} disabled={saving === a.id || !open}>
                {saving === a.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : isDemo(a) ? "Try it (not saved)" : d.id ? "Update review" : "Submit review"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
      <PdfViewerDialog path={pdf?.path ?? null} title={pdf?.title} number={pdf?.number} onClose={() => setPdf(null)} />
    </div>
  );
};

export default Review;
