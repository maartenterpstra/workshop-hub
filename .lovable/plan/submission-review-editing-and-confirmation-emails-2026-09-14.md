# Submission, review editing, and confirmation emails

## What will change

- Keep the EFOMP, MICCAI, and ESTRO logos linked to their official society websites, opening safely in a new tab, and verify all three links.
- Make at least one figure or table image mandatory in the submission form, while retaining the current maximum of two PNG/JPG files.
- Add a signed-in author area showing their submitted abstracts and an edit action.
- Allow the submitting account to revise its abstract text, authors, required figure(s), and PDF until **1 December 2026 at 12:00 Europe/Amsterdam time**. After that deadline, submissions become read-only.
- Add a separate review deadline of **15 December 2026 at 12:00 Europe/Amsterdam time**.
- Keep reviews editable after their first submission, changing the action to “Update review,” until the review deadline. Afterward, submitted reviews remain visible but become read-only.
- Send a confirmation email to the submitting account after the initial abstract submission and after each successful modification. The email will identify the abstract and whether it was submitted or updated, without attaching files.

## User experience

- Submission validation will clearly identify the missing required figure before any upload begins.
- Existing submissions will be pre-filled when opened for editing, including current author details and uploaded-file status.
- Authors can retain an existing PDF or figure while editing, or replace uploaded files before the deadline.
- Reviewer pages will show the review deadline and whether a saved review can still be changed.
- Deadline labels across the information page, author form, author area, and reviewer page will use the same configured values.

## Technical details

- Extend the shared application configuration with `review_closes_at`; set submission closing to `2026-12-01 12:00 Europe/Amsterdam` and review closing to `2026-12-15 12:00 Europe/Amsterdam` using timezone-aware values.
- Enforce author and reviewer deadlines in the database as well as the interface, so bypassing the page cannot permit late changes. Preserve administrator/SOC access.
- Add an owner-scoped abstract edit route and update the existing form to support both creation and editing. Storage replacements will use owner-scoped paths and avoid exposing private files.
- Keep reviewers blinded throughout; confirmation emails use the authenticated submitter’s account email and contain no reviewer information.
- Configure Lovable app-email infrastructure and add one branded abstract-confirmation template with idempotent event keys for initial submission and each update. A verified sender domain is required before emails can be sent.
- Update generated database types after the migration if needed.

## Verification

- Test initial submission failure with zero figures and success with one valid figure.
- Test author edits immediately before and rejection after the submission deadline.
- Test review creation, repeated updates before 15 December at 12:00 Europe/Amsterdam, and read-only behavior after it.
- Test submission and modification confirmation emails to the submitting account.
- Check the three endorsement links, mobile/desktop layouts, database access rules, and the final build.
