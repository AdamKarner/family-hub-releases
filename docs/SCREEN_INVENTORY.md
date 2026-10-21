# Interactive demo screen inventory

Reference authority: native Android phone screenshots and screen recording, **not yet checked against the missing v1.0 baseline in this branch**.

Legend: B = reported in v1.0 handoff (unverified in repository); V = visual comparison pending; T = browser interaction testing pending. Do not treat B as verified completion.

| Screen / workflow | Native reference | Demo implementation | Visual fidelity | Interaction test | Open differences |
|---|---|---|---|---|---|
| Home dashboard | Phone screenshots | B | V | T | Compare density and spacing |
| Calendar Agenda | Phone screenshots/video | B | V | T | Compare day navigation |
| Calendar Week | Phone screenshots/video | B | V | T | Compare grids/events |
| Calendar Month | Phone screenshots/video | B | V | T | Compare calendar cells |
| Event view/edit | Phone screenshots/video | B | V | T | Validate save/cancel |
| Countdown management | Phone references | B | V | T | Verify edits and persistence |
| Meals / dishes / saved meals | Phone references | B | V | T | Verify selection and edit |
| Grocery list types | Phone references | B | V | T | Check add/edit/checkoff |
| Daily tasks | Phone references | B | V | T | Verify progress calculations |
| Rewards / redemption | Phone references | B | V | T | Check points accounting |
| Child profiles / points | Phone references | B | V | T | Fictional portraits only |
| Settings / appearance | Phone references | B | V | T | Light/Dark and four accents |
| Portrait wall display | Forthcoming photos | Not started | V | T | Await native reference |
| Landscape tablet | Native references required | Not started | V | T | Define workflows |
| Device switching | Cross-device specification | Not started | V | T | Shared local state |

For each future fidelity pass, record native screenshot filename/viewport, demo screenshot, issues, correction commit, and actual browser result. Never place raw personal screenshots in this public repository.
