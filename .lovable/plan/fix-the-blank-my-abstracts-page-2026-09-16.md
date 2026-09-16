# Fix the blank "My abstracts" page

## What is wrong

Confirmed by loading the page in a test browser while signed in: the page throws an error immediately and React unmounts the whole screen, so you see a blank white page (header and footer disappear too).

The cause is the date-and-time formatting used for the deadline text. It asks for a combined date/time style *and* a timezone label at the same time, which the browser rejects ("Invalid option"). The same faulty formatting is used on three other pages, so those will break the same way as soon as the deadline text is shown:

- My abstracts (breaks now — it always formats a date)
- Submit / edit abstract (breaks when a submission deadline is set — it is set)
- Submission info page (same)
- Reviewer dashboard (same)

## The fix

1. Add one shared date/time formatting helper used by all four pages, producing text like
   `1 December 2026 at 12:00 CET (Amsterdam)`, built with explicit day/month/year/hour/minute
   fields plus the timezone name (a valid combination).
2. Replace the four inline formatters in `MyAbstracts.tsx`, `Submit.tsx`, `Submission.tsx`
   and `Review.tsx` with that helper.
3. Also make the My abstracts data load resilient: currently if the database query fails, the
   loading state can leave the page stuck. Handle the error case, show a short "could not load
   your abstracts" message, and keep the page usable.
4. Add a top-level error boundary around the routed pages so a future error in one page shows a
   friendly message instead of a blank site.

## Verification

Reload `/my-abstracts` signed in and confirm: heading, deadline sentence, and either the abstract
list or the empty-state card, with no browser errors. Also open `/submit`, `/submission`,
`/review` and confirm the deadline sentences render.

## Technical notes

`Intl.DateTimeFormat` does not allow `dateStyle`/`timeStyle` together with `timeZoneName`; it
throws a `RangeError`. The helper will live in `src/lib/formatDate.ts` and use
`{ day, month, year, hour, minute, timeZone: "Europe/Amsterdam", timeZoneName: "short" }`.
The error boundary will be a small class component wrapping `<Routes>` in `App.tsx`.
