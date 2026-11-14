# Test reviewer invitation and password reset for matteo.maspero.it@gmail.com

## Goal
Confirm that a reviewer invitation and a "Forgot password?" email both arrive at matteo.maspero.it@gmail.com and that the link opens https://aiinrt.org/set-password, which shows the email address.

## Steps
1. Check whether matteo.maspero.it@gmail.com already has an account and the reviewer role. If not, create a test reviewer account for that address (reviewer role only, no expertise, so it gets no abstract assignments).
2. Send one reviewer invitation to that address only, using the same invitation used for reviewers (password set-up email plus reviewer guide email).
3. Trigger one "Forgot password?" email for the same address.
4. Check the email-sending logs to confirm both emails were accepted for delivery, and check that the links in them point to aiinrt.org/set-password.
5. Report back. You then open the newest email in that inbox, click the link (or enter the code) and confirm that the page shows your email and that saving a password works.

## Notes
- No other reviewer gets an email.
- I can't read your Gmail inbox, so the final click-through is your check.
- The aiinrt.org page needs to be published with the latest changes for the full flow to work.
