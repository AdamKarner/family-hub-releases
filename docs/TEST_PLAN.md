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
