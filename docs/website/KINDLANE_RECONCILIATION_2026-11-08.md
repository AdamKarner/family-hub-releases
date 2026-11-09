# Kindlane website reconciliation — November 8, 2026

Source-review candidate from main `77448c5f5d651d0a40bdc79219c9c443bcb2f3b8`. Main already contains approved website rebrand #20, domain #24 and homepage tagline #25.

Changes: standardize five support-page footers (`access`, `feedback`, `help`, `install`, `releases`) to “Less chaos. More family.” Rename homepage illustration alt text and diagnostic-page title/back link to Kindlane. Update two old hero alt expectations and add a focused support-copy/browser regression. No artwork bytes, layout, themes, Firebase settings, release lookup logic, APK names/downloads, CNAME, canonical URLs or social previews changed.

Ownership: original website #11/#14 untouched. Read #11 coordination comments and preserve its approved hero/crop. Skylight #21 remains separate. Obsolete interactive demos retain existing scope and are owned by retirement #19; no competing redesign here. Atlas coordinates integration with those PRs. App follow-through is draft [#321](https://github.com/AdamKarner/family-hub/pull/321).

Verification:

- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium ./node_modules/.bin/playwright test tests/website-smoke.spec.js tests/website-a11y.spec.js --reporter=line`: 50/50 PASS, local Chromium, 1.1m. Includes downloaded-asset resolution/fallback, domain/canonical/social metadata, approved hero hash/crop, 360–1440px layout and existing Light/Dark contrast checks. Dependencies match existing CI: Playwright 1.56.1, axe-core 4.14.0.
- First run found two old Family Hub alt-text expectations (48 PASS, 2 FAIL). Corrected the expected product name and reran the full scope above successfully.
- Generated `test-results/help-mobile.png` and `home-desktop.png` manually inspected. Kindlane text and footer readable, hero preserved; this is local browser rendering, not physical-device acceptance or final artwork-fidelity approval.
- `git diff --check`: PASS.
- Independent `curl -I --max-time 15 https://kindlane.app/` blocked at environment proxy CONNECT HTTP403. This is not an origin HTTP response. Public apex/www, Help/download routes and legacy github.io redirect remain unverified.

Remaining: retrieve original Kindlane kit and compare source artwork/social previews against selected references; final tokens/type and legal clearance; real iPhone/Android and Wall checks. Current app Apple touch icon is still a legacy house, and app PWA manifest lacks 192/512 PNG declarations. Owner says they will upload the kit. No substitute logo or website asset was invented. No protected merge, Pages publication, Firebase deployment, release or APK distribution performed. This is not a complete rebrand or production-readiness signoff.

CI follow-through: first Demo browser run 42535805944 failed before tests because ubuntu-latest resolved to Ubuntu26.04, unsupported by pinned Playwright1.56.1. Pin only that browser job to ubuntu-24.04, matching the existing website-checks runner. Demo static checks passed. No test dependencies or runtime assets changed.
