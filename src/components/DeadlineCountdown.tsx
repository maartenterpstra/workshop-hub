import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { timeLeft } from "@/lib/countdown";

const deadline = new Date(siteConfig.abstractSubmissionDeadlineIso);

export default function DeadlineCountdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = timeLeft(now, deadline);

  if (!left) {
    return (
      <div className="mt-6 inline-block rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
        Abstract submission is closed — decisions on {siteConfig.abstractDecisionsOn}.
      </div>
    );
  }

  const units: [string, number][] = [
    ["Days", left.days],
    ["Hours", left.hours],
    ["Min", left.minutes],
    ["Sec", left.seconds],
  ];

  return (
    <Link
      to="/submission"
      className="mt-6 inline-block rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition hover:bg-white/20"
      aria-label={`Abstract submission closes ${siteConfig.abstractSubmissionDeadline}, 12:00 Amsterdam time. Go to submission page.`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
        <Clock className="h-3.5 w-3.5" /> Abstract submission closes in
      </div>
      <div className="mt-2 flex gap-2" aria-hidden="true">
        {units.map(([label, v]) => (
          <div key={label} className="min-w-[3.5rem] rounded-lg bg-accent px-2 py-1.5 text-center text-accent-foreground">
            <div className="text-xl font-bold tabular-nums sm:text-2xl">{String(v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-wide opacity-90">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-white/80">
        Deadline: {siteConfig.abstractSubmissionDeadline}, 12:00 (Amsterdam time)
      </div>
    </Link>
  );
}
