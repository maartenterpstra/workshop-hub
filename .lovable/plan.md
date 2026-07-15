## Changes

### 1. Registration page (`src/pages/Registration.tsx`)
In the PMC registration card content, add a bullet noting that the external PMC registration site also publishes a curated list of nearby hotels with discounted rates for AIinRT2027 attendees. Add a short paragraph directing users to consult it when booking travel.

### 2. Venue page (`src/pages/Venue.tsx` + `src/data/venueContent.ts`)
Extend the Accommodation card to remind attendees that a list of hotels with negotiated discounts will be provided on the PMC registration site. Add a placeholder external link (`accommodationListUrl` in `venueContent.accommodation`, empty for now) that renders as a "View accommodation list" button when set, and as a "Link coming soon" italic note when empty. No new fields elsewhere.

### 3. Computational Imaging Group logo (`src/components/PartnerLogos.tsx` + Home "Organized by")
- Upload the CIG logo via `lovable-assets` to `src/assets/cig-logo.<ext>.asset.json`. **The user needs to provide the CIG logo file** (PNG/SVG) — if not provided this turn, I'll add a text-only placeholder tile linking to https://www.computationalimaginggroup.com and swap in the image once the file lands.
- Add a fourth tile in `PartnerLogos.tsx` for the Computational Imaging Group, wrapped in `<a href="https://www.computationalimaginggroup.com" target="_blank" rel="noopener noreferrer">`, matching the existing tile styling.
- Update the "Organized by" line on `Home.tsx` to: **"Organized by UMC Utrecht (Computational Imaging Group) in collaboration with PMC & DLinRT.eu"** with CIG hyperlinked.

### Question for you
Do you have the CIG logo file to upload, or should I ship a text-only tile now and swap in the logo when you send it?

No DB, routing, or auth changes.
