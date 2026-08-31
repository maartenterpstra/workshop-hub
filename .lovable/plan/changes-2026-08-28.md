## Changes

### 1. Add three reviewers (`src/data/reviewers.ts`)
Append to the `raw` array, sorted automatically by the existing `.sort()`:
- Josien Pluim — Biomedical Engineering, TU/e, The Netherlands
- Pim Borman — UMC Utrecht, The Netherlands
- Viktor Rogowski — Skåne University Hospital and Lund University, Sweden

No website links provided for any of the three, so they render as name + affiliation only (matching existing entries without `website`).

### 2. Fix "Call for Abstracts" link on Home (`src/pages/Home.tsx`)
The hero "Call for Abstracts" button (line ~79) currently `navigate("/registration")`. Change it to `navigate("/submission")` so it points to the submission page. The secondary "Learn more" button on the Call-for-Abstracts card already goes to `/submission` — leave it.

### 3. Replace accommodation card content (`src/data/venueContent.ts` + `src/pages/Venue.tsx`)
- Remove the `discountNote` field and its rendered paragraph ("A curated list of nearby hotels with discounted rates…").
- Add a `hotels` array to `venueContent.accommodation`, each entry `{ name, url }`, covering the eight hotels provided. Use the English-language registration URLs given.
- Update the copy to state that the list is provided as a convenience and that booking and payment are the participants' own responsibility.
- Render the list as clickable links (external, `noopener noreferrer`) in the Venue accommodation card, replacing the current "Link coming soon" / `accommodationListUrl` logic.

Hotels to add (name → URL):
- Inntel Hotels Utrecht Centre → https://www.inntelhotels.nl/utrechtcentre/en
- Hotel NH Utrecht → https://www.nh-hotels.com/en/hotel/nh-utrecht
- Malie House → https://www.maliehouse.com/en/
- Moxy Utrecht → https://www.marriott.com/en-us/hotels/amsou-moxy-utrecht/overview/
- Park Plaza → https://www.radissonhotels.com/en-us/hotels/park-plaza-utrecht
- Utrecht Boutique Hotels → https://www.utrechtboutiquehotels.nl/en/
- Stayokay Hostel Utrecht Centrum → https://www.stayokay.com/en/hostel/utrecht-centrum
- BUNK Hotel Utrecht Centre → https://wearebunk.com/utrecht/bunk-rooms/

No DB, routing, or auth changes.
