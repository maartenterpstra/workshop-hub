# Program page: Bern affiliation, speaker photos, merged schedule, PDF download

## 1. Fix Adrian Thummerer's affiliation
On the Program page, change "LMU Klinikum, Munich, Germany" to the reviewer-page wording: "Department of Radiation Oncology, Inselspital, University of Bern, Switzerland". The old 2026 speaker bio (LMU, from last year's edition) stays as is, since it describes him at that time.

## 2. Expert talk photos
Each expert talk gets a round 64 px photo, styled like the Organizers page (same gradient circle, initials when there's no photo).
- Photos already on file: Adrian Thummerer and Ana Barragán-Montero.
- Harini Veeraraghavan, Ye Zhang, Cécile Wolfs and Tomas Janssen show initials until you send their photos.

## 3. Merge the sessions and the timetable
The separate "Sessions" card and "Provisional timetable" card become one "Programme" card with two day columns (they stack on mobile):

```text
Day 1 — 1 April 2027
08:30–09:15  Registration & welcome coffee
09:15–09:30  Opening remarks
09:30–11:00  S1 Segmentation & Registration
             [photo] Expert talk: <title>
                     Ana Barragán-Montero · UCLouvain
                     + 5 proffered papers (TBA)
11:00–11:30  Coffee break
...
```
Sessions are shown as highlighted rows with the expert talk inside them. Breaks, keynotes and social events stay as plain rows. Times and names stay the same as now.

## 4. Download as PDF
A "Download programme (PDF)" button at the top of the Programme card. The PDF is created on demand in the browser and includes:
- the AIinRT2027 logo, dates and venue in the header
- a notice: "Provisional programme. The final programme will be confirmed in December 2026, after abstract acceptance."
- both days with the same session layout, colours and speaker photos/initials as the website
- a footer with aiinrt.org

The website's "Program TBC" notice will be reworded to give the same December confirmation message.

## Technical details
- Add the `jspdf` package and draw the PDF with vector text (not a screenshot), so it stays sharp and searchable. Use theme HSL tokens converted to RGB for colours. Embed the logo as PNG, rasterised from the horizontal SVG, and photos as images with a circular clip.
- Move the session and day data into `src/data/program.ts`, so the page and the PDF use one source. Speaker photos are optional `avatarUrl` imports.
- Files: `src/pages/Program.tsx`, new `src/data/program.ts`, new `src/lib/programPdf.ts`.
