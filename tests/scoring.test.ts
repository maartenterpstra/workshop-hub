import { describe, expect, test } from "bun:test";
import { criterionAverages, reviewAverage, totalAverage, formatScore } from "../src/lib/scoring";

const full = (v: number) => ({ score_technical: v, score_relevance: v, score_novelty: v, score_reproducibility: v, score_fit_session: v });

describe("SOC scoring", () => {
  test("every reviewer counts equally even if one misses a score", () => {
    const a = full(5);
    const b = { score_technical: 1, score_relevance: null, score_novelty: null, score_reproducibility: null, score_fit_session: null };
    expect(reviewAverage(b)).toBe(1);
    expect(totalAverage([a, b])).toBe(3);
  });
  test("per-criterion averages", () => {
    expect(criterionAverages([full(4), full(2)])).toEqual([3, 3, 3, 3, 3]);
  });
  test("no reviews shows a dash", () => {
    expect(totalAverage([])).toBeNull();
    expect(formatScore(null)).toBe("—");
    expect(formatScore(3.456)).toBe("3.46");
  });
});
