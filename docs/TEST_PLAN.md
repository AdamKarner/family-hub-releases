# Interactive demo test plan

## Checks and reporting
Record every run with date, commit SHA, browser/version, viewport, pass/fail, evidence screenshot, and limitations. Source parse validation and browser validation are different gates.

## Static and privacy
- Validate HTML and JavaScript syntax.
- Verify expected local asset paths from GitHub Pages base path `/family-hub-releases/demo/`.
- Search committed text and assets for secrets, private Firebase implementation, real names, emails, private photographs and calendar data.
- Assert demo does not call Firebase, private APIs or authenticating services.
- Ensure no changes to root landing page or setup routes in v1.1.

## Phone functional smoke
- Five primary navigation tabs
- Agenda/Week/Month switching and event add/edit/cancel
- Countdown creation/editing
- Meals / dishes / saved meal edits
- Grocery list types / add / check / remove
- Daily tasks, points changes and reward redemption
- Child profile switching
- Settings Light/Dark and Coral/Ocean/Meadow/Plum
- Reset returning all demo state to fictional defaults
- Dialog close by intended controls and keyboard where supported

## Responsive and visual
Run Playwright Chromium (and WebKit/Firefox when available) with phone-sized, narrow mobile and desktop embedding viewports. Screenshot each major screen in both appearances. Compare with sanitized authoritative Android references; check clipped text, overflow, safe areas, bottom navigation, tap-target size and keyboard behavior. Do not infer pixel equivalence without images.

## Website and release regression
Before any website merge, independently confirm existing root site layout, four accent themes, Light/Dark controls, setup links, latest approved Android APK link and Wall APK link. Confirm Android `build.yml` / `release.yml` remain unchanged. For v1.1, **do not deploy** or add a production navigation link.

## Current execution status
Repository/documentation checks only. No demo v1.0 artifact was provided in the current mounted files; functional browser tests and screenshots of that artifact remain blocked.


## 2026-10-21 — v1.0 baseline validation attempt
- Original supplied ZIP inspected: four entries (`index.html`, `README.md`, `leo.webp`, `mia.webp`).
- Extracted JavaScript passes `node --check`.
- Actual Playwright Chromium launched, but navigation to both `file://` and `http://127.0.0.1` returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`; therefore **no browser interaction, screenshot, or visual regression test passed**.
- Existing branch demo HTML differs in byte length from the ZIP's authoritative HTML (58,005 characters in indexed copy vs 58,230 bytes in the ZIP). Import parity unverified. The two WEBP assets are also not yet committed.
- `tests/demo-smoke.spec.js` is initial Playwright test scaffolding only; it has not passed a browser run.
- Existing root website files and private release workflow were not changed.

## 2026-10-21 — GitHub-hosted Chromium smoke tests
- GitHub Actions run 39597160044 executed actual Playwright Chromium tests on its runner (not just JavaScript syntax checks).
- Phone navigation / no horizontal page overflow: **PASS**.
- Desktop reset interaction: **PASS**.
- Fictional portrait assets HTTP response: **FAIL**, missing `demo/mia.webp` (404; `demo/leo.webp` also previously observed missing).
- Static checks: **PASS**. Overall workflow remains **FAILED** pending exact portrait import.
- Screenshot-to-native visual fidelity and full interaction suite remain unverified. Do not represent this as production readiness.

## 2026-10-21 — Post-import review
- Authentic HTML and both fictional portraits are present in the feature branch with correct file sizes and matching Git blob hashes.
- Latest Actions run: individual static/asset-integrity and browser test steps completed successfully. Full workflow conclusion was still pending when checked; do not report a completed green run until GitHub finalizes it.
- Local static source review of the original 58,230-byte HTML found no `fetch(`, XMLHttpRequest, localStorage, sessionStorage or runtime Firebase API integration. One occurrence of "Firebase" is a textual disclaimer. The one external URL loads Figtree via Google Fonts. This is a preliminary privacy/source audit, not proof that all artwork and content are publicly cleared.
- Original HTML document title still says `Phone fidelity demo v0.7` despite the ZIP being labeled v1.0. This is a documentation/version-label inconsistency; keep imported bytes unchanged until a separately reviewed correction.
- Attempted local headless Chromium screenshot, but no screenshot was generated. Visual fidelity against native Android references remains **NOT TESTED**.
- Final review needs rendered screenshots at phone viewport (390 × 844), interaction walkthrough, consent/privacy check of fictional portraits, and consistent version labeling.
