# Fix reviewer PDF button and audit SOC score merging

## 1. "Open PDF securely" on the review page

**What I checked:** every abstract (including the example) has its PDF in storage, stored as a real PDF, and reviewers are allowed to read it once their panel is confirmed. So the file and permissions are fine; the problem is how the button opens it.

**Likely cause:** the button first opens an empty tab, then tries to redirect it to a 30-second link. Pop-up blockers, the preview frame and some hospital browsers stop or blank that tab, and the short link can also expire before it loads.

**Fix:**
- Clicking "Open PDF securely" opens the PDF inside a window on the same page (no new tab), so no pop-up blocker is involved.
- The file is fetched directly with the reviewer's own sign-in, so it never becomes a shareable link.
- The window has "Open in new tab" and "Download" buttons as backups, and a clear message if the file truly can't be loaded.
- Same treatment for the committee page's "Open PDF" button.
- First step when building: reproduce the failure in the preview as your Gmail reviewer account to confirm the cause, then verify the fix opens the example PDF.

## 2. Score merging for the committee (audit)

**What I found:**
- The same average is calculated in four separate places (committee list, per-abstract score table, decisions/schedule, Excel export). Today they agree, but only because every review fills in all five scores.
- The "total average" pools all individual scores together. If a review ever misses a score, that reviewer counts for less than the others.
- Scores are shown with 2 decimals in most places but 1 decimal in the schedule.
- No test protects these calculations.

**Fix:**
- One shared calculation used everywhere: average per criterion, and a total average = mean of each reviewer's own average (every reviewer counts equally).
- Excel "Total average" uses the same rule (average of the per-review average column), so the spreadsheet matches the website.
- Show 2 decimals everywhere, plus the number of reviews next to each total.
- Add tests: equal weighting of reviewers, a review with a missing score, no reviews shows "—", ranking order for the schedule.

## Technical details
- New `src/lib/scoring.ts` (`criterionAverages`, `reviewAverage`, `totalAverage`); used by `Soc.tsx`, `SocScoreTable.tsx`, `SocDecisionsWorkflow.tsx`, `excelExport.ts`.
- New `PdfViewerDialog` component: `supabase.storage.from("abstracts").download(path)` -> blob URL in an `<iframe>`; revoke on close. Replaces `window.open` logic in `Review.tsx` and `Soc.tsx`.
- Tests in `tests/scoring.test.ts`, run with `bun test tests/`.
