# Fix reviewer password-reset links for everyone

## What's going wrong
- Invitation emails send reviewers to `aiinrt.org/set-password`, which isn't an allowed return address, so the link falls back to the site's home page.
- The sign-in logs show "email link has expired" several times: one-time links are often consumed by work email security scanners (e.g. Outlook Safe Links) before the reviewer clicks, or by clicking an older email.
- The home page ignores the error in the address, and the login page has no "Forgot password?" option, so reviewers are stuck.

## Changes
1. **"Forgot password?" on the login page** — enter email, receive a fresh reset email. Always shows a neutral "if an account exists, check your inbox" message.
2. **Reset by 6-digit code as well as link** — the reset email and the Set Password page accept the code from the email, so scanner-consumed links no longer block anyone.
3. **Friendly expired-link handling** — if anyone lands on any page with an "expired/invalid link" error, show a clear notice with a "Send me a new link" form instead of silently showing the home page.
4. **Correct return address** — invitations and resets point to the current site's `/set-password` page (the published address), so links land on the right page.
5. **Sign-up hint** — when sign-up says the email is already registered, offer "Reset your password" right there.
6. **Re-send invitations** — after deploying, use the admin reviewer panel to re-send to reviewers who haven't set a password yet (with your confirmation; preview first).

## Technical details
- `Login.tsx`: forgot-password dialog → `resetPasswordForEmail(email, { redirectTo: origin + '/set-password' })`.
- `SetPassword.tsx`: add email + code entry using `verifyOtp({ email, token, type: 'recovery' })`, then `updateUser({ password })`.
- Global hash-error handler in the app shell for `error_code=otp_expired|access_denied`.
- `invite-reviewers` and `import-reviewers`: `redirectTo` from a single site-URL constant (`https://workshop-spark-25.lovable.app/set-password`); redeploy both.
- Check auth email template includes `{{ .Token }}` so the code is shown; if custom templates aren't used, the default recovery email is used and the code step is shown only where available.
- Small unit test in `tests/` for the hash-error parser.
