# Make the example download with its proper name on aiinrt.org

## Why it still says abstract.pdf
The fix is already built, but aiinrt.org is still running the older version of the site. That version shows the browser's own save icon inside the PDF, and that icon names the file `abstract.pdf`.

The new version:
- hides that save icon inside the PDF
- leaves one **Download** button, which saves the example as `EXAMPLE_1.pdf` and real abstracts as e.g. `AIinRT27-003_1.pdf`
- also includes the cleaned, version-numbered PDFs from earlier tonight

## Steps
1. Run the security check required before publishing, and tell you about any critical issues first.
2. Publish the site, so aiinrt.org gets the new version.
3. After publishing, open the example on aiinrt.org and confirm there is no save icon inside the PDF and that **Download** gives `EXAMPLE_1.pdf`.

## Note
Right-clicking inside the PDF and choosing "Save as" lets the browser pick its own name, and a website can't control that. That copy still has no hidden author details.
