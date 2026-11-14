import { SCORE_CRITERIA, criterionAverages, totalAverage, formatScore } from "@/lib/scoring";

const SocScoreTable = ({ reviews }: { reviews: Record<string, any>[] }) => {
  const per = criterionAverages(reviews);
  const total = totalAverage(reviews);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-md">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {SCORE_CRITERIA.map(([, l]) => <th key={l} className="px-2 py-1 text-left font-medium">{l}</th>)}
            <th className="px-2 py-1 text-left font-semibold text-foreground">Total average ({reviews.length} review{reviews.length === 1 ? "" : "s"})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {per.map((v, i) => <td key={i} className="px-2 py-1">{formatScore(v)}</td>)}
            <td className="px-2 py-1 font-bold text-primary">{formatScore(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SocScoreTable;
