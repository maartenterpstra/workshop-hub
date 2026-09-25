# Registration opens 1 October 2026

## What changes
- The home page timeline will show "Registration opening: 1 October 2026" instead of "TBC".
- The registration page will read "Opens 1 October 2026 · Registration closes 1 March 2027".
- The registration page keeps its note that the link to the Princess Máxima Center registration site will appear once it is live (expected next week). The button appears as soon as you send the link.

## Technical notes
- In `src/data/siteConfig.ts`, set `registrationOpensOn: "1 October 2026"`. Home and Registration already read this value.
- `externalRegistrationUrl` stays empty until the link is provided.
