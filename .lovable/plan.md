# Figures still not visible in the preview: diagnose and fix

## What I checked
- All uploaded figure files are present in storage: 2 + 2 figures for the two newer abstracts. The older one has none.
- I signed a test browser in as the admin account m.maspero@umcutrecht.nl and opened the SOC page in the preview. The figures load correctly there: "Figures / tables" with thumbnails, and "No figure uploaded" for the older abstract.
- Signed in as matteo.maspero.it@gmail.com, the SOC page shows "Access denied", because that account is not SOC or admin.
- Reviewers see no assignments before 1 December, so the reviewer page has nothing to show yet. You chose to keep it that way.

So the cause on your side is not confirmed yet. The code works for one admin account, but not in the view you are using.

## Steps
1. **Reproduce in your view.** Repeat the check with the other admin account, and with any SOC member you use. Note which abstracts show figures and what the browser reports: failed image links, permission errors, or the page still showing the old layout because it wasn't refreshed.
2. **Fix what that shows.**
   - If the cause is access (for example, a SOC-only account can't read figure files), adjust the file-access rule so SOC and admins can read every figure. Reviewers keep reading only figures of their confirmed, non-withdrawn assignments.
   - If an image link fails or expires, make the links longer-lived and regenerate them when an image fails to load.
3. **Make problems visible.** If a figure can't be loaded, show "Figure could not be loaded — retry" with a retry button instead of a silent blank box. This makes the cause obvious next time.
4. **Reviewer page check.** Using the existing debug option, confirm that figures appear for a confirmed assignment, so they will be there on 1 December. The reviewer timing rule stays unchanged.
5. **Verify** in the browser for each role (admin, SOC, reviewer in debug) and report what each one sees.

## Technical details
- The SOC page currently uses `createSignedUrl` with a 600s expiry per figure, and the page creates the links when it first loads. Add an `onError` handler that re-signs once and then shows the retry state.
- The storage SELECT policy "SOC and admins read all abstract files" uses `private.has_role`. Confirm that a soc-only user passes it, using that user's session.
- No change to the figure requirement or to reviewer blinding.
