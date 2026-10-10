# Reviewers, disclosures, blinding tips and ESTRO language

## What will change

1. **At least 5 reviewers per abstract**
   - Submission page text: "Each abstract is scored by at least five reviewers."
   - Automatic tentative assignment proposes a minimum of 5 topic-matched reviewers (topping up from other topics if a topic has fewer than 5), still balancing load. The admin page flags abstracts with fewer than 5 confirmed reviewers.

2. **Reviewer notes**
   - The review form already has "Comments to authors" and "Confidential comments to chairs". Add a third, private "Personal notes" box that reviewers can fill in at any time while reviewing (saved with the review, visible only to that reviewer, not counted in scoring or exports), plus clearer hints under each box.

3. **Disclosure on submission**
   - New "Disclosures" section on the submit/edit form:
     - Prior or concurrent submission: No / Yes, with "where" (conference or journal) and status (submitted, accepted, presented and date).
     - Funding and conflicts of interest (free text).
     - AI-use disclosure (required; "None" accepted).
   - Note on the form: work already submitted elsewhere is welcome provided it has not been presented by December 2026; disclosure does not affect scoring.
   - Disclosures visible to the SOC/admins and in the Excel export, never to reviewers (keeps scoring unbiased).

4. **Keeping the review double-blind** — short checklist on the submission page and the form:
   - No names, affiliations, emails or acknowledgements in the PDF, figures or text.
   - No institution/hospital names, logos or watermarks in figures or screenshots.
   - Cite own work in third person ("Smith et al. showed"), not "our previous work".
   - Avoid naming in-house software, trial or cohort names that identify the group; anonymise links and repositories.
   - Remove author metadata from the PDF and image files.

5. **ESTRO "Language matters"**
   - A short box on the submission page asking authors to follow ESTRO's call, with a link to the ESTRO page and the examples: toxicity → side effects/adverse events; dose constraints → dose guidance; organs at risk → organs of interest; set-up errors → set-up variations; report the overall benefit–risk balance.
   - Review the site's own wording (submission, topics, programme) and apply these terms where they appear.

## Technical details
- Migration: add disclosure columns to `abstracts` (prior_submission bool, prior_venue, prior_status, funding_coi, ai_use) excluded from the blinded reviewer view; add `private_notes` to `reviews` with owner-only access (exclude from SOC views/exports).
- Update the assignment function's target from max 5 to min 5.
- Update the best-paper memory (3–5 reviewers → at least 5).
