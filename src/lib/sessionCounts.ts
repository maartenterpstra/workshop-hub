export type SessionCountRow = { session: string; active: number; withdrawn: number; total: number };

export function sessionCounts(
  topics: string[],
  abstracts: { topic: string | null; status: string }[],
): { rows: SessionCountRow[]; total: SessionCountRow } {
  const map = new Map<string, SessionCountRow>();
  for (const t of topics) map.set(t, { session: t, active: 0, withdrawn: 0, total: 0 });
  for (const a of abstracts) {
    const key = a.topic ?? "No session";
    if (!map.has(key)) map.set(key, { session: key, active: 0, withdrawn: 0, total: 0 });
    const r = map.get(key)!;
    if (a.status === "withdrawn") r.withdrawn++; else r.active++;
    r.total++;
  }
  const rows = [...map.values()];
  const total = rows.reduce(
    (s, r) => ({ ...s, active: s.active + r.active, withdrawn: s.withdrawn + r.withdrawn, total: s.total + r.total }),
    { session: "Total", active: 0, withdrawn: 0, total: 0 },
  );
  return { rows, total };
}
