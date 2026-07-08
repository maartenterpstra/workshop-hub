## Goals

1. Fix broken images (partner logos on home, organizer photos on Organizers page) — they currently use `/src/assets/...` paths which Vite does not serve in production.
2. Provide a graceful placeholder for any missing committee headshot.
3. Update all event dates to **18–19 March 2027**.
4. Add an **Abstract decisions / communications: 16 December 2026** milestone.

## Changes

### 1. Image rendering fixes

**`src/components/PartnerLogos.tsx`**
- Replace inline `/src/assets/...` `<img src>` with proper ES6 imports:
  - `import umcuLogo from "@/assets/umcu_logo.png"`
  - `import pmcLogo from "@/assets/pmc_logo.png"`
  - `import dlinrtLogo from "@/assets/dlinrteu_logo.png"`
- Tidy sizing so logos render at a consistent height and don't overflow the small square wrapper.
- Fix the alt text on the DLinRT logo (currently says "Princess Máxima Center Logo").

**`src/pages/Organizers.tsx`**
- Build a static `import.meta.glob` map of `/src/assets/organizers/*.{jpg,png}` → resolved URLs.
- Reference each person by filename slug (`matteoMasperoImg`, etc.) via the map, so bundling works.
- Add a `<PersonAvatar>` sub-component:
  - If a resolved photo URL exists, render `<img>` with `object-cover`, `object-top`, rounded, fallback `onError` swaps to initials placeholder.
  - Otherwise render initials on a subtle brand-tinted circle (current gradient look) — this is the "placeholder for committee photos" the user asked for.
- Remove the current overlap where both an `<img>` and initials render inside the same circle.

### 2. Date + timeline updates

Set the workshop dates to **18–19 March 2027** everywhere they appear:

- **`src/data/siteConfig.ts`** — `dates: "18-19 March 2027"`, `abstractSubmissionDeadline: "1 December 2026"` (keep as-is), no other structural changes.
- **`src/data/aboutContent.ts`** — both `educational.date` and `scientific.date` → `"18-19 March 2027"`.
- **`src/pages/Home.tsx`** — timeline items:
  - Call for abstracts — 1 September 2026
  - Registration opening — 1 October 2026
  - Abstract submission deadline — 1 December 2026
  - **Abstract decisions communicated — 16 December 2026** (new)
  - AIinRT Symposium — **18–19 March 2027**
  - Adjust the grid to `md:grid-cols-5` to fit five items cleanly.
- Any other hard-coded "25–26 March 2027" strings found in Home hero / other pages → update to the new dates. (Header/Program/Venue will be spot-checked in the same pass.)

### 3. Non-goals

- No design overhaul, no schema changes, no new pages. Purely presentation and content fixes.
- Registration and Submission page copy already reads dates from `siteConfig`; no direct edits needed there beyond the config change.

## Technical notes

- Vite requires assets to be imported (or placed in `public/`) — direct `/src/...` URLs 404 in dev preview and production. `import.meta.glob("...", { eager: true, as: "url" })` is the idiomatic way to map a folder of images.
- The placeholder avatar keeps the existing `bg-gradient-to-br from-primary/20 to-secondary/20` styling with the person's initials so the committee grid still looks intentional when a photo is missing or fails to load.
