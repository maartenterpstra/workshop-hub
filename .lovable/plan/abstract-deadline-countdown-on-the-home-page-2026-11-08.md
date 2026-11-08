# Abstract deadline countdown on the home page

## What you'll see
- In the home page hero, just under the buttons (Call for Abstracts, Previous edition, Related special issue), a compact countdown card: "Abstract submission closes in" with live Days · Hours · Minutes · Seconds tiles, and the line "Deadline: 1 December 2026, 12:00 (Amsterdam time)".
- Styled with the existing UMC blue / PMC orange tokens; fits on one row on mobile.
- Clicking the card goes to the submission page.
- After the deadline passes, the countdown is replaced by "Abstract submission is closed — decisions on 17 December 2026."

## Technical details
- Add `abstractSubmissionDeadlineIso: "2026-12-01T12:00:00+01:00"` to `src/data/siteConfig.ts` (same moment as the server-side `submission_closes_at`).
- New `src/components/DeadlineCountdown.tsx`: ticks every second with `setInterval`, cleans up on unmount, uses semantic tokens only; `aria-live="off"` on the ticking digits, plus a static readable label for screen readers.
- Pure helper `src/lib/countdown.ts` (`timeLeft(now, deadline)` → days/hours/minutes/seconds, or null when past) with a small test in `tests/countdown.test.ts`.
- Insert the component in `src/pages/Home.tsx` hero below the CTA buttons.
