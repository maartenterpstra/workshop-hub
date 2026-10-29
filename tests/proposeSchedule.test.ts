import { describe, expect, test } from "bun:test";
import { proposeSchedule, paperTime, canPublish } from "../src/lib/proposeSchedule";

const oral = (id: string, score: number) => ({ abstractId: id, topic: "Segmentation & Registration", score, decision: "oral" as const });

describe("proposeSchedule", () => {
  test("a 6th accepted talk in a session is flagged over capacity, never a poster", () => {
    const slots = proposeSchedule([1, 2, 3, 4, 5, 6].map((n) => oral(`a${n}`, n)));
    expect(slots.length).toBe(6);
    expect(slots.every((s) => s.kind === "oral")).toBe(true);
    expect(slots.filter((s) => s.overCapacity).map((s) => s.abstractId)).toEqual(["a1"]);
  });

  test("the schedule can't be published while a session is over capacity", () => {
    expect(canPublish(proposeSchedule([1, 2, 3, 4, 5, 6].map((n) => oral(`a${n}`, n))))).toBe(false);
    expect(canPublish(proposeSchedule([1, 2, 3, 4, 5].map((n) => oral(`a${n}`, n))))).toBe(true);
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

});
