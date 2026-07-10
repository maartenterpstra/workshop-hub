## Changes

### 1. Remove specific dates (TBA)
`src/data/siteConfig.ts`: change `dates: "18-19 March 2027"` → `dates: "Dates TBA"` (still labeled "2027 Workshop" via `subtitle`). All pages that render `siteConfig.dates` will automatically show "Dates TBA".

### 2. Submission page — clarify platform input format
`src/pages/Submission.tsx`, under "Length & file format" (and adjust the "Structured abstract" intro): make clear that on the submission platform authors will be asked to enter:
- The **abstract text** (structured: Background / Methods / Results / Conclusion) directly into text fields.
- **Figures/tables uploaded separately as image files** (PNG/JPG).
- A **final compiled PDF** of the full abstract (text + figure/table) as a single upload.

Keep the 500-word / 1 figure-or-table / A4 constraints; reword the bullets so they match what the platform actually asks.

### 3. Program page — add structure + provisional schedule
Rewrite `src/pages/Program.tsx` to keep the current header + "Program TBC" alert + previous-edition card, and add two new sections:

**a. Format block** — short description:
> Six 90-min sessions in clinical-workflow order. Each session opens with a 30-min invited state-of-the-art talk (low self-reference), followed by 5 proffered papers (9 min + 3 min discussion). One cross-disciplinary keynote closes each day.

**b. Sessions list** — S1–S6 as cards/list:
- S1 Segmentation & Registration
- S2 Reconstruction & Synthesis
- S3 Foundation Models, Text, Explainability & Uncertainty
- S4 Dose & Adaptive Workflows
- S5 Clinical Predictions & Outcomes
- S6 Implementation, QA & Ethics

**c. Provisional timetable** — two side-by-side (stacked on mobile) tables Day 1 / Day 2, with all rows from the user's message. Label clearly as "Provisional — subject to change".

No changes to `scheduleScientific.ts` (that's 2026 archive data). Pure presentation via a new inline `programStructure` const inside `Program.tsx` (or a small `src/data/programStructure.ts` if cleaner — will inline unless it grows).

### Non-goals
No changes to routing, auth, DB, submission form logic, or other pages. No new dependencies.