# Related special issue links

1. Save the special issue address in the site settings: [https://www.sciencedirect.com/special-issue/338195/development-and-clinical-implementation-of-artificial-intelligence-in-radiotherapy](https://www.sciencedirect.com/special-issue/338195/development-and-clinical-implementation-of-artificial-intelligence-in-radiotherapy)
2. Home page: under the title, add a third button "Related special issue" next to "Call for Abstracts" and "Previous edition (2026)". It opens the ScienceDirect page in a new tab.
3. Submission page: in the best-paper award box (phiRO), add the link "View the AI in RT special issue (phiRO)". It also opens in a new tab.  
4. specify that we invite all the submission to finalize a full paper in the same special issue. formulate a sentnece to specifcy this  


## Technical details

- `siteConfig.specialIssueUrl` added; Home.tsx hero button row (around line 94) gets an outline Button with an external-link icon; Submission.tsx award section gets an anchor using the same style as the ESTRO link.