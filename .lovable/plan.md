# Fix failing abstract submissions (Claudio Fiorino, HSR Milan)

## What is going on
- The submitter is **Claudio Fiorino** (fiorino.claudio@hsr.it). He created his account today at 11:46 UTC.
- Between 12:45 and 12:50 UTC he pressed Submit **5 times**. Every time his PDF (565 KB) uploaded fine, but the attempt stopped right after that. **No figure was ever saved and no abstract was created.** So he has nothing on "My abstracts" and the 5 copies of his PDF are left over.
- The server never received his figure uploads at all. There are no database errors and no access-rule refusals. Most likely his figure upload is blocked or cut off between his browser and our storage. This could be his hospital network or firewall (like the Mayo and Fortinet cases), or a very large or unusual image file.
- The form then shows only a short technical error message. He can't tell which step failed, and every retry starts over and uploads the PDF again.
- All other recent submitters (013, 014, 015) went through normally, so the form isn't broken for everyone.

## What I will change
1. **Clear step-by-step progress and errors.** Submit will show "Uploading PDF... Uploading figure 1... Saving abstract..." When a step fails, it names the step and the file and says what to do. For example: "Figure 1 could not be uploaded. This is often caused by an institutional network. Try another network or a smaller PNG/JPG."
2. **Don't lose work on retry.** If he presses Submit again in the same session, files that already uploaded are reused. The PDF won't upload again.
3. **Automatic retry** of each upload (up to 3 tries) for short network drops, with a 60-second time limit so the button never hangs.
4. **Failure log for admins.** Every failed submission attempt is saved: who, which step, the error text and file size and type. You can then see exactly what went wrong without asking the author. Only admins can see this log, and it never holds abstract content.
5. **Clean up leftovers.** Remove Claudio's 5 unused PDF copies. Also remove Rita's 2 leftover figures if you agree.
6. **Draft reply to Claudio** (not sent). It explains the problem, suggests trying from another network, and offers to submit for him if he emails the files.

## How I will check it
- Make a figure upload fail in a test, and check the clear message appears and a retry doesn't upload the PDF again.
- Submit a full abstract as a test author and confirm it shows on "My abstracts". Then remove the test abstract.
- Tests for the retry and the reuse of uploaded files.

## Technical details
- `Submit.tsx`: split the submit flow into named steps, use a `withRetry(fn, 3, timeout)` helper (in `src/lib/`, with a test in `tests/`), and keep uploaded paths in state keyed by the File object.
- New table `submission_errors` (user_id, step, message, file_size, file_type, user_agent, created_at). Users can only add their own rows, and only admins can read them. Plus a small admin panel listing the last 50.
- Remove the orphan `upload-*.pdf` objects under `f740623b…/`.
