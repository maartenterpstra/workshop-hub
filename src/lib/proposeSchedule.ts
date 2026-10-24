import { programDays } from "@/data/program";

/** Format from the Program page: 30-min expert talk, then 5 proffered papers of 9 min + 3 min discussion. */
export const EXPERT_TALK_MIN = 30;
export const PAPER_SLOT_MIN = 12;
export const PAPERS_PER_SESSION = 5;

export type SessionInfo = { id: string; title: string; time: string };

export const sessions: SessionInfo[] = programDays.flatMap((d) =>
  d.rows.flatMap((r) => (r.kind === "session" ? [{ id: r.id, title: r.title, time: r.time }] : [])),
);

export type Candidate = { abstractId: string; topic: string | null; score: number | null; decision: "oral" | "poster" };
export type Slot = { abstractId: string; sessionId: string; kind: "oral" | "poster"; position: number; startTime: string | null; endTime: string | null };

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Start/end time of the n-th (0-based) paper in a session. */
export function paperTime(sessionId: string, position: number): { start: string; end: string } | null {
  const s = sessions.find((x) => x.id === sessionId);
  if (!s) return null;
  const start = toMin(s.time.split("–")[0]) + EXPERT_TALK_MIN + position * PAPER_SLOT_MIN;
  return { start: fmt(start), end: fmt(start + PAPER_SLOT_MIN) };
}

export const sessionForTopic = (topic: string | null) =>
  sessions.find((s) => s.title === topic)?.id ?? sessions[0]?.id ?? "S1";

/** Recompute positions and times for a list of slots (orals get times, posters don't). */
export function retime(slots: Slot[]): Slot[] {
  const out: Slot[] = [];
  for (const s of sessions) {
    const inS = slots.filter((x) => x.sessionId === s.id);
    inS.filter((x) => x.kind === "oral").sort((a, b) => a.position - b.position).forEach((x, i) => {
      const t = paperTime(s.id, i);
      out.push({ ...x, position: i, startTime: t?.start ?? null, endTime: t?.end ?? null });
    });
    inS.filter((x) => x.kind === "poster").sort((a, b) => a.position - b.position).forEach((x, i) =>
      out.push({ ...x, position: i, startTime: null, endTime: null }));
  }
  return out;
}

/**
 * Orals go into the session matching their topic, best score first; when a session has more
 * than PAPERS_PER_SESSION orals, the lowest-scoring ones are suggested as posters.
 */
export function proposeSchedule(cands: Candidate[]): Slot[] {
  const slots: Slot[] = [];
  const bySession = new Map<string, Candidate[]>();
  for (const c of cands) {
    const sid = sessionForTopic(c.topic);
    bySession.set(sid, [...(bySession.get(sid) ?? []), c]);
  }
  for (const [sid, list] of bySession) {
    const sorted = [...list].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    let oralCount = 0, posterCount = 0;
    for (const c of sorted) {
      const oral = c.decision === "oral" && oralCount < PAPERS_PER_SESSION;
      slots.push({ abstractId: c.abstractId, sessionId: sid, kind: oral ? "oral" : "poster",
        position: oral ? oralCount++ : posterCount++, startTime: null, endTime: null });
    }
  }
  return retime(slots);
}
