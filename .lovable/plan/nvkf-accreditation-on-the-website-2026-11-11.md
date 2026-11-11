# NVKF accreditation on the website

## What changes
- **Home page:** next to the "Endorsed by" row, add an "Accredited by" item with the NVKF logo, linking to https://www.nvkf.nl (opens in new tab), same tile style as EFOMP/AAPM/MICCAI/ESTRO.
- **Accreditation text:** replace "Accreditation status: TBC." in the About details with "Accredited by the NVKF (Dutch Society for Medical Physics)."
- **Registration page:** one short line noting the workshop is NVKF-accredited (useful for attendees collecting points).
- **Footer:** small "Accredited by NVKF" mention.

## Logo
- Download the official NVKF logo from nvkf.nl (as used in previous editions); if it can't be fetched cleanly, I'll ask you to upload it.

## Open point
- Number of accreditation points is unknown — tell me if you want it shown (e.g. "X NVKF points").

## Technical
- Add NVKF entry (separate "Accredited by" label) in EndorsementLogos.tsx; logo saved under src/assets; text in aboutContent.ts / siteConfig.ts.
