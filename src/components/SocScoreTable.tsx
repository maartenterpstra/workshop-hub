const crit = [
  ["score_technical", "Technical"],
  ["score_relevance", "Relevance"],
  ["score_novelty", "Novelty"],
  ["score_reproducibility", "Reproducibility"],
  ["score_fit_session", "Session fit"],
] as const;

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, n) => s + n, 0) / xs.length : null);

const SocScoreTable = ({ reviews }: { reviews: Record<string, any>[] }) => {
  const per = crit.map(([k]) => avg(reviews.map((r) => r[k]).filter((n): n is number => typeof n === "number")));
  const total = avg(reviews.flatMap((r) => crit.map(([k]) => r[k]).filter((n): n is number => typeof n === "number")));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-md">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {crit.map(([, l]) => <th key={l} className="px-2 py-1 text-left font-medium">{l}</th>)}
            <th className="px-2 py-1 text-left font-semibold text-foreground">Total average</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {per.map((v, i) => <td key={i} className="px-2 py-1">{v?.toFixed(2) ?? "—"}</td>)}
            <td className="px-2 py-1 font-bold text-primary">{total?.toFixed(2) ?? "—"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SocScoreTable;
