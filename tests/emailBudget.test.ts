import { describe, expect, test } from "bun:test";
import { remainingBudget, groupRecipients } from "../supabase/functions/_shared/emailBudget";

describe("email budget", () => {
  test("bulk sends stop at limit minus reserve (100-15)", () => {
    expect(remainingBudget(0, "bulk")).toBe(85);
    expect(remainingBudget(85, "bulk")).toBe(0);
    expect(remainingBudget(120, "bulk")).toBe(0);
  });
  test("confirmations may use the reserve up to 100", () => {
    expect(remainingBudget(85, "confirmation")).toBe(15);
    expect(remainingBudget(100, "confirmation")).toBe(0);
  });
  test("all authors of an abstract share one email", () => {
    expect(groupRecipients(["A@x.org", "a@x.org", "b@y.org", "bad", null])).toEqual([["a@x.org", "b@y.org"]]);
  });
  test("more than 50 addresses are split", () => {
    const many = Array.from({ length: 51 }, (_, i) => `u${i}@x.org`);
    expect(groupRecipients(many).map((g) => g.length)).toEqual([50, 1]);
  });
});
