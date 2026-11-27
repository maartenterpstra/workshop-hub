# SOC can change an abstract's session while deciding

## Current state
- On the Decisions step, each abstract shows the session the author picked, read-only.
- On the Schedule step, the SOC can already move an accepted talk to another programme slot, but the abstract still carries the author's original session, so lists, exports and the next "Propose schedule" fall back to it.

## What changes
- In the Decisions list, each abstract gets a "Session" dropdown next to the decision choice (the six sessions). The author's original choice stays preselected.
- When the SOC picks another session, the abstract is marked "Moved from <original>" so the change stays visible.
- "Propose schedule" places talks in the session the SOC picked, which helps scope fit and spreading talks across the programme.
- Session counts shown per session while deciding (e.g. "Session 3: 6 accepted"), so the SOC sees where it is overfull before scheduling.
- The change locks together with the decision: once decisions are confirmed, the dropdown is read-only until unlocked.
- SOC page, Excel exports and the decision email use the new session. Authors see the new session in their decision email; their "My abstracts" page shows it too.
- Only SOC and admins can change it; authors and reviewers cannot.

## Technical details
- Add nullable `abstracts.original_topic_id` (uuid, FK topics). On first SOC change, copy the current `topic_id` there, then update `topic_id`. Existing SOC/admin UPDATE policy already allows this; no new policies.
- `SocDecisionsWorkflow.tsx`: add session select per row, per-session accepted counts, disable when decision confirmed.
- `proposeSchedule` already uses `topic`; it picks up the new value after reload.
- Exports: add column "Original session" when it differs.
- Small test in `tests/` that proposeSchedule uses the reassigned session.
