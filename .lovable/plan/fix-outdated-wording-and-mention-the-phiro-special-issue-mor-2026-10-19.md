# Fix outdated wording and mention the phiRO special issue more often

## Outdated statements to fix
1. Home, Call for Abstracts box: "Attendee registration will be handled on a separate site — details to follow." becomes "Registration is open on the Princess Máxima Center platform (closes 1 March 2027)", with a link to the registration site.
2. Home, same box: the badge "Opens 1 September 2026" becomes "Open now · deadline 1 December 2026", since submissions are already open.
3. Registration page: the top line "Opens 1 October 2026" becomes "Registration is open · closes 1 March 2027". The "link will appear here as soon as it goes live" placeholder is no longer shown, because the link is now set.
4. Registration page: change "You will be (forwarded)" style wording to the present tense where it suggests the site is not live yet.

## phiRO special issue mentions (each links to the ScienceDirect page, opening in a new tab)
- Home, Call for Abstracts box: one sentence: "Selected work can be developed into a full paper for the phiRO virtual special issue on AI in radiotherapy."
- Submission page, top notice: a short line about the special issue with the link.
- Submission page, "Ready to submit?" box: a reminder that all authors are invited to submit a full paper to the special issue.
- Program page, under the December notice: one line about the special issue.
- Footer: a "phiRO special issue" link next to the other links.
- Short search description for the home page: mention the phiRO special issue.

## Technical details
- All links use `siteConfig.specialIssueUrl`. Status labels read the existing date fields in siteConfig, so no new dates are added.
- Files: Home.tsx, Registration.tsx, Submission.tsx, Program.tsx, Footer.tsx, RouteSeo.tsx.
