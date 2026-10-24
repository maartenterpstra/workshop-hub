# SOC decisions, proposed schedule and decision emails

## What the SOC will be able to do (on the SOC page)

1. **Decide per abstract**: once reviews are in (or the review deadline of 15 Dec 12:00 has passed), the SOC table gets a "Decision" column: Accept (oral), Accept (poster), Revise (minor changes needed before acceptance), Reject. Each decision can carry a short note to authors. Decisions stay as **drafts** and can be changed freely while the SOC meets.
2. **Confirm all decisions**: a "Confirm decisions" button (SOC/admin only) locks the decisions once the SOC has agreed. Admins can unlock if needed.
3. **Proposed schedule**: after confirming, the system proposes a schedule. Accepted oral abstracts go into their chosen session (S1–S6), ordered by total average score, with talk slots filling the time left after the expert talk. If a session has too many talks, the lowest-scoring ones are suggested as posters. The SOC can drag/move talks between sessions, reorder them, or switch oral/poster, then press **Publish schedule**.
4. **Website schedule**: once published, the Program page shows under each session the accepted talks (title, presenting author, time), plus a Posters list. Nothing appears before publishing. The December notice is replaced by "Final programme". The downloadable programme PDF includes the talks too.
5. **Decision emails (manual confirmation)**: a "Send decision emails" step shows a preview of each email type (oral / poster / revise / reject) and the number of recipients. Nothing is sent until an admin clicks confirm. Every listed author receives it, oral/poster emails include the session and time slot, and all sends appear in the existing sent-emails log. Each abstract is only emailed once, unless an admin resends on purpose.

## Assumptions (tell me if wrong)
- "Revision" means "accept after minor changes", with the authors able to edit their abstract once more until a new date set by the SOC (default: 8 January 2027).
- Talk length: 12 min + 3 min discussion. Posters do not get a time slot.
- Reviewers never see decisions; authors see their decision on My abstracts only after the email is sent.

## Technical details
- Migration: `abstract_decisions` table (abstract_id PK, decision enum oral/poster/revise/reject, note, decided_by, confirmed_at, emailed_at, revision_due_at) and `schedule_slots` (abstract_id, session_id, position, start_time, end_time, kind oral/poster, published boolean). GRANTs + RLS: SOC/admin full access; anon/authenticated read only published slots, exposed through a `public_schedule` view (title + presenting author only, no reviews/scores).
- Map existing `abstracts.status` (accepted_oral/accepted_poster/rejected) from confirmed decisions; add `revise` handling by reopening editing for that abstract until revision_due_at (server-side check in the submission-window trigger).
- `src/lib/proposeSchedule.ts`: pure function (session capacity from program.ts times, sort by score); unit test for capacity and overflow-to-poster.
- New `SocDecisions` and `SocSchedule` components on Soc.tsx; Program.tsx and programPdf.ts read `public_schedule`.
- Extend `send-author-email` with mode `decision` (dry-run preview, admin confirm, per-abstract templates, writes email_log, sets emailed_at).
