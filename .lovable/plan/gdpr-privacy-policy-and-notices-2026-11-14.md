# GDPR: privacy policy and notices

## What visitors will see

1. **New Privacy page (/privacy)**, in English, in the site's style:
  - Who is responsible: UMC Utrecht / AIinRT2027 organizing committee, contact [m.maspero@umcutrecht.nl](mailto:m.maspero@umcutrecht.nl).
  - What is collected and why: accounts (name, email, affiliation), abstracts, PDFs and figures, disclosures, reviews and reviewer notes, emails sent to authors, newsletter sign-ups (with consent date).
  - Legal grounds: running the workshop and peer review; consent for the newsletter and public reviewer listing; legitimate interest for review integrity.
  - Who else handles data: Lovable (hosting, database, sign-in, visitor analytics), Resend (emails), SurfDrive (file storage), Princess Máxima Center (registration and payment, under their own policy).
  - Visitor analytics: Lovable records pages visited, where visitors came from, country, browser, operating system, device type, time on page, page speed, errors and clicks. No cookies, nothing stored on the visitor's device, no IP addresses kept, no visitor identified. Detailed data kept 90 days, daily summaries one year. Link to Lovable's privacy policy.
  - Browser storage: only what sign-in needs to keep you logged in; no ad or tracking cookies.
  - Retention: proposed defaults (to confirm): accounts, abstracts and reviews kept until 24 months after the April 2027 workshop, then deleted or anonymized; accepted-paper programme stays public; newsletter until unsubscribe.
  - Your rights: access, correction, deletion, export, objection, withdrawing consent, complaint to the Autoriteit Persoonsgegevens; how to ask (email Matteo; answer within one month).
  - Last updated date.
2. **Footer link** "Privacy" on every page.
3. **Short notices** under the Sign up form, the abstract Submit form and the newsletter box: "See our Privacy policy".
4. **Sitemap and page title/description** updated with the new page.

## Not included (ask if wanted)

- No cookie banner: the site sets no tracking cookies. Lovable's analytics keeps counting visits either way.
- No self-service "delete my account" button; requests go by email.

## To confirm with you

- Retention period (24 months after the workshop is a placeholder).
- Whether UMC Utrecht's privacy officer should be named. Avoid the Privacy Officer.  
Rules differ by country; have UMC Utrecht's privacy officer check the final text.

## Technical details

- New `src/pages/Privacy.tsx` with content in `src/data/privacy.ts`; route in `App.tsx`; link in `Footer.tsx`; notices in `Signup.tsx`, `Submit.tsx`, newsletter component; add `/privacy` to the sitemap generator and SEO metadata.