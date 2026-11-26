/** Runs fn up to `tries` times; each attempt is capped at `timeoutMs`. */
export async function withRetry<T>(fn: () => Promise<T>, tries = 3, timeoutMs = 60_000, delayMs = 1000): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await Promise.race([
        fn(),
        new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Timed out after " + Math.round(timeoutMs / 1000) + " seconds")), timeoutMs)),
      ]);
    } catch (e) {
      lastErr = e;
      if (i < tries - 1 && delayMs > 0) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

/** Wraps a Supabase-style {error} result so failures throw (and can be retried). */
export async function unwrap<T extends { error: any }>(p: PromiseLike<T>): Promise<T> {
  const r = await p;
  if (r.error) throw r.error;
  return r;
}

export class StepError extends Error {
  constructor(public step: string, public friendly: string, public cause?: unknown) {
    super(friendly);
  }
}
