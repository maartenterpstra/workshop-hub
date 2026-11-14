# Fix failed reviewer invitation emails

## What the audit found
- 125 emails logged in total. All 44 abstract confirmation emails and all author emails went out fine.
- The problem is limited to the reviewer invitations sent this morning (14 Nov, 07:31–07:34 Amsterdam): 33 succeeded, 48 failed.
- Each invitation is two emails: the reviewer guide (sent via Resend, this worked) and the "set your password" email (sent by the sign-in system). The failures are all the password email: "Password email could not be sent".
- Cause: the sign-in system only allows a small number of password emails in a short time (and blocks a repeat to the same person within about a minute). After roughly the first 30, it refused the rest. The invitation was also run more than once, which used up the allowance faster.
- Impact: most of those 48 reviewers got the guide but no working password link. They can still use "Forgot your password?" on aiinrt.org/login, so nobody is locked out.

## Fix
1. Send the password link through the same Resend sender as the guide (abstracts@aiinrt.org), in one combined email: guide + personal "Set your password" button to aiinrt.org/set-password. This avoids the sign-in system's email limit entirely and gives reviewers one email instead of two.
2. Store the real error text in the email log instead of a generic message, so future problems are visible.
3. In the reviewer status panel, add:
   - "Resend to failed only" (re-sends just to reviewers whose last invitation failed and who haven't signed in),
   - "Send to one reviewer" (pick an email, for testing).
   - A count of failed invitations next to the button.
4. Prevent accidental double runs: skip reviewers who already received a successful invitation in the last 24 hours, unless explicitly chosen.
5. Nothing is sent automatically; you press the button after previewing.

## Technical details
- `invite-reviewers`: replace `resetPasswordForEmail` with `auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: 'https://aiinrt.org/set-password' } })` and embed `action_link` in the Resend HTML. Accept `mode: 'all' | 'failed' | 'single'` and `email`. Log `error` verbatim.
- Admin panel: new buttons + failed count from `email_log` (kind manual, subject = invitation subject).
- Deploy the function; test by sending to a single address (matteo.maspero.it@gmail.com) only.
