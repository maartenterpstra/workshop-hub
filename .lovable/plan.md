# Optional second session for abstracts

## What changes
- **Submit / Edit abstract form:** under "Session", a new optional dropdown "Second session (optional)". It lists all sessions except the one already chosen, with a "None" option. Authors can change it while the submission window is open, like the other fields.
- **SOC abstract page:** each abstract card shows the main session badge plus a lighter "2nd: <session>" badge when one was chosen.
- **Abstracts per session table:** a new column "As 2nd choice" counts how often each session was picked as second session (main counts and totals stay unchanged, so nothing is double-counted).
- **SOC exports (Excel/CSV):** a "Second session" column next to "Session".
- Existing abstracts keep no second session until the author adds one.
- Reviewers see nothing new; reviewer matching still uses the main session only.

## Technical details
- Migration: `abstracts.second_topic_id uuid null references topics(id)`, check constraint `second_topic_id is distinct from topic_id`. Existing RLS on abstracts already covers the column.
- Submit.tsx: state + zod optional uuid, saved on insert/update, loaded on edit; clear it if it equals the main topic.
- Soc.tsx: select `second_topic:topics!abstracts_second_topic_id_fkey(name)`; badge; pass to SocSessionSummary and excelExport.
- `src/lib/sessionCounts.ts`: add `secondChoice` count per row; extend `tests/sessionCounts.test.ts`.
- Regenerate types.
