# Rename and clean the PDF when it is uploaded

## What you will see
- When an author uploads their PDF, it is saved under the abstract's number, e.g. `AIinRT27-008.pdf`, not `abstract.pdf` or their own file name.
- The hidden file details (author, creator, title) are removed during upload, so the stored file is already anonymous, not only the copy reviewers download.
- The 8 PDFs already uploaded, including the example, are renamed and cleaned the same way.
- The "Open in new tab" button is removed from the PDF window. Browsers give new-tab copies a random name, and the site can't change that. Reviewers keep the in-page viewer and the **Download** button, which already uses the number.

## Technical details
- `Submit.tsx`: clean the file with `stripPdfMetadata` before upload. For a new abstract, insert the row first to get `abstract_number`, then upload to `{uid}/{id}/AIinRT27-NNN.pdf` and update `file_path`. Edits overwrite that same numbered path. The required-file trigger is checked so the two-step insert still passes.
- One-off script (service role): for each abstract, download the PDF, strip metadata, re-upload to the numbered path, update `file_path` and remove the old object.
- `PdfViewerDialog`: drop the new-tab link and keep the toolbar hidden.
