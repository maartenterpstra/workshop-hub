# Reviewer accounts and admin-confirmed abstract assignment

## Goal

Turn the 41 reviewers from the preference form into real platform accounts with expertises, replace the current automatic assignment with a tentative-then-confirmed workflow, and give admins a page to edit and release assignments.

## 1. Reviewer data import

The CSV topic labels are outdated and get mapped to the current six sessions:

| CSV label | Platform topic |
| --- | --- |
| Dose & Treatment Planning | Dose & Adaptive Workflows |
| Foundation Models & Text | Foundation Models, Text, Explainability & Uncertainty |
| others | unchanged |

Other cleanups before import: swapped first/last names (e.g. "Bol / Gijs", "Zoltan Perko / Perko", "Wouter van Elmpt"), stray whitespace, lower-cased surnames, an email accidentally entered in the name field, "Musti" → "Mustafa" Kadhim, and capitalisation of affiliations. Emails are lower-cased and de-duplicated (André Haraldsson appears twice: once as reviewer, once as a suggestion).

All 41 confirmed reviewers get accounts. The public `/reviewers` page keeps showing only those who consented to be listed — that data file stays as it is.

## 2. Accounts with a forced password change

- A one-off admin-only edge function creates each reviewer's auth user with the default password `AIinRT2027`, marks the email as confirmed, and writes their profile (name, affiliation, email) plus the `reviewer` role and their up-to-three expertise topics.
- New `profiles.must_change_password` flag, set true for these imported accounts.
- After login, any user with the flag set is routed to a "Set your password" screen; all other protected routes redirect there until a new password (min 8 chars, cannot be the default) is saved. Saving clears the flag.
- Re-running the import updates existing reviewers instead of creating duplicates.

## 3. Tentative assignment, balanced

The existing on-submit trigger is replaced by a balanced version:

- Candidates are reviewers whose expertise includes the abstract's topic, excluding the submitting author.
- Up to five are picked, ordered by their current total assignment count (tentative + confirmed) ascending, then randomly, so the load stays roughly even across reviewers.
- If fewer than five topic-matched reviewers exist, the abstract is filled up with the least-loaded remaining reviewers so it still gets enough reviews, and it is flagged in the admin view.
- Assignments are created as **tentative** and are invisible to reviewers.

## 4. Admin confirmation and reassignment

New admin page (`/admin/assignments`, admin role only):

- Table of all abstracts with topic, title, submitter, review load, and confirmation state.
- Per abstract: remove a tentative reviewer, add another reviewer (searchable list showing each reviewer's expertise and current load), and "Confirm reviewers".
- A "Confirm all" bulk action for releasing everything at once.
- Confirmed abstracts can be re-opened; changes after confirmation are allowed and take effect immediately.
- A load overview so uneven distribution is visible before confirming.

## 5. Reviewer visibility

The reviewer dashboard only lists abstracts whose reviewer list has been confirmed. This is enforced in the database, not just the UI: reviewers can read an assignment and its abstract only when that abstract is confirmed. Existing behaviour (dashboard opens after the submission deadline, or in debug mode) stays.

## Technical notes

- `review_assignments`: no schema change to the reviewer/abstract pair; confirmation is tracked on `abstracts` via `reviewers_confirmed_at` and `reviewers_confirmed_by`, so a whole abstract's panel is released atomically.
- RLS: reviewer SELECT policies on `abstracts`, `review_assignments`, `abstract_authors`-blinding and `reviews` gain the `reviewers_confirmed_at is not null` condition; new admin-only INSERT/UPDATE/DELETE policies for managing assignments; `profiles.must_change_password` writable only by the owner.
- `private.assign_reviewers_for_abstract()` rewritten with the balanced ordering and fallback fill.
- Edge function `import-reviewers` uses the service role, verifies the caller's JWT and admin role, and is idempotent by email.
- Reviewer blinding is preserved throughout: no author identity is exposed on any reviewer-visible path.

## Out of scope

- No invitation emails; you distribute the default password yourself.
- SOC members keep read-only access to abstracts and scores; only admins confirm or edit assignments.
