import { describe, expect, test } from "bun:test";
import { proposeSchedule, paperTime } from "../src/lib/proposeSchedule";

const oral = (id: string, score: number) => ({ abstractId: id, topic: "Segmentation & Registration", score, decision: "oral" as const });

describe("proposeSchedule", () => {
  test("a session holds at most 5 orals; the lowest-scoring extras become posters", () => {
    const slots = proposeSchedule([1, 2, 3, 4, 5, 6, 7].map((n) => oral(`a${n}`, n)));
    const orals = slots.filter((s) => s.kind === "oral");
    expect(orals.length).toBe(5);
    expect(slots.filter((s) => s.kind === "poster").map((s) => s.abstractId).sort()).toEqual(["a1", "a2"]);
  });

  test("the best-scoring oral comes first, right after the 30-minute expert talk", () => {
    const slots = proposeSchedule([oral("low", 2), oral("high", 4.5)]);
    const first = slots.find((s) => s.position === 0 && s.kind === "oral")!;
    expect(first.abstractId).toBe("high");
    expect(first.startTime).toBe("10:00"); // S1 starts 09:30
    expect(first.endTime).toBe("10:12");
  });

  test("the fifth paper ends exactly when the 90-minute session ends", () => {
    expect(paperTime("S1", 4)).toEqual({ start: "10:48", end: "11:00" });
  });

  test("poster decisions never get a time slot", () => {
    const slots = proposeSchedule([{ abstractId: "p", topic: "Dose & Adaptive Workflows", score: 5, decision: "poster" }]);
    expect(slots[0]).toMatchObject({ sessionId: "S4", kind: "poster", startTime: null });
  });
});
