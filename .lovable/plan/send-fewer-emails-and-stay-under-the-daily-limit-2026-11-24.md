# Send fewer emails and stay under the daily limit

## What the audit found
The site sends email from four places. Each one sends **one separate email per address**:

| Email | When it is sent | Recipients now |
|---|---|---|
| Submission confirmation | every submit **and every save** of an abstract | the submitter (co-authors only if they have an account) |
| "Authors updated" | every time authors are edited | the submitter |
| Reviewer invitation and guide | admin button | one per reviewer (41 total) |
| Decision emails | admin, after the committee meeting | **one per author**, so 7 abstracts × ~5 authors ≈ 35+ |
| Manual email to authors | admin | one per author |

On 14 November, 115 emails were attempted in one day, and 48 of them failed. The decision round is the next big spike.

## Changes
1. **One email per abstract, not one per author.** Decision emails and manual author emails go out as a single email with all authors in the "To" field. This roughly cuts these sends by 5×.
2. **No repeat confirmations.** The first submission always sends a confirmation. Later saves and author edits send at most one "updated" email per abstract every 24 hours. The page tells the author when no new email was sent.
3. **Daily budget guard.** All site emails share one counter for the last 24 hours, based on the sent-mail log. The limit is set to **100 per day** (Resend's free plan). Before sending, each admin bulk action (reviewer invites, decision emails, manual emails) shows "X emails needed, Y left today". It sends only what fits and leaves the rest marked as not sent. The existing "send only to the ones not sent yet" buttons then finish the rest the next day. Author confirmations keep a small reserve so they still go out on deadline day.
4. **Remaining-today indicator** on the admin email panels.

Tell me if your Resend plan has a different daily maximum, and I'll use that number.

## Technical details
- `send-author-email`: in decision and manual mode, send `to: [all recipients]` per abstract (cap 50) and log one row per recipient with the same send.
- `send-confirmation-email`: for `event: "updated"`, skip the send when `email_log` already has a confirmation for that abstract in the last 24h, and return `{skipped: true}`. Submit.tsx and EditAuthorsDialog show a short notice.
- New shared helper `supabase/functions/_shared/emailBudget.ts`: it counts `email_log` rows with status `sent` in the last 24h against `DAILY_LIMIT = 100`, and `reserve = 15` for confirmations. Bulk functions take from the budget, and dry runs return `remaining`.
- `invite-reviewers` stops when the budget runs out and reports how many are left.
- Tests in `tests/` for the budget maths (stops at the limit, keeps the reserve) and for grouping recipients per abstract.
