import { describe, expect, test } from "bun:test";
import { sessionCounts } from "../src/lib/sessionCounts";

const res = sessionCounts(["A", "B", "C"], [
  { topic: "A", status: "submitted", secondTopic: "C" },
  { topic: "A", status: "withdrawn" },
  { topic: "B", status: "accepted_oral" },
  { topic: "B", status: "withdrawn", secondTopic: "C" },
  { topic: null, status: "submitted" },
]);

describe("sessionCounts", () => {
  test("counts per session with withdrawn separate", () => {
    expect(res.rows[0]).toEqual({ session: "A", active: 1, withdrawn: 1, total: 2, secondChoice: 0 });
  });
  test("empty sessions listed", () => {
    expect(res.rows[2]).toEqual({ session: "C", active: 0, withdrawn: 0, total: 0, secondChoice: 1 });
  });
  test("no session row", () => {
    expect(res.rows[3]).toEqual({ session: "No session", active: 1, withdrawn: 0, total: 1, secondChoice: 0 });
  });
  test("total row", () => {
    expect(res.total).toEqual({ session: "Total", active: 3, withdrawn: 2, total: 5, secondChoice: 1 });
  });
});
