# Abstract numbers and anonymous PDF downloads

## What you will see
- Every abstract gets a permanent number, like **AIinRT27-001**. The abstracts already submitted are numbered in the order they came in, and new ones get the next number automatically. The example abstract for reviewers is called **EXAMPLE** and isn't numbered.
- The number appears on the review page, the committee page, My Abstracts, the confirmation emails and the Excel/CSV exports.
- A downloaded PDF gets a name like `AIinRT27-007.pdf`, never `abstract.pdf`, the author's name or account details.
- Before a reviewer opens or downloads the PDF, the site removes its hidden file details (author, creator, title). Word and LaTeX often fill these with the author's name.
- The reviewer view no longer shows the address where the file is stored, because it contains the uploader's account ID.

## What cannot be done automatically
Names typed into the PDF's own text can't be removed reliably. To cover that:
- The submit page gets a clear checkbox: "My PDF contains no author names, affiliations or acknowledgements."
- The committee page gets a "PDF anonymity checked" flag per abstract, so you can check each one quickly before confirming its reviewer panel.

## Technical details
- Migration: add `abstracts.abstract_number int` with a unique value. Backfill by `submitted_at` (excluding the example abstract), add a sequence and a default trigger for new rows, and allow no edits by authors. Add `abstracts.pdf_anon_checked_at timestamptz` (writable by SOC/admin only).
- Add shared `formatAbstractNumber()` in `src/lib`, with a unit test in `tests/`.
- In `PdfViewerDialog`: load the PDF with `pdf-lib`, clear Author/Creator/Producer/Title/Subject/Keywords and XMP metadata, then display and download that cleaned copy with the number as its file name.
- Add the number to Review, SOC, MyAbstracts, the exports and the `send-confirmation-email` and `send-author-email` subjects.
