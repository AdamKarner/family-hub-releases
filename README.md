# Family Hub — Public Website & Interactive Demo

Public website: https://adamkarner.github.io/family-hub-releases/

This **public** repository hosts the existing approved landing page, setup instructions, and approved APK download presentation. The native Kotlin/Jetpack Compose application and Firebase implementation remain in the **private** `AdamKarner/family-hub` repository.

## Ownership and layout
- `index.html` — approved public landing page (unchanged in v1.1).
- `setup.html` and `setup/` — existing setup experience (unchanged).
- `demo/` — future standalone interactive demo location; import pending the exact v1.0 archive.
- `docs/` — canonical demo specification, inventory, roadmap, changelog and test plan.
- `tests/` — future browser smoke/regression checks.

## Local development
Use a feature branch and PR. After the v1.0 demo is imported, serve the directory with `python -m http.server 8000`; the demo must run without authentication, Firebase, or build services. Keep static asset paths compatible with the GitHub Pages subpath `/family-hub-releases/`.

## Deployment and release boundaries
APK publication is controlled in the private repository by the manually approved `.github/workflows/release.yml` workflow. Website changes must not occur as a side effect of APK releases. Never change the approved landing page, setup pages, or latest Android/Wall APK links as part of a demo-only integration. Merging/publishing requires explicit approval.

## Source of truth
See [specification](docs/DEMO_SPEC.md), [screen inventory](docs/SCREEN_INVENTORY.md), [roadmap](docs/ROADMAP.md), [changelog](docs/CHANGELOG.md), and [test plan](docs/TEST_PLAN.md).

## v1.1 state
Documentation foundation committed on a feature branch. The authoritative v1.0 ZIP is available and hash-verified, but `demo/index.html` on this branch is an older staged copy, and `demo/mia.webp` and `demo/leo.webp` are not yet committed. Run `python scripts/import_phone_demo.py /path/to/FamilyHub_Phone_Demo_v1.0.zip` in a feature-branch checkout, then commit the three files. GitHub Actions has executed real Chromium browser checks: phone navigation/overflow and desktop reset passed, while portrait asset loading failed (404). The public site remains untouched.
