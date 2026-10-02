# Newsletter sign-up (via Resend)

## What visitors see
- A small **"Stay updated"** box in the footer on every page and a short section on the home page. Each has an email field, an optional name field, and a **Subscribe** button.
- A required checkbox reads: "I agree to receive AIinRT news by email. I can unsubscribe at any time."
- After subscribing, a confirmation message appears. The visitor also gets a short welcome email from `AIinRT2027 <abstracts@aiinrt.org>` with an **Unsubscribe** link.
- The unsubscribe link opens a simple page, `/unsubscribe`, that confirms removal.
- Signing up twice with the same email is harmless: the visitor still sees the success message and doesn't get a second welcome email.

## What admins get
- Every subscriber is added to a Resend **Audience** called "AIinRT newsletter". You can send future newsletters (broadcasts) straight from Resend with their built-in unsubscribe handling.
- A copy of each subscriber is also kept in the site's own database. The admin Exports card gets a new **Export newsletter subscribers (CSV)** button.

## Technical details
- New table `newsletter_subscribers` with these columns: id, email (unique, lowercased), name, consent_at, unsubscribed_at, unsubscribe_token, resend_contact_id, created_at. RLS allows no direct client access except admin SELECT. All writes go through the edge function using the service role. Grants are included.
- New edge function `newsletter`:
  - `subscribe`: public. Validates the input with zod (email, name up to 100 characters, consent must be true) and includes a honeypot field. It upserts the row, finds or creates the Resend audience (`GET/POST /audiences`), adds the contact (`POST /audiences/{id}/contacts`), and sends the welcome email only the first time.
  - `unsubscribe`: takes the token, sets `unsubscribed_at`, and marks the Resend contact `unsubscribed: true`.
- The function uses the existing Resend connector and sender domain, so no new keys are needed.
- Frontend: a new `NewsletterSignup` component used in Footer.tsx and Home.tsx, a new `Unsubscribe.tsx` page plus its route, and the CSV button in AdminExports.tsx.
