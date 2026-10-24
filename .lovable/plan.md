# Admin emails to submitting authors, with a sent-mail log

## What admins get
On the admin assignments page, a new "Email authors" card:
- **Recipients:** "All submissions" or "One submission" (pick an abstract from a list). Withdrawn abstracts can be included or left out with a checkbox (left out by default).
- **Who receives it:** the submitting account plus every listed author of each chosen abstract, with no duplicates. Each person gets their own email; nobody sees other addresses.
- **Message:** subject and plain-text body. `{title}` in the text is replaced by that abstract's title. A preview shows how many people will receive it before sending, and you confirm first.
- Sent from AIinRT2027 <abstracts@aiinrt.org> through Resend (the current setup), in the same AIinRT2027 email style.

## Sent-mail history (admins only)
A "Sent emails" table under the card: date, subject, abstract, recipient, and status (sent or failed, with the error). You can filter it by abstract and export it as CSV. The automatic confirmation emails (submitted, updated, withdrawn, restored) are also recorded here, so all mail to authors is in one place. Only admins can see this table; SOC, reviewers and authors cannot.

## Technical details
- New table `email_log` (id, sent_at, sent_by, abstract_id, recipient_email, subject, kind: manual/confirmation, status, error). GRANTs, RLS on, only `admin` can SELECT, and the app cannot insert or update rows itself. Edge functions write rows using the service role.
- New edge function `send-author-email`: checks the caller is admin, gets the recipients from `abstracts` + `abstract_authors`, escapes the body into the HTML template, sends one email per recipient with about 600 ms between sends (Resend rate limit), logs each result, and returns counts.
- `send-confirmation-email` also writes a row to `email_log` for each send.
- UI: a new `AdminEmailAuthors.tsx` component on `AdminAssignments.tsx`.
