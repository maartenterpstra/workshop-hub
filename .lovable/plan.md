## 1. Downloadable abstract templates

- Register both uploaded files as Lovable assets so they can be downloaded from the site:
  - `AIinRT2027_Abstract_Template_20260710.docx`
  - `AIinRT2027_Abstract_Template_20260710.tex`
- On `src/pages/Submission.tsx`, add a new "Download templates" card (above "Submission rules & format") with two download buttons (Word + LaTeX) pointing to the asset URLs, plus a short line that the templates define the required layout (1 A4 page, 500 words, up to 2 display items, double-blind).
- Update the "What you will upload" section copy to match the actual submission flow:
  - Paste the abstract text (Introduction / Methods / Results / Conclusion) into the platform's text fields.
  - Upload figures/tables separately as images (PNG/JPG), up to **2 display items** (was "1").
  - Upload the final compiled PDF built from the provided template.
- Bump the stated word cap from 500 to note "≈500 words (a 600-word margin is accepted by the form)".

## 2. Submission form (`src/pages/Submit.tsx`) alignment

- Add a live **word counter** across Background + Methods + Results + Conclusion; show `x / 600 words` and turn red past 600.
- Enforce a **hard 600-word cap** in the zod schema (`refine` on the combined length) so oversized submissions are rejected client-side with a clear toast.
- Update the "Abstract PDF" card copy to say the PDF must be produced from the provided Word/LaTeX template, single A4 page, double-blind (no author names in the PDF).
- Allow **up to 2 figure/table image uploads** alongside the PDF (PNG/JPG, max 10 MB each). Store next to the PDF in the existing `abstracts` storage bucket under the same per-submission folder; persist their paths in a new nullable `figure_paths text[]` column on `abstracts` (single small migration with matching GRANTs, RLS already inherited).
- Keep everything else (topics, authors block, submission window gating) unchanged.

## 3. Session-name consistency audit

Canonical list (from `Program.tsx`, matches the LaTeX template):

```
S1 Segmentation & Registration
S2 Reconstruction & Synthesis
S3 Foundation Models, Text, Explainability & Uncertainty
S4 Dose & Adaptive Workflows
S5 Clinical Predictions & Outcomes
S6 Implementation, QA & Ethics
```

Apply this list verbatim to:
- `src/pages/Submission.tsx` `topics` array (currently "Foundation Models & Text" → "Foundation Models, Text, Explainability & Uncertainty").
- `src/data/aboutContent.ts` `scientific.themes` (rename to match S1–S6 exactly, drop "Treatment Planning" which is now covered by S4 "Dose & Adaptive Workflows", rename "Contouring & Registration" → "Segmentation & Registration", "Image Synthesis & Reconstruction" → "Reconstruction & Synthesis", "Clinical Predictions" → "Clinical Predictions & Outcomes", "Clinical Implementation" → "Implementation, QA & Ethics", "Foundation Models & Text" → "Foundation Models, Text, Explainability & Uncertainty").
- `src/pages/Home.tsx` line 215 marketing bullet — rewrite to reference the six current sessions in workflow order.
- Do **not** touch `src/data/scheduleScientific.ts` (2026 archive, historical).
- Ensure the DB `topics` table (used by `Submit.tsx`) reflects the six canonical names via a migration `update`/`insert` (idempotent upsert keyed on `name`), so the topic dropdown matches.

## 4. Footer cleanup (`src/components/Footer.tsx`)

- Remove the entire "Organizers" column (the two single-name list). The Organizers tab already covers this.
- Keep the "Contact" column as-is (this is the one place the Maspero email is allowed to remain).
- Adjust grid to `md:grid-cols-2` since only two columns remain.

## 5. Remove `M.Maspero@umcutrecht.nl` everywhere except the footer

- `src/pages/Submission.tsx`: drop the "Questions? …" line with the mailto — or replace with a neutral "Questions? See the Contact section in the footer." No email rendered.
- Grep audit confirms the only other renders of `siteConfig.contact.email` are in `Footer.tsx` (keep) and `Submission.tsx` (remove).
- `siteConfig.contact.email` stays defined (footer needs it); `email2` (Terpstra) also stays for the footer.

## Technical notes

- New DB migration:
  ```sql
  ALTER TABLE public.abstracts ADD COLUMN IF NOT EXISTS figure_paths text[];
  -- topics upsert to canonical S1–S6 names, preserving display_order
  ```
  No new grants needed (column added to existing table).
- Assets registered via `lovable-assets create --file /mnt/user-uploads/… --filename …` producing `src/assets/*.asset.json` pointers imported by `Submission.tsx`.
- No new dependencies. No auth or routing changes. No changes to `scheduleScientific.ts`, `Reviewers.tsx`, `Venue.tsx`, or the 2026 archive.
