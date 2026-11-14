# Version numbers on abstract PDFs

## What you will see
- Each PDF an author uploads gets a version number: the first upload is `AIinRT27-008_1.pdf`, and each replacement is the next number (`_2`, `_3`, and so on).
- The 8 PDFs already in the system become `_1`, e.g. `AIinRT27-003_1.pdf` and `EXAMPLE_1.pdf`.
- Reviewers and the committee always see the latest version. The **Download** button saves it under its versioned name, e.g. `AIinRT27-003_2.pdf`.
- Older versions stay stored privately rather than being deleted. Only the newest is shown in the site.
- The committee page shows "version 2" next to Open PDF, so you can see an abstract was updated. Uploading a new version also clears the "PDF anonymity checked" tick, as it does now.

## Technical details
- `src/lib/abstractNumber.ts`: add `pdfVersionFromPath(path)` and `versionedPdfName(number, version)`, with unit tests in `tests/`.
- `Submit.tsx`: when a PDF is uploaded, read the version from the current `file_path` (0 if there is none), upload the cleaned file to `{uid}/{id}/AIinRT27-NNN_{v+1}.pdf` and point `file_path` at it. Remove only the temporary upload, never earlier versions.
- `PdfViewerDialog`: base the download name on the file name in `file_path`.
- Soc page: show the version.
- One-off admin function (deleted afterwards): rename the existing 8 files to `_1` and update `file_path`.
