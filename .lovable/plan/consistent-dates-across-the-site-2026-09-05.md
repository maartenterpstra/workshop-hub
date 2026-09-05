# Consistent dates across the site

## What changes
- The submission page banner will read: "Submissions are now open! Deadline: 1 December 2026. Decisions communicated 17 December 2026."
- Every page will pull these dates from one shared settings file, so they always match:
  - Abstract submission deadline: 1 December 2026
  - Abstract decisions communicated: 17 December 2026
  - Registration deadline: 1 March 2027 (one month before the workshop)
- The home page timeline will use the same shared values instead of its own hardcoded text.
- The registration page will show the registration deadline (1 March 2027); registration opening stays "TBC" until you confirm it.
- Quick audit of the remaining pages (program, venue, submission rules) so no stale "TBC" or mismatched December wording is left where a date is now known.

## Technical notes
- Add `abstractDecisionsOn: "17 December 2026"` and set `abstractSubmissionDeadline: "1 December 2026"`, `registrationDeadline: "1 March 2027"` in `src/data/siteConfig.ts`.
- `src/pages/Home.tsx` timeline entries reference `siteConfig` fields; `src/pages/Submission.tsx` banner text updated; `src/pages/Registration.tsx` shows the deadline alongside the "Opens TBC" badge.
- The database-driven submission open/close window (`app_config`) is unchanged; only display copy is affected.
