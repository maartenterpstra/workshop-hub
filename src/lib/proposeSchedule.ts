import { programDays } from "@/data/program";

/** Format from the Program page: 30-min expert talk, then 5 proffered papers of 9 min + 3 min discussion. */
export const EXPERT_TALK_MIN = 30;
export const PAPER_SLOT_MIN = 12;
export const PAPERS_PER_SESSION = 5;

export type SessionInfo = { id: string; title: string; time: string };

export const sessions: SessionInfo[] = programDays.flatMap((d) =>
  d.rows.flatMap((r) => (r.kind === "session" ? [{ id: r.id, title: r.title, time: r.time }] : [])),
);

export type Candidate = { abstractId: string; topic: string | null; score: number | null; decision: "oral" };
export type Slot = { abstractId: string; sessionId: string; kind: "oral"; position: number; startTime: string | null; endTime: string | null; overCapacity?: boolean };

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

/** Recompute positions and times; talks beyond PAPERS_PER_SESSION are flagged over capacity (no time). */
export function retime(slots: Slot[]): Slot[] {
  const out: Slot[] = [];
  for (const s of sessions) {
    slots.filter((x) => x.sessionId === s.id).sort((a, b) => a.position - b.position).forEach((x, i) => {
      const over = i >= PAPERS_PER_SESSION;
      const t = over ? null : paperTime(s.id, i);
      out.push({ ...x, kind: "oral", position: i, startTime: t?.start ?? null, endTime: t?.end ?? null, overCapacity: over });
    });
  }
  return out;
}

/** Sessions holding more accepted talks than PAPERS_PER_SESSION. */
export const overfullSessions = (slots: Slot[]) =>
  sessions.filter((s) => slots.filter((x) => x.sessionId === s.id).length > PAPERS_PER_SESSION).map((s) => s.id);

/** A schedule can be published only when no session is over capacity. */
export const canPublish = (slots: Slot[]) => slots.length > 0 && overfullSessions(slots).length === 0;

/** Every accepted abstract becomes a talk in its topic's session, best score first. */
export function proposeSchedule(cands: Candidate[]): Slot[] {
  const sorted = [...cands].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  return retime(sorted.map((c, i) => ({ abstractId: c.abstractId, sessionId: sessionForTopic(c.topic), kind: "oral" as const,
    position: i, startTime: null, endTime: null })));
}
