import { describe, expect, test } from "bun:test";
import { sessionCounts } from "../src/lib/sessionCounts";

const res = sessionCounts(["A", "B", "C"], [
  { topic: "A", status: "submitted" },
  { topic: "A", status: "withdrawn" },
  { topic: "B", status: "accepted_oral" },
  { topic: null, status: "submitted" },
]);

describe("sessionCounts", () => {
  test("counts per session with withdrawn separate", () => {
    expect(res.rows[0]).toEqual({ session: "A", active: 1, withdrawn: 1, total: 2 });
  });
  test("empty sessions listed", () => {
    expect(res.rows[2]).toEqual({ session: "C", active: 0, withdrawn: 0, total: 0 });
  });
  test("no session row", () => {
    expect(res.rows[3]).toEqual({ session: "No session", active: 1, withdrawn: 0, total: 1 });
  });
  test("total row", () => {
    expect(res.total).toEqual({ session: "Total", active: 3, withdrawn: 1, total: 4 });
  });
});
