# Co-authors can view (not edit) abstracts they are listed on

## Current state
No. Today only the person who submitted an abstract (plus committee/admins and assigned reviewers) can see it. "My abstracts" only lists abstracts the signed-in account submitted itself. Co-authors with an account see nothing.

## What changes
- A signed-in user whose verified account email matches a co-author email on an abstract can see that abstract on "My abstracts", in a separate section "Abstracts where you are co-author".
- They see title, topic, authors, structured text, figures, PDF link, status and (once emailed) the decision.
- Everything is read-only: no Edit, Withdraw/Restore or upload buttons. The database itself blocks changes, not just the screen.
- Withdrawn abstracts remain visible to co-authors, marked as withdrawn.
- Reviewer scores and private committee notes stay hidden, same as for the submitter.

## Safety
- Matching only on accounts whose email has been verified, so nobody can create an account with a co-author's address and read the abstract. If sign-up currently confirms without an inbox check, those accounts must verify first (e.g. via the "Forgot password" email) before co-authored abstracts appear.
- Email match is case-insensitive.
- Blinding unaffected: reviewers never see author info; a co-author who is also a reviewer should already decline that abstract for conflict of interest.

## Technical details
- New security-definer function `private.is_abstract_coauthor(_abstract_id uuid)` checking `abstract_authors.email` against `auth.users.email` for `auth.uid()` with `email_confirmed_at IS NOT NULL`.
- New SELECT-only policies on `abstracts`, `abstract_authors`, `abstract_disclosures`, and storage `abstracts` bucket objects (PDF/figures) using that function. No INSERT/UPDATE/DELETE policies added.
- Decision visibility: reuse the same rule the submitter has (only after emailed).
- `MyAbstracts.tsx`: second query for co-authored abstracts (not submitted_by me), rendered read-only.
- Test in `tests/` for the read-only rule (co-author sees, cannot edit).
