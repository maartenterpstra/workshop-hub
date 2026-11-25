# Show already-uploaded files when editing an abstract

## What is going on
Rita's upload worked. Abstract AIinRT27-013 has its PDF (now version 4, `AIinRT27-013_4.pdf`) and both figures saved and linked. The problem is the **Edit abstract** page:
- The PDF box always says "Drop PDF here or click to browse" and never mentions the PDF already saved.
- Figures only show a small line, "2 existing images will be retained", with no previews.

So authors think their files are gone. Rita has uploaded the PDF again three times because of this.

Side finding: her account also has two figure files left over from an earlier attempt that never became an abstract. Nobody can see them and they cause no harm.

## Changes
1. **PDF box on the edit page:** show "Current PDF: AIinRT27-013_4.pdf" with a **View** button (the same secure viewer reviewers use). Below it, say "Upload a new PDF only if you want to replace it".
2. **Figures box on the edit page:** show small previews of the saved figures, labelled "Currently saved". Say they stay unless you upload replacements.
3. **My Abstracts:** add a short line on each abstract, "PDF ✓ · 2 figures ✓", so authors can check their files without opening the edit page.
4. Optional cleanup: remove Rita's two leftover figure files.

## Reply to Rita (draft, not sent)
A short note: the upload worked, all files are safe, and the page now shows them.

## Technical details
- In `Submit.tsx`, when `existingFilePath` is set, render the file name with `fileNameFromPath` and a `PdfViewerDialog` trigger. Render `AbstractFigures` with `existingFigurePaths`. Both already download through authenticated storage, so author access is checked by the existing rules.
- In `MyAbstracts.tsx`, add `file_path` to the select and show the badges.
- Cleanup: delete the storage objects under `40a276ba…/9974d5bb…/`.
