# Website Help Center content refresh — October 28, 2026

**Status:** Review only · Branch `feature/help-center-feature-refresh-20261028` · No public Pages deployment

## Source and release evidence
Current public `latest` release has Android and Wall APK assets for build 90000569 and release notes explicitly describe Take away / Give bonus restrictions, Meal and Calendar tablet updates, and Monday rollover. App `main` at `b028087e` also contains household Google sign-in, invite codes, kid permissions, and moving items between aisles. The site had a searchable Help Center but no FAQ coverage for these new workflows.

## Changes
- Keep current navy theme, downloadable APK links, Notion feedback embed and legacy setup files unchanged.
- On `help.html`, add searchable feature FAQs covering households, invites/kids, week templates, automatic rollover, tablet Calendar, grocery aisle moves, points, appearance, and replaying the native tour.
- Clarify the difference between new in-app household sign-in and the still-needed legacy Firebase setup route.
- Add an Everyday use filter and three discovery tiles; don't change the existing filter/search algorithm.
- Refresh the landing page's feature descriptions and Getting Started copy. Release Center continues to resolve the current approved release dynamically.
- Extend existing Playwright coverage for search/filter and preservation of legacy setup guidance.

## Verify before merge / publication
- [x] Existing help CSS, theme-storage key, search/filter code, download resolution and support-form destination preserved by targeted edits.
- [ ] Run site Playwright tests on preview branch, including 360px mobile overflow and keyboard/FAQ navigation.
- [ ] Review screenshots in Light/Dark and Coral/Ocean/Meadow/Plum on phone/tablet/desktop.
- [ ] Verify actual public build supports the newly described household sign-in path on a safely provisioned test household; do not test migration on household data.
- [ ] Product owner explicitly approves publication to public GitHub Pages.

No changes to APK assets, public release metadata, Firebase, app source or website deployment.
