# Clearer "Set password" page on aiinrt.org

## Status check
- aiinrt.org/set-password loads the site (via the existing fallback page), so links will open correctly once allowed.
- **Not done yet:** `https://aiinrt.org/**` is still missing from Redirect URLs (More → Users → Auth settings → Advanced). Until added, reset links still land on the lovable.app address.

## Changes
1. **Signed in from the email link:** show "Setting the password for **name@example.org**" so the reviewer sees which email account is being set up, then the new-password fields.
2. **Opened without a valid link:** a short info box:
   - "Use the email address your invitation was sent to."
   - "Click the newest email only — older links stop working."
   - "Work email may open links automatically; if the link fails, request a new one here."
   - Email field + "Send me a new reset email" button directly on this page (no need to go to the sign-in page), plus the code entry if the email contains a code.
3. Contact line: "Still stuck? Email m.maspero@umcutrecht.nl."
4. After saving, reviewers go to their review page; others to My Abstracts.

## Technical details
- `SetPassword.tsx`: display `user.email`; embed `ForgotPasswordForm`; role-based redirect via `useAuth` roles.
- After you add the redirect address and publish, I'll send a test reset to your email.
