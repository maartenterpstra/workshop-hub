# Edit authors after submission + reviewer "Decline" button

## 1. Edit authors after submission
- On "My abstracts", each abstract gets an **Edit authors** button that stays available after the submission deadline (until the abstract is withdrawn or the programme is published).
- Opens a small window with the same author list as the submission form: add, remove, reorder, change name / affiliation / email, choose presenting author.
- Only the author list changes; title, text, figures and PDF stay locked after the deadline.
- Reviewers never see authors, so blinding is unaffected. The committee pages and exports show the updated list automatically.
- The submitter gets a short confirmation email ("authors updated"), same rules as today's confirmations.

## 2. Reviewer "Decline" (conflict of interest)
- Each assigned abstract on the review page gets a **Decline this review** button, e.g. "I recognise this work / it is my own / conflict of interest", with an optional short reason (private, admins only).
- After confirming, the abstract disappears from that reviewer's list and can no longer be scored by them.
- This solves the case where someone submitted with one email and reviews with another: they just decline their own abstract.
- Admin reviewer panel shows declined reviews and offers **Reassign**: picks the next topic-matched reviewer with the lowest load (not an author of that abstract, not already assigned), or lets the admin pick a reviewer manually. The new reviewer gets the usual notice email.
- Scoring and averages ignore declined assignments; the "at least 5 reviewers" count shows a warning when a decline drops an abstract below five.

## Technical details
- New security-definer function `replace_abstract_authors(_abstract_id, _authors jsonb)`: checks caller is the submitter and status is not withdrawn and schedule not published; deletes and reinserts rows in one transaction (existing RLS for the open window stays as is).
- New function `decline_review(_assignment_id, _reason)`: reviewer must own the assignment, review window open, no submitted review yet; sets status `declined_coi` (existing enum value) and stores the reason in a new nullable `review_assignments.decline_reason` column.
- New admin function `reassign_review(_assignment_id, _reviewer_id default null)` creating a new confirmed assignment.
- Review.tsx filters out `declined_coi`; scoring helpers already skip assignments without reviews; add tests for decline/reassign rules in `tests/`.
