# Programme: shorter PDF, expert-talk photos, keynote placeholders

## 1. Shorter PDF (no photos)
- Remove speaker photos and initials circles from the PDF.
- Tighten row heights and spacing so each day fits on exactly one page (two pages total), keeping the logo, colours and the "final programme confirmed in December 2026" notice.
- Visually check both pages after generating.

## 2. Expert-talk photos from the internet
- Search official sources (university/hospital staff pages, Google Scholar/ResearchGate profiles, institutional news) for Harini Veeraraghavan, Ye Zhang, Cécile Wolfs and Tomas Janssen.
- Save the found headshots into the site's images and show them on the Program page in the same round style. Anyone without a reliable photo keeps initials; I'll report which ones I found and where from so you can confirm they are allowed to be used.

## 3. Keynote placeholders (website only)
- Keynote 1 (Day 1): placeholder speaker card with a generic male silhouette photo, "Speaker to be announced", plus empty bio and talk abstract sections ("coming soon").
- Keynote 2 (Day 2): same, with a generic female silhouette.
- Clicking a keynote opens its details (photo, bio, abstract), like the speaker bios elsewhere.
- In the PDF the keynotes appear only as "Keynote 1 / Keynote 2" with time — no bio, abstract or photo.

## Technical details
- `src/data/program.ts`: add `keynote` fields (name, affiliation, bio, abstract, placeholder avatar) to the two keynote items; add avatarUrl imports for new expert photos in `src/assets/`.
- `src/lib/programPdf.ts`: drop `circleAvatar`/avatar map and image drawing; reduce row heights; force one page per day.
- `src/pages/Program.tsx`: render keynote cards with a dialog for bio/abstract.
