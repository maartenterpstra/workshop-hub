# Withdraw abstracts + Excel export on the SOC page

Spelling: **withdraw** (noun: **withdrawal**).

## 1. Authors can withdraw an abstract
- On "My abstracts", each abstract gets a **Withdraw abstract** button. It only shows while submissions are open and the abstract hasn't been withdrawn yet.
- A confirmation box asks: "Withdraw '<title>'? It will no longer be reviewed. You can't undo this after the submission deadline."
- Withdrawn abstracts stay on the list with a "withdrawn" label and can't be edited. While submissions are open, the author can **Restore** a withdrawn abstract.
- Reviewers stop seeing withdrawn abstracts. The SOC page shows them greyed out with a "withdrawn" label.
- The corresponding authors get an automatic email: "Your abstract '<title>' was withdrawn."

## 2. Excel export on the SOC page
- New **Export to Excel** button at the top of the SOC dashboard. The same file is also available from the admin Exports card.
- One row per abstract, with these columns: Session (topic), Title, First author, Presenting author, Author emails, Status, Number of reviews, the average for each criterion (Technical, Relevance, Novelty, Reproducibility, Session fit), and the **Total average**.
- A second sheet lists every individual review (scores per criterion, recommendation, comments). Reviewer names are not included, so reviews stay anonymous.
- Averages are real Excel formulas, so they update if someone edits the numbers.

## 3. SOC page display
- Each abstract card shows its **session** as a badge next to the title. It also shows a small score table with the average per criterion and the total average, plus the per-reviewer scores it already shows.

## Technical details
- Migration: add `withdrawn` to `abstract_status` and add a `private.withdraw_abstract(id, restore bool)` security-definer RPC. The RPC checks `submitted_by = auth.uid()` and that the submission window is open, then toggles the status between submitted and withdrawn. The reviewer SELECT policy on abstracts and assignments excludes `withdrawn`.
- The confirmation-email edge function gets a `withdrawn` mode.
- Add the `exceljs` dependency for the .xlsx export (formulas, bold headers, frozen top row, Arial). The existing CSV exports stay.
- Files: MyAbstracts.tsx, Soc.tsx, AdminExports.tsx, new `src/lib/excelExport.ts`, and send-confirmation-email/index.ts.
