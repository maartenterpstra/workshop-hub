import { test, expect } from "bun:test";
import { timeLeft } from "../src/lib/countdown";

const deadline = new Date("2026-12-01T12:00:00+01:00");

test("counts down to 1 Dec 2026 12:00 Amsterdam", () => {
  expect(timeLeft(new Date("2026-11-30T10:59:30Z"), deadline)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 30 });
});

test("returns null at and after the deadline", () => {
  expect(timeLeft(new Date("2026-12-01T11:00:00Z"), deadline)).toBeNull();
  expect(timeLeft(new Date("2026-12-02T00:00:00Z"), deadline)).toBeNull();
});
