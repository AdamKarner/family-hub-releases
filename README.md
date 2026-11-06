# Family Hub — Public Website & Interactive Demo

Public website: https://adamkarner.github.io/family-hub-releases/

This **public** repository hosts the existing approved landing page, setup instructions, and approved APK download presentation. The native Kotlin/Jetpack Compose application and Firebase implementation remain in the **private** `AdamKarner/family-hub` repository.

## Ownership and layout
- `index.html` — public landing page with Sign In and Get Started.
- `get-started.html`, `start.html`, `web.html` — current Google signup, household creation/joining and iPhone/computer setup.
- `setup.html`, `setup/`, `setup-demo.html` — retained legacy custom Firebase guides, with links to current web signup.
- `demo/` — future standalone interactive demo location; import pending the exact v1.0 archive.
- `docs/` — canonical demo specification, inventory, roadmap, changelog and test plan.
- `tests/` — browser smoke, accessibility, screenshot and onboarding regression checks.

## Local development
Use a feature branch and PR. Serve the directory with `python -m http.server 8000`. Keep static asset paths compatible with the GitHub Pages subpath `/family-hub-releases/`. The public site and fictional demo run without family authentication; Sign In/Get Started route to the live Family Hub web app. Browser checks run through `.github/workflows/website-checks.yml`.

## Deployment and release boundaries
APK publication is controlled in the private repository by the manually approved `.github/workflows/release.yml` workflow. Website changes must not occur as a side effect of APK releases. Never change the approved landing page, setup pages, or latest Android/Wall APK links as part of a demo-only integration. Merging/publishing requires explicit approval.

## Source of truth
See [specification](docs/DEMO_SPEC.md), [screen inventory](docs/SCREEN_INVENTORY.md), [roadmap](docs/ROADMAP.md), [changelog](docs/CHANGELOG.md), and [test plan](docs/TEST_PLAN.md).

## Archived v1.1 handoff

The following records the earlier demo handoff; current public onboarding is described below.
Documentation foundation committed on a feature branch. The authoritative v1.0 ZIP is available and hash-verified, but `demo/index.html` on this branch is an older staged copy, and `demo/mia.webp` and `demo/leo.webp` are not yet committed. Run `python scripts/import_phone_demo.py /path/to/FamilyHub_Phone_Demo_v1.0.zip` in a feature-branch checkout, then commit the three files. GitHub Actions has executed real Chromium browser checks: phone navigation/overflow and desktop reset passed, while portrait asset loading failed (404). The public site remains untouched.

## Current onboarding

Families can start with only iPhones and computers at https://family-hub-7cb05.web.app/ . Choose Sign in with Google; the first sign-in creates the account. Create one household or join with an owner invitation. The browser app supports standalone Daily, meals, grocery and calendar setup, with personal Settings on phone and Preferences on desktop. The public website routes into the app and does not collect family credentials. Legacy Firebase and supported Android/Wall email-password instructions are explicitly scoped to those older/native setups.
