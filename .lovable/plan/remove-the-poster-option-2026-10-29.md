# Remove the poster option

There will be no posters at AIinRT2027. Accepted abstracts are always talks.

## What changes
- **SOC decisions:** the choices become Accept (talk), Revise and Reject. "Accept (poster)" is removed.
- **Reviewer form:** the "Poster" recommendation is removed. Reviewers choose Oral, Revise or Reject.
- **Schedule proposal:** every accepted abstract gets a talk slot in its session. If a session has more than 5 accepted talks, the extra talks are no longer turned into posters. Instead they are marked "over capacity" with a warning. The SOC then moves them to another session that has room, or changes the decision. The schedule can't be published while a session is over capacity.
- **Schedule editor:** the Oral/Poster switch and the poster list are removed.
- **Program page and PDF:** the Posters list goes away, and so does the text "including posters" / "Posters are listed on aiinrt.org/program".
- **Emails and My abstracts:** the poster email and the poster decision text are removed.
- **Existing data:** any poster decision or poster schedule entry already saved becomes a talk. Old poster recommendations from reviewers count as Oral.

## Technical details
- Migration: update the abstract_decisions rows with decision='poster' to 'oral', the schedule_slots rows with kind='poster' to 'oral', and the reviews with recommendation='accept_poster' to 'accept_oral'. Add CHECK constraints that block poster values (enum values stay, since Postgres can't drop enum values safely).
- src/lib/proposeSchedule.ts: Candidate/Slot types become oral-only. Overflow slots get `overCapacity: true` (or times beyond the session). Add `sessionOverflow()` helper.
- tests/proposeSchedule.test.ts: replace the poster tests with "a 6th accepted talk in a session is flagged over capacity" and "the schedule can't be published while a session is over capacity". Run with `bun test tests/`.
- SocDecisionsWorkflow.tsx, Review.tsx, Program.tsx, programPdf.ts, MyAbstracts.tsx, usePublicSchedule.ts: remove the poster branches.
- send-author-email edge function: remove the poster template and status, then redeploy.
