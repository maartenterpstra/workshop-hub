# Show the chosen session clearly on each abstract (SOC page)

All 16 abstracts in the database have a session saved. The SOC page already shows it as a small grey tag next to the title, which is easy to miss, and the live site doesn't have the latest changes yet.

## What changes
- On each abstract card on the SOC page, add a clear line under the title and authors:
  **Session:** <main session> · **2nd choice:** <second session> (the second part only when one was chosen).
- Keep the small tag next to the title.
- Do the same in the decision step of the SOC workflow, where each abstract row will show its session name.
- After the change, publish so the committee sees it on the live site.

## Technical details
- `src/pages/Soc.tsx`: add a labelled `<p>` with `a.topic?.name ?? "No session"` and `a.second_topic?.name`.
- `SocDecisionsWorkflow.tsx`: show the `topic` prop it already receives in each row, if it doesn't show it yet.
