# Dinner location on the Program + registration prices

## 1. Dinner location in the programme
On the Program page, the Day 1 row "Optional: social dinner" (from 19:00) gains the venue so participants see it directly:
- Text: "Optional: social dinner — Humphrey's Restaurant Utrecht".
- A "Google Maps directions" link pointing to
  `https://www.google.com/maps/dir/?api=1&destination=Humphrey's Restaurant, Stadhuisbrug 3, 3511 KP Utrecht`
  (no restaurant website link, only the maps directions, per request).
- The downloadable programme PDF also shows "Optional: social dinner — Humphrey's Restaurant Utrecht, Stadhuisbrug 3, 3511 KP Utrecht" on its Day 1 page, so the printed programme carries the venue too.

## 2. Prices on the Registration page
Add a compact price list on the Registration page so visitors get a cost heads-up before opening the external PMC site:
- €100 per day — academia / students
- €150 per day — vendors / commercial parties
- €65 per person — conference dinner

Placement: a small card (or section within the existing "Register via the Princess Máxima Center" card) right before the registration button, labelled e.g. "Indicative prices". A note states the final fee details and payment are confirmed on the external PMC platform.

## Technical details
- `src/data/program.ts`: extend the `item` row with optional `location?: string` and `mapsUrl?: string`; set them on the Day 1 dinner row. This keeps one source for page and PDF.
- `src/pages/Program.tsx`: render the location text and, when `mapsUrl` is present, a small "Google Maps directions" link (opens in a new tab, `rel="noopener noreferrer"`).
- `src/lib/programPdf.ts`: for item rows with a `location`, append the location to the printed label; use jsPDF `textWithLink` so the maps URL is clickable in the PDF.
- `src/data/siteConfig.ts`: add a `prices` block (academia, vendor, dinner) so the Registration page reads from config like the other content.
- `src/pages/Registration.tsx`: add the price list with the note about the external PMC platform.
