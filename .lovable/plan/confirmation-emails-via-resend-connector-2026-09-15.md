# Confirmation emails via Resend connector

## What will change

- Connect the **Resend** connector to this project (a connect card will appear; the user picks or creates a Resend connection with their API key).
- Add one backend email function that sends the abstract confirmation email through Resend: after an abstract is first submitted and after each successful edit, the submitting account receives a branded email naming the abstract and whether it was submitted or updated.
- The submission form calls this function after a successful save; email failures never block or roll back a successful submission.

## What you need to know

- Resend's default sender address (`onboarding@resend.dev`) only delivers to the Resend account owner's own email. To email arbitrary authors, a domain must be verified in the Resend dashboard (Resend shows the DNS records to add). Until then, emails are limited to the account owner's address.
- Only submission confirmation emails are in scope. No newsletters or bulk email.

## Technical details

- Call `standard_connectors--connect` with `connector_id: resend`; verify the linked connection uses the connector gateway and that `RESEND_API_KEY` is available.
- Create `supabase/functions/send-confirmation-email/index.ts`:
  - Accepts `{ abstractId, event: "submitted" | "updated" }`.
  - Verifies the caller's session and that they own the abstract (or are admin/SOC).
  - Loads the abstract title and submitting account email server-side.
  - Sends via `POST https://connector-gateway.lovable.dev/resend/emails` with `Authorization: Bearer LOVABLE_API_KEY` and `X-Connection-Api-Key: RESEND_API_KEY` headers; `from` uses a configurable sender address.
  - Surfaces provider errors (status + body) and returns them as JSON.
  - Branded HTML email (UMC Utrecht blue / PMC orange, white body) with abstract title, event, and a link to "My abstracts".
- Update `src/pages/Submit.tsx`: after successful insert/update, invoke the function with the abstract id and event; toast a warning if the email could not be sent.
- Deploy the edge function after edits.
- The sender address is read from an env var/secret or constant so it can switch from `onboarding@resend.dev` to the verified domain later without code changes elsewhere.

## Verification

- Submit a new abstract and confirm the email send is attempted; edit it and confirm the "updated" email variant.
- Check the function logs for Resend responses; confirm error surfacing when the sender domain is unverified.
- Confirm submission still succeeds even if email sending fails.
- Final build passes.
