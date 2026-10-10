# Name the award journal and the reviewer counts on the submission page

## What will change

On the Abstract Submission page:

- The award section will state that the best submission has its open access submission fee for **Physics in Imaging and Radiation Oncology (phiRO)** waived, upon participation in the upcoming AI in RT special issue.
- It will say the best paper is selected according to the abstract score.
- The line "The specific journal will be disclosed in December 2026" will be removed, since the journal is now named.
- The review section will state that every abstract strives to receive at least 3 reviews, and up to 5 depending on the number of submissions.
- The page's search-result description will name phiRO instead of a generic "APC waiver".

No prices, deadlines, review rules, or database behaviour change. This is wording on one page only.

## User experience

- Authors reading the rules see the journal name, the condition of joining the special issue, and how the winner is chosen.
- The reviewer-count expectation is explicit: at least 3, up to 5 depending on submission volume.

## Technical details

- `src/pages/Submission.tsx`: rewrite the "Best-paper award" card body (currently lines 177–185) to name phiRO and the special-issue condition, keep the "based on the abstract score" wording, and drop the December disclosure sentence. Update the review-criteria intro (currently "scored (1–5) by up to five reviewers") to "scored (1–5) by at least three reviewers — up to five depending on the number of submissions".
- `src/components/RouteSeo.tsx`: update the `/submission` meta description to mention the phiRO open access fee waiver for the best-scoring paper.
- Card and section markup, colours, and layout stay as they are.

## Verification

- Read the submission page in the preview and check the award text, the reviewer-count sentence, and that the removed sentence is gone.
- Confirm the page still builds and the search-result description reflects phiRO.
