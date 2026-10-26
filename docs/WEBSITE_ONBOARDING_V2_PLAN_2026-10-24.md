# Website Onboarding v2 — design and readiness plan
Date: 2026-10-24
Status: In Progress — planning only, not live
Branch: `feature/website-onboarding-v2-plan-20261024`
Owner: Public Family Hub website
Source: FAMILY_HUB_WEBSITE_SOURCE_OF_TRUTH.md; current public repo; private application workstreams.

## Objective
A visitor understands Family Hub, selects Android, iPhone web, or Wall Display, installs/opens the correct client, and joins the intended household without losing existing data. Preserve approved premium navy and Light/Dark + Coral/Ocean/Meadow/Plum options.

## Release boundaries
- Existing `/setup.html` manual Firebase onboarding and approved Android/Wall APK downloads remain functional.
- The public website does not provision Firebase accounts, modify rules, or collect credentials.
- Do not point to an unpublished iPhone app, promise shared Grocery/Meals sync, or silently migrate legacy households.
- No launch of managed accounts or `/start.html` until security, recovery, cost/privacy, and client integration gates pass.
- PRs #40 and #41 in the private repository cover cross-platform Grocery; #33 covers Android household foundation; modern theme, meal-planner and v359 alignment also run separately. Avoid integration assumptions until their owning branches provide reviewed contracts.

## Proposed visitor journeys
### Android
Discover → Choose Android → approved public release → install guide → existing setup OR future secure sign-in/join option → confirm intended household → first usable screen. Handle blocked sideload, old version, offline and wrong-household recovery.

### iPhone
Discover → Choose iPhone (label as coming soon until actual approved public access) → read supported browser/home-screen guidance → authenticated web client when launched → create/join existing household → verify matching shared data. No APK instructions. Do not advertise Grocery real-time until both sides have passing device tests and approval.

### Wall display
Discover → Choose Wall Display → compatibility check (Hearth vs other Android) → approved Wall APK → install/ADB guide → pairing with existing household using least privilege → first-use confirmation. Keep owner credentials and shared passwords off public guides.

### Returning family
Find Sign in / Reconnect → authenticate on owned client → recover current household membership → do not create a duplicate household → see data after sync. Expired/revoked invitation and device replacement must have explicit recovery guidance.

## Proposed information architecture (design only)
Home: primary product story and three-device selector, with currently available routes labeled truthfully.
Get Started: select Android / iPhone / Wall, then branch by New family / Join family / Already using Family Hub (only once actual account flows are ready).
Downloads: retain release-verified Android/Wall APKs, API failure fallback and direct release links.
Help: install, join, recovery, sync status, permissions, offline and privacy content.
Privacy: provider-managed tenancy, account deletion/export, child/device roles, feedback processor review before launch.

## Copy and capability truth table
| Feature | Public copy now | Launch condition |
|---|---|---|
| Android and Wall downloads | Available via approved GitHub Releases | Published signed public APK asset |
| Manual Firebase setup | Current supported setup method | Preserve for existing users |
| iPhone browser app | In development / not yet public | Approved tested URL and support policy |
| Invitations and membership recovery | Internal cross-platform testing has succeeded | Security, device, acceptance and release approval |
| Shared real-time Grocery | In development | Real iPhone+Android sync, conflict/offline tests and approval |
| Multiweek Meals, Modern and Matte themes | In separate workstreams | Explicit integrated released feature validation |

## Acceptance gates
1. Reviewed account and invite contract from iOS/backend owners, including expiry, revoked access and membership recovery.
2. Android/Wall pairing behavior and permissions approved; no shared family credentials.
3. iPhone/Android Grocery sync verified end-to-end, including offline edits and conflict resolution, before feature marketing.
4. Existing legacy/manual households remain usable and receive explicit, reversible migration choices if migration ever becomes available.
5. Privacy, account deletion/export, recovery, abuse limits and managed-tenancy cost controls reviewed and approved.
6. Desktop and 360px mobile UX, keyboard navigation, screen reader, focus, reduced-motion, theme contrast and device-specific paths tested.
7. Links and release assets verified against actual published versions; no private builds or private credentials.
8. Public launch, production auth/rules, merge and deployment all require explicit approval.

## Deliverables next
- Create a website-only nonfunctional, clearly labeled v2 journey preview on this branch, keeping production pages untouched.
- Review device-selection copy and CTA hierarchy against current site; update Help FAQ drafts.
- Seek owning app-team confirmation of actual launch URLs and household contract before wiring any account route.
- Obtain an explicit website preview/merge approval before publishing.

## Outstanding verification
Public website automated smoke suite succeeded at commit `48d1429` as of last review, but real iPhone onboarding, managed sign-in, offline cross-platform sync, APK installation and feedback submission are not certified by these tests.

## Roles and permissions refresh — 2026-10-26 (design dependency; not launched)
**Authoritative source:** [Roles & Permissions Specification v0.2 (draft)](https://app.notion.com/p/405bdde74aee8104b723f2c01d45c88e) and [app issue #52](https://github.com/AdamKarner/family-hub/issues/52). The current website concept's visual approval remains valid, but it must not be interpreted as approval of new roles, policy defaults or public account activation.

### Verified versus planned
- Existing isolated household foundation provides only basic `owner|member` membership in development PR #33, not deployed child/guardian permissions.
- The new policy design separates membership/admin tier (`owner`, `member`, possible future restricted guest), family role (`guardian`, `adult`, `teen`, `child`), explicit guardian links, per-feature capabilities and dedicated shared-display identity.
- Owner does not equal guardian; an admin is not automatically entitled to private adult calendars, shortcuts or requests. PINs, themes and per-device visible profiles must not grant cloud authorization.
- App issue #52 records 38 passing isolated pure-policy tests, but the actual Firestore emulator security fixture and integration are not yet proven. Client/browser tests must not be described as server-side authorization evidence.

### Required onboarding design extensions
1. **Adult account:** personal authentication, household discovery, owner/member administration separate from family/caregiving status.
2. **Owner:** invite/revoke and household management with protected reauthentication, ownership-transfer and last-owner recovery; no implied universal parental rights.
3. **Guardian:** independently authorized link to a dependent; child account/profile management and safe access limited to linked minors, with an auditable approval/revocation path.
4. **Child or teen:** distinguish dependent person profile from optional parent-approved signed-in account; email-free child-owned device enrollment is a separate proposal (app issue #38/PR #39), not a public website signup feature. No child self-role promotion or self-approval of points/rewards.
5. **Shared wall:** safe limited projection and separate device principal; no parent credentials or private member information on common screens.
6. **Existing household:** grandfathered manual Firebase setup and legacy `family/main` data preserved; no automatic conversion from person templates/Young Child/Pre-Teen/Teenager/Parent or device PIN into an authoritative role.
7. **Failure states:** invitation expired/revoked, guardian change, member disabled, offline access stale, teen capability denied, owner transfer pending, child device unpaired; explain next safe action without exposing sensitive information.

### Website copy guardrails
- Use “household owner” for membership administration and “parent/guardian” only for approved caregiving responsibilities.
- Do not display a permission matrix, claim child accounts are already supported, offer sensitive settings in public pages or turn on a role-selection/signup form yet.
- Once policy is approved and implemented, revise `/help.html`, `/setup.html`, `/privacy.html` and the device-specific getting-started journeys with concrete role-appropriate procedures; preserve the existing manual path.
- Separate the nonfunctional concept from authenticated account/profile screens. Website marketing promises should match tested server authorization, not role labels or UI mockups.

### Approval and verification gates before public role-related claims
- Product acceptance of guardian vs owner boundaries, teen defaults, dependent account/consent and wall-safe data.
- Reviewed additive schema that preserves legacy `members/{uid}.role` and `ownerUid`; actor/target/capability enforcement verified with isolated Firebase rules and adversarial emulator tests.
- Cross-platform adult, dependent, owner-transfer, invitation, revocation, offline and wall-device runtime acceptance, plus privacy/data-deletion disclosures.
- Explicit approval for merge, account activation and public publication. These remain **outstanding** as of 2026-10-26.
