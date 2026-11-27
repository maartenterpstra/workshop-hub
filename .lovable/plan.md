# Unblock Claudio Fiorino's submission

## Findings
- Account fiorino.claudio@hsr.it exists (created 26 Nov). No abstract saved.
- On 26 Nov, 12:45–12:50, his PDF (553 KB) uploaded fine 5 times. No figure ever reached storage.
- The figure check runs before the PDF upload, so he did attach a figure. Each attempt then failed while uploading the figure.

## Answer
Yes, most likely. Without the figure step the PDF upload already works, and saving the abstract comes next. The figure rule is not what blocks him. The figure upload itself fails, probably because of his hospital network or the file type or size.

## Proposed fix (choose one)
1. Quick: if a figure upload fails, still save the abstract and mark it "figure missing". The author can add the figure later, before 1 Dec 12:00. The rule stays for everyone else.
2. Contact only: email Claudio and ask him to retry from mobile data, or with a PNG/JPG under 2 MB.

## Technical details
- In Submit.tsx, catch upload_figure_N errors and continue with the figure paths that did upload. Show a warning, and let the edit flow add figures.
- SOC sees a "figure missing" badge (already shown for older abstracts with no figure).
