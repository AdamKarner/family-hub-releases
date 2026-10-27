# People & Access — Cross-Workstream Integration Readiness
Date: 2026-10-26
Status: Needs Verification — implementation integration blocked on policy/security approval

## Scope boundaries
This handoff connects the approved **visual** Website Onboarding v2 draft to the application's future People & Access work. The website branch must not implement cloud account authorization, alter Android/iPhone interfaces, or expose unfinished registration features. The roles specification, not this document, is the authority on permission policy.

## Tracked references
- App issue #52: https://github.com/AdamKarner/family-hub/issues/52
- Draft roles specification v0.2: https://app.notion.com/p/405bdde74aee8104b723f2c01d45c88e
- Website draft PR #5: https://github.com/AdamKarner/family-hub-releases/pull/5
- Previous UX handoff: docs/PEOPLE_AND_ACCESS_UX_HANDOFF_2026-10-26.md
- Six onboarding journeys: docs/ONBOARDING_V2_ROLE_AWARE_JOURNEYS_2026-10-26.md

## Owner/dependency map
| Subject | Authority / implementing stream | Website deliverable | Gate |
| --- | --- | --- | --- |
| Owner/member identity | App household / roles workstream | Setup and invitation explanations | Versioned membership schema, security validation |
| Guardian to dependent | App roles and guardian security | Plain-language guardian guidance | Approved links/custody, test-backed authorization |
| Teen/child account | Child-device enrollment workstream | Future availability and consent copy | Approved consent, parent enrollment, revocation |
| Shared display | App device/roles workstream | Wall setup help | Separate principal, privacy projection QA |
| Revocation / removed member | App membership workstream | Recovery and access-removed help | Server checks, stale index and offline session QA |
| Existing manual setup | Current public releases and app | Preserve working setup | Explicit compatible migration/rollback approval |
| Published site | Website repository | Reviewed onboarding and Help content | Visual, copy, release and merge approval |

## Critical implementation dependencies
1. Confirm v0.2 policy decisions (owner/guardian, family-role assignment, adult privacy, teen/child defaults, delegated admin operations and final-owner recovery).
2. Create an additive, independently reviewed authoritative schema and safe migration/rollback plan. Device person templates, PINs and legacy family records cannot silently become identity roles.
3. Verify and control **all** privileged backend writers; an uncoordinated Admin SDK writer can bypass the advisory migration fence even while synthetic cooperating-writer tests pass.
4. Test real membership status, index invalidation, invitation replay/revocation, guardian-link validation, cache invalidation and cross-platform device permissions.
5. Translate approved behavior to application UI and truthful public Help/Privacy copy, retaining the manual Firebase setup until migrated safely.
6. Obtain separate authorization for merge, Firebase changes and public publishing.

## Acceptance evidence required before closing this handoff
- Versioned policy decision record with owner/guardian/child consent defaults.
- Named implementation owners and dependency sequence for Android, iPhone/web, backend and Wall.
- Emulator test logs for composed rules and migrations, plus proof that external privileged writers are covered.
- Real-device/account test matrix with revoked/offline/duplicate actions and privacy checks.
- Reviewed screenshots and accessible wording across supported styles and form factors.
- Live website truth-table review and explicit release authorization.

## Current disposition
Website UX handoff can guide planning now. App implementation, role settings, managed registration, and public launch remain **Needs Verification**. No change to live website, existing household data, production Firebase or public releases is authorized by this document.
