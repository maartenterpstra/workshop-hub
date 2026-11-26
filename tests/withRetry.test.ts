import { describe, expect, test } from "bun:test";
import { withRetry } from "../src/lib/withRetry";

describe("withRetry", () => {
  test("retries a failing upload until it succeeds on the 3rd try", async () => {
    let calls = 0;
    const r = await withRetry(async () => { calls++; if (calls < 3) throw new Error("net"); return "ok"; }, 3, 1000, 0);
    expect(r).toBe("ok");
    expect(calls).toBe(3);
  });
  test("gives up after 3 tries", async () => {
    let calls = 0;
    await expect(withRetry(async () => { calls++; throw new Error("blocked"); }, 3, 1000, 0)).rejects.toThrow("blocked");
    expect(calls).toBe(3);
  });
  test("times out a hanging attempt", async () => {
    await expect(withRetry(() => new Promise(() => {}), 1, 20, 0)).rejects.toThrow("Timed out");
  });
});
