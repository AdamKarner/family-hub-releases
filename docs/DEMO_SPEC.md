# Family Hub interactive demo — specification

Status: **v1.1 repository integration in progress**. The authoritative v1.0 ZIP has not yet been imported; do not replace it with an earlier prototype.

## Purpose
Provide a highly faithful, local-only browser replica of the native Family Hub Android app, eventually accessible from the public website. Screenshots and screen recordings of the native app are the visual and behavioral references. Fidelity takes precedence over speculative redesign.

## Target devices
- Phone (v1.2 fidelity milestone)
- Portrait wall display (v1.3, reference photos required)
- Landscape tablet (v1.4)
- Combined device selector, consistent local state and transitions (v1.5)

## Core functionality
Home dashboard; Calendar Agenda/Week/Month, event viewing/editing, countdowns; Meals and saved dishes; Grocery lists; Daily tasks/rewards; profiles/points; settings and appearance.

## Visual foundations
Dark navy, Figtree, rounded cards and segmented controls, fixed bottom navigation, person colors, Coral/Ocean/Meadow/Plum, Light/Dark, native-style overlays and editors. Native screenshots override web approximations.

## Privacy and isolation
Only fictional identities, portraits, calendars, rewards, meals, and other household records. No real household identifiers, Firebase credentials/configuration, authenticated endpoints, private source, or live calendar access. Demo runs without account or backend; reset restores fictional initial state. Audit all committed media and text before review.

## Deployment constraint
The demo must not change the approved root `index.html`, `setup.html`, or `setup/`, release assets, APK download URLs, website appearance controls, or Android release automation. Any final link from the landing page requires a separate reviewed approval at v2.0.

## Versioning
Track demo versions independently of Android APK release versions. Use docs/CHANGELOG.md as the cumulative demo log. Do not claim a screen is tested based only on script parsing.
