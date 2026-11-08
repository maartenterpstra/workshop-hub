export interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

/** Remaining time until deadline, or null once the deadline has passed. */
export function timeLeft(now: Date, deadline: Date): TimeLeft | null {
  const ms = deadline.getTime() - now.getTime();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
