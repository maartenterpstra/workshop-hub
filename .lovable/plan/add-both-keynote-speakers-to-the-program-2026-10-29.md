# Add both keynote speakers to the Program

## What changes
- **Keynote 1 (Day 1, 16:00–16:45):** Akshay S. Chaudhari, Stanford University — "Foundation models in radiology — state and future". Uses his uploaded photo, the condensed bio and abstract you sent, and a "Stanford profile" link.
- **Keynote 2 (Day 2, 15:45–16:30):** Jelmer M. Wolterink, University of Twente — "Artificial intelligence for cardiovascular applications". Uses his uploaded photo, bio, abstract and a "University of Twente profile" link.
- The male/female placeholder figures and "Speaker to be announced / Coming soon" texts are removed.
- Program page: each keynote row shows the photo (round, same style as now), name, affiliation and talk title; clicking opens the window with bio, abstract and profile link.
- PDF programme: still no photos or bios; the keynote line becomes e.g. "Keynote: Foundation models in radiology — state and future — Akshay S. Chaudhari (Stanford University)", kept to one page per day.

## Technical details
- Upload both photos as assets (src/assets/keynotes/akshay-chaudhari.jpg, jelmer-wolterink.jpg pointers); remove placeholder SVGs if unused.
- `Keynote` type in src/data/program.ts gains `profileUrl`; replace `keynote()` helper calls with full data.
- Program.tsx dialog: render bio/abstract paragraphs and an external profile link (new tab).
- programPdf.ts: print speaker + title for keynote rows, wrapping if needed; verify both PDF pages and the Program page in the browser.
