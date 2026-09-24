import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toCsv, downloadCsv, todayStamp } from "@/lib/csv";

const scoreKeys = [
  "score_technical",
  "score_relevance",
  "score_novelty",
  "score_reproducibility",
  "score_fit_session",
] as const;

const AdminExports = () => {
  const [busy, setBusy] = useState<string | null>(null);

  const exportScores = async () => {
    setBusy("scores");
    try {
      const [{ data: abstracts, error: aErr }, { data: profiles, error: pErr }] = await Promise.all([
        supabase.from("abstracts").select(
          `id, title, status, topic:topics(name),
           assignments:review_assignments(id, reviewer_id, status,
             reviews(id, score_technical, score_relevance, score_novelty, score_reproducibility, score_fit_session, recommendation, comments_for_authors, comments_for_soc, submitted_at))`,
        ),
        supabase.from("profiles").select("id, full_name, email"),
      ]);
      if (aErr) throw aErr;
      if (pErr) throw pErr;

      const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
      const rows: unknown[][] = [];

      for (const a of (abstracts ?? []) as any[]) {
        for (const asn of a.assignments ?? []) {
          const reviewer = byId.get(asn.reviewer_id);
          const reviews = asn.reviews ?? [];
          if (reviews.length === 0) {
            rows.push([
              a.title,
              a.topic?.name ?? "",
              a.status,
              reviewer?.full_name ?? "",
              reviewer?.email ?? "",
              asn.status,
              "", "", "", "", "", "", "", "", "", "",
            ]);
            continue;
          }
          for (const r of reviews) {
            const scores = scoreKeys
              .map((k) => r[k])
              .filter((n: unknown): n is number => typeof n === "number");
            const avg = scores.length
              ? (scores.reduce((s: number, n: number) => s + n, 0) / scores.length).toFixed(2)
              : "";
            rows.push([
              a.title,
              a.topic?.name ?? "",
              a.status,
              reviewer?.full_name ?? "",
              reviewer?.email ?? "",
              asn.status,
              r.score_technical ?? "",
              r.score_relevance ?? "",
              r.score_novelty ?? "",
              r.score_reproducibility ?? "",
              r.score_fit_session ?? "",
              avg,
              r.recommendation ?? "",
              r.comments_for_authors ?? "",
              r.comments_for_soc ?? "",
              r.submitted_at ?? "",
            ]);
          }
        }
      }

      downloadCsv(
        `aiinrt2027-review-scores-${todayStamp()}.csv`,
        toCsv(
          [
            "Abstract title",
            "Topic",
            "Abstract status",
            "Reviewer name",
            "Reviewer email",
            "Assignment status",
            "Technical",
            "Relevance",
            "Novelty",
            "Reproducibility",
            "Session fit",
            "Average",
            "Recommendation",
            "Comments for authors",
            "Comments for chairs",
            "Review submitted at",
          ],
          rows,
        ),
      );
      toast.success(`Exported ${rows.length} review row${rows.length === 1 ? "" : "s"}.`);
    } catch (e: any) {
      toast.error(e.message ?? "Export failed.");
    } finally {
      setBusy(null);
    }
  };

  const exportAuthors = async () => {
    setBusy("authors");
    try {
      const [{ data: abstracts, error: aErr }, { data: profiles, error: pErr }] = await Promise.all([
        supabase
          .from("abstracts")
          .select(
            `id, title, status, submitted_by, submitted_at, topic:topics(name),
             authors:abstract_authors(name, affiliation, email, is_presenting, author_order)`,
          )
          .order("submitted_at", { ascending: true }),
        supabase.from("profiles").select("id, full_name, email"),
      ]);
      if (aErr) throw aErr;
      if (pErr) throw pErr;

      const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
      const rows: unknown[][] = [];

      for (const a of (abstracts ?? []) as any[]) {
        const submitter = byId.get(a.submitted_by);
        const authors = [...(a.authors ?? [])].sort(
          (x: any, y: any) => x.author_order - y.author_order,
        );
        if (authors.length === 0) {
          rows.push([
            a.title,
            a.topic?.name ?? "",
            a.status,
            submitter?.email ?? "",
            submitter?.full_name ?? "",
            "", "", "", "",
            a.submitted_at ?? "",
          ]);
          continue;
        }
        for (const au of authors as any[]) {
          rows.push([
            a.title,
            a.topic?.name ?? "",
            a.status,
            submitter?.email ?? "",
            submitter?.full_name ?? "",
            au.name ?? "",
            au.email ?? "",
            au.affiliation ?? "",
            au.is_presenting ? "yes" : "no",
            a.submitted_at ?? "",
          ]);
        }
      }

      downloadCsv(
        `aiinrt2027-abstracts-authors-${todayStamp()}.csv`,
        toCsv(
          [
            "Abstract title",
            "Topic",
            "Status",
            "Submitting account email",
            "Submitting account name",
            "Author name",
            "Author email",
            "Author affiliation",
            "Presenting author",
            "Submitted at",
          ],
          rows,
        ),
      );
      toast.success(`Exported ${rows.length} author row${rows.length === 1 ? "" : "s"}.`);
    } catch (e: any) {
      toast.error(e.message ?? "Export failed.");
    } finally {
      setBusy(null);
    }
  };


  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Exports</CardTitle>
        <CardDescription>
          Download review scores or the author contact list.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={exportScores} disabled={busy !== null}>
          {busy === "scores" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export review scores (CSV)
        </Button>
        <Button variant="outline" onClick={exportAuthors} disabled={busy !== null}>
          {busy === "authors" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export titles & author emails (CSV)
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminExports;
