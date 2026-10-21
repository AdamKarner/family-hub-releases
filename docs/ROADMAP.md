# Family Hub demo roadmap

This document tracks **demo** work, not Android APK releases.

## v1.1 — Repository integration (active)
- [x] Inspect public/private repositories and release boundaries
- [x] Create dedicated public-repository development branch
- [x] Establish central docs and screen inventory
- [ ] Replace staged HTML with byte-identical ZIP baseline and commit both portrait assets (original ZIP verified locally)
- [ ] Review and separate demo CSS, JS, data, assets where safe without regressions
- [x] Add initial Playwright smoke test and PR static-check workflow (execution pending)
- [ ] Capture screenshots and complete browser interaction tests
- [ ] Privacy/content review of imported demo
- [x] Draft PR; merge only with explicit approval

## v1.2 — Phone fidelity
Complete screenshot-by-screenshot layout matching and end-to-end behavior for all phone screens.

## v1.3 — Portrait wall display
Build authentic wall-display views from sanitized physical-device references.

## v1.4 — Landscape tablet
Implement genuine native landscape layouts and interactions.

## v1.5 — Complete interactive demo
Device switching, cohesive local simulation, accessibility and polish.

## v2.0 — Public website integration
Separate approved PR to link/demo-host on the public site; verify landing-page design, downloads, themes, mobile layout, and release controls.
