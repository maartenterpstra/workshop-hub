# Get reviews ready before the 1 December deadline

## Current status
- 41 reviewers have accounts, each with topic expertise.
- None of them has signed in yet. All 41 still need to set their own password.
- 7 active abstracts. No reviewer panel has been confirmed yet, and reviewers only see an abstract after its panel is confirmed.

## 1. Constructive feedback in the review form
The free "Comments for authors" box becomes three short required boxes (1–3 sentences each):
1. **Where is the value?** What is the strongest part of this work?
2. **What could be done better to increase the impact?**
3. **Any tips?** For example references, analyses, or presentation advice.

The review can't be submitted until all three are filled in. The scores, "Comments for SOC" and private notes stay the same. Authors get the three answers with their decision email and see them on My abstracts. The Excel export gets one column for each question.

## 2. Reviewer access
- An admin button, **Send reviewer invitations**, emails every reviewer who hasn't signed in yet. The email has a link to set a password, the review deadline (15 December, 12:00), and a short guide. There is a preview step before anything is sent.
- A reviewer status table for admins: signed in yes/no, password set, number of assigned abstracts, and number of reviews submitted.
- A **Reviewer guide** box on the review page that explains the three questions and asks for constructive, respectful feedback.

## 3. After 1 December (admin steps)
Check the suggested panels on the assignments page and confirm them. Reviewers can then see their abstracts. Optionally, send a "reviews are open" email.

## Technical details
- Migration: add `reviews.feedback_value`, `feedback_improve`, `feedback_tips` (text). Required on submit, checked in the form and by a trigger when `submitted_at` is set. Keep `comments_for_authors` for older data.
- Review.tsx: three textareas plus the guide. Exports: new columns.
- send-author-email decision template: include the three answers from each review (no reviewer names), keeping reviewers anonymous.
- Edge function `invite-reviewers` (admin-only, dry run, generates a recovery link that redirects to /set-password, logs to email_log).
- AdminAssignments: status table that reads `last_sign_in_at` through an admin-only security definer function.
