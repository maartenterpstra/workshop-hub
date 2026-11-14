# Send reset links to aiinrt.org

## Why it doesn't already
aiinrt.org isn't on the list of allowed return addresses for sign-in emails. Any link pointing there gets quietly redirected to the lovable.app address (this is why the reviewer's link opened the wrong page earlier).

## Step for you (one-time, about 1 minute)
In **More → Users → Auth settings → Advanced → Redirect URLs**, add:
- `https://aiinrt.org/**`
- `https://www.aiinrt.org/**` (only if the www address is used)

## Changes I'll make
1. Reviewer invitations and imports send reset links to `https://aiinrt.org/set-password`.
2. "Forgot password?" and "Send me a new link" also send people to `https://aiinrt.org/set-password` (one shared setting), regardless of which address the person used.
3. Sign-up confirmation links go to aiinrt.org too, for consistency.
4. Redeploy the reviewer invitation functions.
5. After you add the address, I'll trigger one test reset to your own email and confirm it lands on aiinrt.org/set-password.

## Technical details
- Add `siteConfig.authSiteUrl = "https://aiinrt.org"`; `passwordResetRedirect()` uses it; `emailRedirectTo` in Signup uses it.
- `invite-reviewers` / `import-reviewers`: `redirectTo` constant back to `https://aiinrt.org/set-password`.
- Direct opening of /set-password on aiinrt.org relies on the existing 404.html fallback; confirm after publish.
