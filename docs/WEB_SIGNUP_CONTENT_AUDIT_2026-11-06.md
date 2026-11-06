# Public website signup-content audit — November 6, 2026

The public app already supports Google account creation, household creation/invitation redemption and standalone browser setup. Parts of the website still described an Android-first or future web experience. This update corrects those entry paths without changing the app, artwork, theme defaults or native download resolution.

## Findings and repairs

| Page | Outdated or misleading guidance | Updated behavior |
| --- | --- | --- |
| Homepage | iPhone/computer section addressed only existing households; getting-started steps omitted web account creation | Welcomes new, invited and returning families; explains first Google sign-in and household creation; adds Get Started in the web section |
| Household guide | New families and invitees were told to install Android first | Browser-first Create household / Join with a code instructions, with separate Android/Wall and legacy sections |
| Help Center | Signup, invitations, iPhone availability, appearance and retry instructions assumed native app menus | Current browser signup and Settings/sidebar paths; platform-specific native instructions retained with clear scope |
| Installation guide | Intro omitted browser devices; FAQ called the iPhone web app a development effort | Direct browser entry before Android requirements; current iPhone/computer signup and Home Screen guidance |
| Get Started / web guide | Existing browser signup copy lacked the newly published Settings paths | First sign-in explanation and exact current member-management/customization entry points |
| Legacy `setup.html`, `setup/`, `setup-demo.html` | Generic titles and first-device copy sent new families to Firebase Console | Clearly titled Legacy Firebase Setup; new-family Google signup notice at the top; complete legacy steps/screenshots preserved |
| Household setup concept | Described future invite-only pilot signup without noting the live option | Archived concept label and direct link to current signup |
| Download / administration pages | No browser alternative on APK download page; administrator heading resembled a family-account entry | Browser app/Get Started links and clear download-administration heading; existing administrator behavior unchanged |
| Privacy | Local-browser preference coverage predated web Settings | Current person/household preferences and shared display-name changes described; review date updated |

## Current facts used for the copy

- Open https://family-hub-7cb05.web.app/ and choose **Sign in with Google**. First sign-in creates the Family Hub account.
- New families enter a household name and choose **Create household**. Invited family members enter the owner's code and choose **Join with a code**.
- Invitations have eight characters, work once and expire after 24 hours. The owner chooses Adult or Child and controls the child's Daily assignment/permissions.
- A family can set up Daily lists, tasks/rewards, meals, groceries and calendar events using only iPhones/computers. Calendar imports are snapshots, and browser-added events sync between web browsers; native calendar integration keeps its existing path.
- On iPhone use **Home → Settings**; on desktop use **Preferences**. Member management is under Settings on iPhone and the sidebar on desktop.
- Web signup uses Google. Supported Android/Wall email/password login requires a pre-created account and is not a browser signup method.
- Existing custom Firebase installations retain their dedicated legacy instructions; ordinary new-family web signup needs no custom Firebase project.

## Verification

All 52 local Chromium browser checks passed, including WCAG AA text contrast and phone/desktop screenshots. Browser checks cover new-family routing, standalone household setup, Help Center answers, all three legacy guide URLs, archived/admin-page routing, responsive layout and readable signup links. The existing tests continue to verify APK resolution/fallback, selected hero bytes, Light defaults/saved themes, keyboard/touch navigation, screenshots and WCAG AA text contrast.

The legacy image payloads and scripts, selected homepage artwork, download resolution and administration scripts are preserved. CI includes the legacy/admin paths in its filters and uses the standard Ubuntu package mirror after the Azure mirror stalled browser-font downloads during the preceding app rollout.

This is website guidance only. It adds no account system, form collecting family credentials, Firebase configuration, security rules, Android/Wall release or data migration. Protected merge and public publication require separate owner approval under the engineering handoff. Existing design/demo history remains separate from the current user guidance.
