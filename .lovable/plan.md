## Changes

### 1. Logo assets
Upload the four uploaded SVGs via `lovable-assets` CLI:
- `aiinrt2027_icon.svg` → `src/assets/aiinrt2027-icon.svg.asset.json`
- `aiinrt2027_logo_horizontal.svg` → `src/assets/aiinrt2027-logo-horizontal.svg.asset.json`
- `aiinrt2027_logo_dark.svg` → `src/assets/aiinrt2027-logo-dark.svg.asset.json`
- `aiinrt2027_logo_stacked.svg` → `src/assets/aiinrt2027-logo-stacked.svg.asset.json`

### 2. Header (`src/components/Header.tsx`)
Replace current `logoImage` + adjacent text block with the **horizontal logo** (`aiinrt2027_logo_horizontal.svg`) — it already contains the "AIinRT 2027" wordmark, so the sibling `<div>` with "AIinRT 2027 / Artificial Intelligence in Radiotherapy" is removed. Height ~h-12. Alt text: "AIinRT2027".

### 3. Dates + branding (`src/data/siteConfig.ts` and content files)
- `siteConfig.dates`: `"Dates TBA"` → `"1–2 April 2027"`
- Search & replace across `src/data/aboutContent.ts`, `src/pages/Home.tsx`, `src/pages/Program.tsx`, `src/pages/Submission.tsx`, `src/pages/Venue.tsx`, `index.html` meta:
  - Any placeholder dates ("18-19 March 2027", "Dates TBA", "TBA") in prose → "1–2 April 2027".
  - Rename all instances of "AIinRT 2027" (with space) → "AIinRT2027" in visible copy, titles, meta description, alt text, page headings. `siteConfig.subtitle` stays as "2027 Workshop" but written together where "AIinRT2027" appears as the event name.

### 4. "Organized by" clarity (`src/pages/Home.tsx` + `src/components/PartnerLogos.tsx`)
- Add/adjust an "Organized by" line on Home stating: **"Organized by UMC Utrecht in collaboration with Princess Máxima Center and DLinRT.eu"**.
- In `PartnerLogos.tsx`, wrap the UMCU tile in `<a href="https://www.umcutrecht.nl" target="_blank" rel="noopener noreferrer">` and the PMC tile in `<a href="https://www.prinsesmaximacentrum.nl" target="_blank" rel="noopener noreferrer">`. DLinRT.eu is already linked. Add matching hover shadow class.

### 5. Best-paper APC waiver (`src/pages/Submission.tsx`)
Add a short callout (Alert or new small card) under the "Review criteria" section:

> **Best-paper award — free APC waiver.** The highest-scoring abstract (by reviewer scores) receives a full Article Processing Charge (APC) waiver toward a follow-up open-access publication.

No DB, auth, routing, or migration changes.

### Technical notes
- Asset URLs referenced as `import logo from "@/assets/....asset.json"; <img src={logo.url} />`.
- The user-uploaded SVGs contain embedded wordmarks, so header text duplication is removed to avoid double-branding.
- Preserve existing responsive behavior on Header (logo hides nothing on mobile; still fits h-12).
