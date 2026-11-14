export const SCORE_CRITERIA = [
  ["score_technical", "Technical"],
  ["score_relevance", "Relevance"],
  ["score_novelty", "Novelty"],
  ["score_reproducibility", "Reproducibility"],
  ["score_fit_session", "Session fit"],
] as const;

type Review = Record<string, unknown>;
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, n) => s + n, 0) / xs.length : null);
const nums = (xs: unknown[]) => xs.filter((n): n is number => typeof n === "number" && Number.isFinite(n));

/** Average of one reviewer's own scores. */
export const reviewAverage = (r: Review) => mean(nums(SCORE_CRITERIA.map(([k]) => r[k])));

/** Average per criterion across reviews. */
export const criterionAverages = (reviews: Review[]) =>
  SCORE_CRITERIA.map(([k]) => mean(nums(reviews.map((r) => r[k]))));

/** Total = mean of each reviewer's average, so every reviewer counts equally. */
export const totalAverage = (reviews: Review[]) =>
  mean(nums(reviews.map(reviewAverage)));

export const formatScore = (v: number | null | undefined) => (v == null ? "—" : v.toFixed(2));
