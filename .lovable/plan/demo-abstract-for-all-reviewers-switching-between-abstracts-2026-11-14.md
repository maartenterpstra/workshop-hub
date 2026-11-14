# Demo abstract for all reviewers + switching between abstracts

## Goal
Every reviewer can open one realistic example abstract now, to see how reviewing works, without it affecting real scores. Reviewers with several abstracts can switch between them easily.

## What reviewers will see
1. **Demo abstract** "How agentic AI will save radiotherapy", clearly marked "Example – not scored". It has:
   - structured text (background, methods, results, conclusion, about 300 words, invented and labelled as fictional);
   - a nicely designed PDF in the AIinRT2027 style;
   - an attractive figure, for example a diagram of an AI agent loop: imaging, contouring, planning, QA, adaptation.
2. **Practice form:** reviewers can fill in the full form on the demo, but nothing is saved or sent. A note explains this, and the button says "Try it (not saved)".
3. **Switching between abstracts:** when there is more than one abstract (the demo plus real ones after 1 December), a list at the top shows each title with its status (to do / submitted). Clicking one shows only that abstract. The demo always comes last, and real abstracts open first.
4. **Before 1 December:** only the demo shows. Afterwards, real assigned abstracts appear as well.

## Clean-up
- Replace the current Gmail-only test abstract with this demo. Remove the extra reviewer role from your Gmail, unless you want to keep it for testing.
- Keep the demo out of committee lists, exports, averages, the best-paper ranking, decisions and the schedule.

## Not included
- No email goes to reviewers. You can announce it yourself, or ask me to send one afterwards.

## Technical details
- The demo is one abstract row with a fixed ID, assigned to every reviewer (plus future ones via the existing assignment flow), with a confirmed panel.
- On the review page, the demo is always shown even before submissions close. Its submit and notes actions run locally only.
- The SOC/admin pages, exports, scheduling and decision queries exclude the demo ID through a shared constant.
- The figure is created with the image generator. The PDF is built with reportlab, checked page by page, and uploaded to the private bucket.
- The review list uses tabs or a selector when there is more than one abstract.
