# Family Hub — Roles-Aware Onboarding Journeys & Acceptance Contract
Date: 2026-10-26
Status: In Progress — design-only specification, NOT active application behavior
Dependencies: Roles & Permissions v0.2 (draft), Family Hub app issue #52, website PR #5

## Scope and principles
The approved Onboarding v2 visual concept remains unchanged. This document describes future authenticated journeys, not public website registration. Keep household membership, guardian relationship, personal user preferences, role/capability grants and device settings separate. No screen alone confers access. Existing manual setup and `family/main` data must be retained until approved, tested migration.

## Journey A — Adult starts a household
Entry: authenticated adult using their own account (future).
1. Verify own identity, establish owner membership in one household.
2. Confirm household name and intended membership. Display distinct “Household owner” and “Parent/guardian” explanations; do not assume the latter.
3. Invite another adult with lowest initial membership privileges. Never grant owner or guardian automatically on invite acceptance.
4. Show confirmation and household identity on My Day without revealing other adults' private content.
States: pending invite, accepted, expired, recipient mismatch, disabled/revoked, wrong household, network/offline, reauthentication needed.
Acceptance: only trusted backend authorizes owner creation; no self-promotion, cross-household access, duplicate acceptance or last-owner deletion.

## Journey B — Adult joins a household
1. Sign in with personal identity and select/verify target household and inviter.
2. Redeem expiring one-use invitation through approved backend; establish basic member only.
3. Explain shared vs private information and current authorization.
4. Show scoped personal start screen.
Acceptance: replay and spoofed invitation are denied, no household data appears pre-acceptance, revoke propagates, offline pending state doesn't imply access.

## Journey C — Guardian manages a dependent
1. Authorized guardian opens People & Access on a personal device, selects a dependent person profile.
2. Establish or review authorized guardian link through a trusted auditable workflow; do not treat owner as guardian by default.
3. Show a small set of understandable access presets, exceptions and recipient approvals once policy is approved.
4. Save only through server validation; show confirmation or actionable rejection.
Acceptance: no guardian self-link, cross-household custody impersonation, private adult disclosure or bypass through theme/device profile; changes audited and revocation takes effect. The proposed guardian policy is not approved.

## Journey D — Child/teen uses own device
1. Parent/guardian starts a child-safe, email-free enrollment process only when formally implemented.
2. Separate existing dependent person profile from authenticated minor principal. Use expiring parent-approved device binding, no adult password reuse.
3. Show age/role-appropriate My Day, Up Next, Assigned to Me and permitted shared information.
4. Denied actions explain next step (e.g., ask guardian), with no unauthorized controls.
Acceptance: approval/revocation, child privacy, device replacement, stolen/lost phone, offline access and data deletion tested. No public child signup advertised before consent and security policy review.

## Journey E — Shared Wall Display
1. Owner/delegated device manager performs pairing from an authenticated personal device.
2. Display obtains separately restricted device identity and approved household-safe projection.
3. Configure displayed agenda, grocery and eligible assigned chores; personal shortcuts and private messages absent.
4. Lost/shared display can be unpaired without revoking adult personal accounts.
Acceptance: no parent token/session reuse; no private event details, secrets or guardian-control surface; PIN/profile/theme switching does not elevate privileges.

## Journey F — Existing family and recovery
1. Existing household keeps manual setup and data until validated migration and informed consent.
2. Recognize legacy person templates and PINs only as device/UI personalization, never authoritative memberships.
3. Support invite expiry, revoked adult, wrong household, dependent transfer, lost device, last-owner recovery, duplicate sync and partial migration without hidden data loss.
Acceptance: explicit reversible migration with rollback plan, consistent Android/iPhone/web/wall authorization and device QA.

## Proposed future screen map (NOT implemented)
- Welcome / Choose device — approved concept, current links only.
- Adult Sign in / Identity — future secured application workflow.
- Start household / Join household / Reconnect — future gated paths.
- Household > People & Access — member status and plain-English access summaries, role-appropriate actions.
- Dependent access — guardian-linked controls and approval history.
- Device enrollment — future parent-approved minor and shared-wall subflows.
- Help / Recovery — targeted guidance for denied, expired, revoked, offline and unknown states.

## Release acceptance matrix
| Gate | Required evidence | Status |
| --- | --- | --- |
| Approved guardian and teen/child default policy | Recorded product, consent, privacy decisions | Outstanding |
| Privileged backend writer coverage | Complete production path inventory and enforceable exclusive migration protocol | Outstanding |
| Server ACL enforcement | Isolated Firebase emulator adversarial tests including actor/target/capability cases | Not production verified |
| Schema/migration | additive backward-compatible members and legacy `family/main` migration & rollback | Outstanding |
| Client behavior | real multi-account Android/iPhone and shared Wall checks, offline/revoke/recovery | Outstanding |
| Website copy | published-path truth table, updated Help/privacy and accessibility review | Outstanding |
| Publishing | explicit separate merge and release approval | Outstanding |

## Current development boundary
Issue #52 documents substantial disconnected emulator and synthetic proof work plus a privileged-writer inventory, but explicitly does **not** establish full production writer coverage or authorize migration. No live role selector, child enrollment, guardian management, or managed signup may be added to public website based on this handoff. The visual concept's approval does not approve its future behavior.
