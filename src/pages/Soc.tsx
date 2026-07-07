import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewRow {
  id: string;
  score_technical: number | null;
  score_relevance: number | null;
  score_novelty: number | null;
  score_reproducibility: number | null;
  score_fit_session: number | null;
  recommendation: string | null;
  comments_for_authors: string | null;
  comments_for_soc: string | null;
  assignment: { reviewer_id: string };
}

interface AbstractRow {
  id: string;
  title: string;
  status: string;
  file_path: string | null;
  background: string | null;
  methods: string | null;
  results: string | null;
  conclusion: string | null;
  topic: { name: string } | null;
  authors: { name: string; affiliation: string | null; email: string | null; is_presenting: boolean; author_order: number }[];
  reviews: ReviewRow[];
  fileUrl?: string;
  avgScore: number | null;
  firstAuthor: string;
}

type SortKey = "firstAuthor" | "title" | "avgScore";

const scoreKeys = ["score_technical", "score_relevance", "score_novelty", "score_reproducibility", "score_fit_session"] as const;

const Soc = () => {
  const [rows, setRows] = useState<AbstractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("avgScore");
  const [asc, setAsc] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("abstracts")
        .select(`
          id, title, status, file_path, background, methods, results, conclusion,
          topic:topics(name),
          authors:abstract_authors(name, affiliation, email, is_presenting, author_order),
          assignments:review_assignments(id, reviewer_id, reviews(id, score_technical, score_relevance, score_novelty, score_reproducibility, score_fit_session, recommendation, comments_for_authors, comments_for_soc))
        `);

      const enriched: AbstractRow[] = await Promise.all(
        (data ?? []).map(async (a: any) => {
          const reviews: ReviewRow[] = (a.assignments ?? []).flatMap((asn: any) =>
            (asn.reviews ?? []).map((r: any) => ({ ...r, assignment: { reviewer_id: asn.reviewer_id } }))
          );
          const allScores = reviews.flatMap((r) => scoreKeys.map((k) => r[k]).filter((n): n is number => n != null));
          const avg = allScores.length ? allScores.reduce((s, n) => s + n, 0) / allScores.length : null;

          const sortedAuthors = [...(a.authors ?? [])].sort((x, y) => x.author_order - y.author_order);
          const firstAuthor = sortedAuthors[0]?.name ?? "";

          let fileUrl: string | undefined;
          if (a.file_path) {
            const { data: signed } = await supabase.storage.from("abstracts").createSignedUrl(a.file_path, 3600);
            fileUrl = signed?.signedUrl;
          }

          return {
            id: a.id,
            title: a.title,
            status: a.status,
            file_path: a.file_path,
            background: a.background, methods: a.methods, results: a.results, conclusion: a.conclusion,
            topic: a.topic,
            authors: sortedAuthors,
            reviews,
            fileUrl,
            avgScore: avg,
            firstAuthor,
          };
        })
      );
      setRows(enriched);
      setLoading(false);
    })();
  }, []);

  const sorted = useMemo(() => {
    const s = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "avgScore") {
        cmp = (a.avgScore ?? -1) - (b.avgScore ?? -1);
      } else {
        cmp = (a[sortKey] ?? "").toString().localeCompare((b[sortKey] ?? "").toString());
      }
      return asc ? cmp : -cmp;
    });
    return s;
  }, [rows, sortKey, asc]);

  if (loading) return <div className="container py-16 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="container max-w-6xl py-12 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">SOC dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          {(["firstAuthor", "title", "avgScore"] as SortKey[]).map((k) => (
            <Button key={k} size="sm" variant={sortKey === k ? "default" : "outline"}
              onClick={() => { if (sortKey === k) setAsc(!asc); else { setSortKey(k); setAsc(k !== "avgScore"); } }}>
              {k === "firstAuthor" ? "First author" : k === "title" ? "Title" : "Avg score"}
              {sortKey === k ? (asc ? " ↑" : " ↓") : ""}
            </Button>
          ))}
        </div>
      </div>

      {sorted.length === 0 && (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No submissions yet.</CardContent></Card>
      )}

      {sorted.map((a) => (
        <Card key={a.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wide text-secondary font-semibold">
                  {a.topic?.name ?? "—"}
                </div>
                <CardTitle className="mt-1">{a.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {a.authors.map((au) => `${au.name}${au.is_presenting ? "*" : ""}`).join(", ")}
                </p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="outline">{a.status}</Badge>
                <div className="text-2xl font-bold text-primary">
                  {a.avgScore != null ? a.avgScore.toFixed(2) : "—"}
                </div>
                <div className="text-xs text-muted-foreground">avg of {a.reviews.length} review{a.reviews.length === 1 ? "" : "s"}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {a.fileUrl && (
              <a href={a.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary underline">
                <FileText className="h-4 w-4" /> Open PDF
              </a>
            )}

            <details className="text-sm">
              <summary className="cursor-pointer font-medium">Structured abstract</summary>
              <div className="mt-2 space-y-2 text-muted-foreground">
                {(["background", "methods", "results", "conclusion"] as const).map((k) => (
                  <div key={k}>
                    <div className="font-semibold text-foreground capitalize">{k}</div>
                    <div className="whitespace-pre-wrap">{a[k] ?? "—"}</div>
                  </div>
                ))}
              </div>
            </details>

            <div>
              <div className="font-semibold text-sm mb-2">Reviews ({a.reviews.length})</div>
              {a.reviews.length === 0 && <div className="text-sm text-muted-foreground">No reviews submitted.</div>}
              <div className="space-y-2">
                {a.reviews.map((r) => {
                  const scores = scoreKeys.map((k) => r[k]).filter((n): n is number => n != null);
                  const avg = scores.length ? scores.reduce((s, n) => s + n, 0) / scores.length : null;
                  return (
                    <div key={r.id} className="border rounded-md p-3 text-sm space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Reviewer {r.assignment.reviewer_id.slice(0, 8)}</span>
                        <Badge>{r.recommendation ?? "—"}</Badge>
                        <span className="ml-auto font-semibold">avg {avg?.toFixed(2) ?? "—"}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        <span>Tech: {r.score_technical ?? "—"}</span>
                        <span>Rel: {r.score_relevance ?? "—"}</span>
                        <span>Nov: {r.score_novelty ?? "—"}</span>
                        <span>Repro: {r.score_reproducibility ?? "—"}</span>
                        <span>Fit: {r.score_fit_session ?? "—"}</span>
                      </div>
                      {r.comments_for_authors && <div><span className="font-medium">To authors:</span> {r.comments_for_authors}</div>}
                      {r.comments_for_soc && <div><span className="font-medium">To chairs:</span> {r.comments_for_soc}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Soc;
