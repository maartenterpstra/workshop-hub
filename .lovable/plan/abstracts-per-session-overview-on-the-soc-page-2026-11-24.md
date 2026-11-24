# Abstracts-per-session overview on the SOC page

## What you will see
A new "Abstracts per session" card at the top of the SOC dashboard, above the decisions workflow. It holds one table:

| Session | Active | Withdrawn | Total |
|---|---|---|---|
| (one row per session, in the usual session order) | | | |
| No session (if any) | | | |
| **Total** | **sum** | **sum** | **sum** |

- **Active** counts submitted and accepted abstracts. **Withdrawn** is shown separately so the active total stays clear.
- Sessions with zero abstracts are still listed, so you can see gaps.
- The practice example abstract is left out, as everywhere else on the SOC page.
- Numbers update when the page loads. Nothing new is saved.

## Technical details
- New `src/components/SocSessionSummary.tsx`. It receives the rows already loaded in `Soc.tsx` and loads the topic list (`topics` ordered by `display_order`) to include empty sessions.
- Counting logic lives in a small pure helper `src/lib/sessionCounts.ts`, with a test in `tests/sessionCounts.test.ts` (per-session counts, withdrawn kept separate, the total row equals the sum, abstracts without a session counted under "No session").
- No database changes.
