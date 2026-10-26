# Figures: required check and showing them to reviewers and SOC

## What I found
- Submitting without a figure is already blocked: the form refuses it, and the database itself rejects any abstract saved with no figure (or more than two).
- One abstract has no figure: "Patient-level conformal calibration…", submitted on 8 September. That was before the figure rule was added on 14 September. The other two abstracts each have 2 figures.
- Reviewers and SOC never see figures. Their pages show only the text and the PDF, which is why it looks like figures are missing.

## What will change
1. **Reviewer page:** a "Figures / tables" section under the abstract text, showing each uploaded image as a thumbnail. Clicking one opens it full size. Images open through short-lived private links, as the PDF does, so they stay protected and blinded.
2. **SOC page:** the same figure thumbnails in each abstract's details, plus a "No figure" label where an abstract has none.
3. **The older abstract with no figure:** My abstracts will show its author a notice asking them to add a figure, and an edit will require one. You can also email them with the existing admin email tool. I won't change or delete their submission.

## Technical details
- Load `figure_paths` in Review.tsx and the SOC list. Make the image links with `createSignedUrl` (short expiry) from the abstracts bucket.
- Check the storage read policies: reviewers must be able to read `figure-*` files under the same rules as the PDF (panel confirmed, not withdrawn), and SOC/admins can read everything. Add a migration only if that access is missing.
- No change to the figure requirement, which is already in place on the form and in the database.
- Verify by signing in as a reviewer and as SOC and checking that the images load.
