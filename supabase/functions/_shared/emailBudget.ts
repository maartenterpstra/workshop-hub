// Shared daily email budget. One "send" = one API call (one email, possibly to several "To" addresses).
export const DAILY_LIMIT = 100;
export const CONFIRMATION_RESERVE = 15;

/** How many sends are still allowed. Bulk/admin sends cannot use the reserve kept for author confirmations. */
export function remainingBudget(sentLast24h: number, kind: "bulk" | "confirmation", limit = DAILY_LIMIT, reserve = CONFIRMATION_RESERVE): number {
  const cap = kind === "bulk" ? limit - reserve : limit;
  return Math.max(0, cap - sentLast24h);
}

/** Count successful sends in the last 24h. email_log stores one row per send. */
export async function sentLast24h(admin: any): Promise<number> {
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin.from("email_log").select("id", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", since);
  return count ?? 0;
}

/** Group addresses for one email (deduped, lowercase, max 50 per Resend call). */
export function groupRecipients(emails: (string | null | undefined)[], max = 50): string[][] {
  const set = [...new Set(emails.map((e) => (e ?? "").trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))];
  const out: string[][] = [];
  for (let i = 0; i < set.length; i += max) out.push(set.slice(i, i + max));
  return out;
}
