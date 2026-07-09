## Changes

### 1. Venue page (`src/pages/Venue.tsx` + `src/data/venueContent.ts`)

- **Tram/bus stop**: change `byTrain.instructions` from "Get off at UMC Utrecht" to "Get off at **Prinses Máxima Centrum (P+R Science Park)**" stop. Line 12 (tram Uithoflijn) — verify wording so it clearly says PMC, not UMC.
- **Auditorium location**: update `venueContent.venue.institution` from
  `"Auditorium, Department of Radiotherapy, Heidelberglaan 25, ..."`
  to
  `"Auditorium (2nd floor), Heidelberglaan 25, 3584 CS Utrecht, The Netherlands"`.
- **Contact info**: remove the "Contact Information" `<Card>` from the 2×2 travel grid, and rebalance the grid (three cards: train / car / air on a `md:grid-cols-3`). Keep contact info only in the site-wide `Footer.tsx` at the bottom of every page — nothing extra added.

### 2. Abstract submission page (`src/pages/Submission.tsx`)

Add a friendly notice inside the "Ethics & originality" section (and mirror one line in the intro Alert) stating:

> We welcome submissions of work that has been submitted or is under review elsewhere, provided it has **not yet been presented** at another conference. Please disclose any such prior submission when uploading — this **will not affect scoring**. Our goal is a high-quality, science-focused meeting with a low threshold to participate.

Tweak the existing "Work must be original and not previously published in full" bullet to align (replace "originality" wording with the encouragement + disclosure request).

### 3. New Reviewers page

Parse the uploaded spreadsheet (37 reviewers, filtered to those who ticked "May we list you publicly … Yes"). Create:

- **`src/data/reviewers.ts`** — typed array `{ name, surname, affiliation, website?: string }[]`. Names normalized (trim, fix capitalization like "Bol / Gijs" → "Gijs Bol"). Bare-domain URLs (e.g. `konsta.com.pl`, `sebastiaanbreedveld.nl`) get `https://` prefixed. No emails displayed.
- **`src/pages/Reviewers.tsx`** — simple responsive list (single-column readable layout, alphabetical by surname). Each entry:
  - `**Name Surname**` — Affiliation
  - Optional "Website ↗" link (opens in new tab, `rel="noopener noreferrer"`).
  - No photos, no bios beyond affiliation (the spreadsheet has no bio text — only affiliation + optional URL, which matches "bio with link if provided").
- Route + nav:
  - Add `/reviewers` route in `src/App.tsx`.
  - Add "Reviewers" link to `src/components/Header.tsx` (placed near Organizers).

### 4. Non-goals

- No schema changes, no auth changes, no scoring logic changes.
- No photos for reviewers.
- No copy changes outside the three items above.

## Technical notes

- Reviewer list is derived at build time from the xlsx and hardcoded in `reviewers.ts` — no runtime spreadsheet parsing. Anyone who answered "No" to public listing is excluded.
- Sorting: alphabetical by surname on render (`localeCompare`), no user-facing controls needed.
