import ExcelJS from "exceljs";
import { supabase } from "@/integrations/supabase/client";
import { todayStamp } from "@/lib/csv";

const crit = [
  ["score_technical", "Technical"],
  ["score_relevance", "Relevance"],
  ["score_novelty", "Novelty"],
  ["score_reproducibility", "Reproducibility"],
  ["score_fit_session", "Session fit"],
] as const;

const colL = (n: number) => {
  let s = "";
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
};

const styleHeader = (ws: ExcelJS.Worksheet) => {
  ws.getRow(1).font = { bold: true, name: "Arial" };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.eachRow((r) => r.eachCell((c) => { c.font = { ...(c.font ?? {}), name: "Arial" }; }));
};

export async function exportAbstractsExcel() {
  const { data, error } = await supabase.from("abstracts").select(
    `id, title, status, topic:topics(name),
     authors:abstract_authors(name, email, is_presenting, author_order),
     assignments:review_assignments(id, reviews(id, score_technical, score_relevance, score_novelty, score_reproducibility, score_fit_session, recommendation, comments_for_authors, comments_for_soc, submitted_at))`,
  );
  if (error) throw error;
  const abstracts = ((data ?? []) as any[]).sort((a, b) =>
    (a.topic?.name ?? "").localeCompare(b.topic?.name ?? "") || a.title.localeCompare(b.title),
  );

  const wb = new ExcelJS.Workbook();
  const sum = wb.addWorksheet("Abstracts");
  const rev = wb.addWorksheet("Reviews");

  rev.addRow(["Abstract ID", "Session", "Title", "Review #", ...crit.map((c) => c[1]), "Review average", "Recommendation", "Comments for authors", "Comments for chairs", "Submitted at"]);
  const revFirstScore = 5;
  const revLastScore = revFirstScore + crit.length - 1;
  let rr = 2;
  const revRange: Record<string, [number, number]> = {};

  for (const a of abstracts) {
    const reviews = (a.assignments ?? []).flatMap((x: any) => x.reviews ?? []);
    const start = rr;
    reviews.forEach((r: any, i: number) => {
      rev.addRow([a.id, a.topic?.name ?? "", a.title, i + 1, ...crit.map(([k]) => r[k] ?? null), null, r.recommendation ?? "", r.comments_for_authors ?? "", r.comments_for_soc ?? "", r.submitted_at ?? ""]);
      const range = `${colL(revFirstScore)}${rr}:${colL(revLastScore)}${rr}`;
      rev.getCell(rr, revLastScore + 1).value = { formula: `IF(COUNT(${range})=0,"",AVERAGE(${range}))` };
      rr++;
    });
    if (reviews.length) revRange[a.id] = [start, rr - 1];
  }

  sum.addRow(["Session", "Title", "First author", "Presenting author", "Author emails", "Status", "Reviews", ...crit.map((c) => `Avg ${c[1]}`), "Total average"]);
  const firstAvg = 8;
  abstracts.forEach((a, i) => {
    const row = i + 2;
    const authors = [...(a.authors ?? [])].sort((x: any, y: any) => x.author_order - y.author_order);
    const presenting = authors.find((x: any) => x.is_presenting)?.name ?? "";
    const emails = authors.map((x: any) => x.email).filter(Boolean).join("; ");
    const rg = revRange[a.id];
    sum.addRow([a.topic?.name ?? "", a.title, authors[0]?.name ?? "", presenting, emails, a.status.replace(/_/g, " "), rg ? rg[1] - rg[0] + 1 : 0]);
    crit.forEach((_, j) => {
      const c = sum.getCell(row, firstAvg + j);
      if (rg) {
        const r = `Reviews!${colL(revFirstScore + j)}${rg[0]}:${colL(revFirstScore + j)}${rg[1]}`;
        c.value = { formula: `IF(COUNT(${r})=0,"",AVERAGE(${r}))` };
      }
      c.numFmt = "0.00";
    });
    const t = sum.getCell(row, firstAvg + crit.length);
    if (rg) {
      const r = `Reviews!${colL(revFirstScore)}${rg[0]}:${colL(revLastScore)}${rg[1]}`;
      t.value = { formula: `IF(COUNT(${r})=0,"",AVERAGE(${r}))` };
    }
    t.numFmt = "0.00";
    t.font = { bold: true };
  });

  [18, 50, 22, 22, 40, 16, 9, 12, 12, 12, 14, 12, 13].forEach((w, i) => (sum.getColumn(i + 1).width = w));
  [38, 18, 50, 9, 11, 11, 11, 14, 11, 14, 16, 50, 50, 24].forEach((w, i) => (rev.getColumn(i + 1).width = w));
  rev.getColumn(revLastScore + 1).numFmt = "0.00";
  styleHeader(sum);
  styleHeader(rev);

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const el = document.createElement("a");
  el.href = url;
  el.download = `aiinrt2027-abstracts-scores-${todayStamp()}.xlsx`;
  document.body.appendChild(el);
  el.click();
  el.remove();
  URL.revokeObjectURL(url);
  return abstracts.length;
}
