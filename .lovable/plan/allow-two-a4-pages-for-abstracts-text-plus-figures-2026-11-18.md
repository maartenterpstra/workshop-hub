# Allow two A4 pages for abstracts (text plus figures)

Joëlle pointed out that about 500 words plus 1–2 required figures do not fit on one A4 page. The new rule: **at most 2 A4 pages**, with the same word limits (500-word target, 600 maximum) and 1–2 figures or tables. The second page is meant for figures, tables and references.

## Changes on the site
1. **Call for abstracts page:** change "one A4 page" to "max. two A4 pages (second page for figures, tables and references)", both in the summary line and in the requirements list.
2. **Submit form:** update the PDF upload hint to match.
3. **Templates (Word and LaTeX):** update the instruction text inside both files from "one A4 page" to "max. two A4 pages". The LaTeX template's comment header changes too, and its garbled bullet character gets fixed.
4. Search the site for any other "one page / single page" wording about abstracts and update it. The programme PDF is not affected.

## Reply to Joëlle (draft, not sent)
A short English email, given to you in the chat:
- Thank her and confirm she spotted a real conflict.
- The limit is now max. two A4 pages, with the second page for figures, tables and references. Word limits are unchanged and the updated templates are on the website.
- Her attached PDF is not anonymous. We did not forward it to reviewers. Please submit an anonymised version through the website, as reviewers must not see author names.

## Technical details
- Edit `src/pages/Submission.tsx` (lines ~82, ~158) and `src/pages/Submit.tsx` (~464).
- Edit `src/assets/AIinRT2027_Abstract_Template.tex`. Edit the `.docx` by unzipping it, updating the text in `word/document.xml` and re-zipping it.
- There is no page check in code, so no logic or tests change.
- Save the new page rule to project memory.
