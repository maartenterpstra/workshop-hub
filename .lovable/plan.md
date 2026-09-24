# Direct links, confirmation emails for existing authors, and admin exports

## What will change

1. **Direct links work on aiinrt.org** — opening any page directly (e.g. /submission, /my-abstracts) loads it instead of a 404. Cause: the site is hosted on GitHub Pages, which only knows the home page file; the fix makes every build also publish a fallback copy of the site so GitHub Pages serves the app for any page address.
2. **Confirmation email to authors who already submitted** — admins get a "Send confirmation to all submitters" button on the admin page. It emails every existing abstract's submitting account (same branded email as today, marked "received"). A summary shows how many were sent and any failures. New submissions and edits keep sending automatically as they do now.
3. **Export review scores** — admin button downloads a spreadsheet (CSV) with one row per review: abstract title, topic, reviewer name/email, the five scores, average, recommendation, comments for authors and for chairs, submitted date.
4. **Export abstracts and author emails** — admin button downloads a CSV with one row per abstract: title, topic, status, submitting account email, and all listed authors with their emails (presenting author marked).

All three admin actions live in a new "Exports & emails" section on the existing admin assignments page, visible to admins only.

## Technical details

- Add a small Vite plugin (build-only) that copies `dist/index.html` to `dist/404.html` after build; GitHub Pages serves 404.html with the SPA, and React Router resolves the path. Also wrap `<Routes>` in the already-imported `ErrorBoundary` (unfinished from the last fix).
- Edge function `send-confirmation-email`: add a `mode: "all"` branch, admin-only (checked via `user_roles`), iterating all abstracts with the service client, sending sequentially with a short delay to respect Resend rate limits, returning `{ sent, failed: [...] }`. Redeploy.
- Exports built client-side from existing admin RLS access (abstracts, abstract_authors, review_assignments, reviews, profiles); reviewer names/emails from `profiles`. CSV with proper quoting and a UTF-8 BOM so Excel opens accents correctly.

## Verification

- Build passes; `dist/404.html` exists after build.
- Playwright: admin page shows the three buttons; both CSVs download with expected headers.
- Function logs show sends for the bulk email.
