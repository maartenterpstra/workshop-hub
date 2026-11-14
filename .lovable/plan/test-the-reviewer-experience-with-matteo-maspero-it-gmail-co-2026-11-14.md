# Test the reviewer experience with matteo.maspero.it@gmail.com

## Goal
Let you see exactly what a reviewer sees and receives, without exposing real abstracts or emailing the 41 real reviewers.

## Steps
1. **Give the Gmail account the reviewer role** (it keeps its author role) and add one expertise topic.
2. **Create one clearly labelled test abstract** ("TEST – reviewer preview, please ignore"), with dummy text, a dummy figure and PDF, owned by an admin account (not the Gmail one, so blinding stays realistic).
3. **Assign only the Gmail account to that test abstract and confirm that panel.** Real abstracts' panels stay unconfirmed, so no real reviewer gains access early.
4. **Send the reviewer guide/invitation to that single address** using the existing "Send to one reviewer" option.
5. **You test as the reviewer:** open the email, sign in at aiinrt.org, open the review page, view the PDF and figure, fill in scores, the three feedback questions and private notes, then submit.
6. **Clean up afterwards (on your go):** withdraw/hide the test abstract, remove its assignment and review, and remove the reviewer role from the Gmail account, so exports, averages, best-paper ranking and the schedule are not affected.

## Notes
- Because submissions are still open until 1 December, the test abstract and review will briefly appear in admin/SOC lists and exports; they are labelled TEST and removed in step 6.
- No email goes to anyone except matteo.maspero.it@gmail.com.

## Technical details
- Insert into user_roles (reviewer) and reviewer_expertise for the Gmail user.
- Insert abstract + abstract_authors + disclosures; upload dummy PDF/figure to the private bucket.
- Insert one review_assignment; set abstracts.reviewers_confirmed_at.
- Call invite-reviewers in single-address mode.
- Cleanup deletes the review/assignment/slot rows and sets status withdrawn (abstracts have no delete policy).
