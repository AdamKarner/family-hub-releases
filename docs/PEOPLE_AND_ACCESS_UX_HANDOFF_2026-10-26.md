# Family Hub — People & Access UX Handoff (Draft)
Date: 2026-10-26
Status: In Progress (design only; no implementation authority)
Owning app authorization: [Roles & Permissions v0.2 draft](https://app.notion.com/p/405bdde74aee8104b723f2c01d45c88e), [issue #52](https://github.com/AdamKarner/family-hub/issues/52)
Related website proposal: [draft PR #5](https://github.com/AdamKarner/family-hub-releases/pull/5)

## Goal
Make it immediately understandable who can do what, without turning family organization into an administrative chore. People & Access belongs to the authenticated application. The public website should teach the distinction and route people to the current supported setup, not attempt any cloud role changes.

## Information architecture
Household settings > People & Access
- **People:** name, household membership status, meaningful scope summary; invitation state where supported. Do not show private calendars, shortcuts or credentials as member-directory fields.
- **A person's access:** show household-admin tier separately from family role and allowed capabilities. Examples: "Household owner · Manages invitations" and "Guardian for Sam · Can manage Sam's approved features." Never imply owner is guardian.
- **Child/teen access:** parent-managed limits for an explicitly linked dependent; guardian approval status and recent meaningful change events. Presets/details remain placeholders pending policy approval.
- **Invitations & membership:** owner-only actions, recipient and household verification, confirmation for removal and sensitive changes; last-owner guard.
- **Shared devices:** separately managed display registration with household-safe projection, not a person's cloud permission.

## Primary screens and behavior
### 1. People overview
Header: "People & access"
Supporting copy: "See who belongs to your household and which access each person has."
Rows show initials/avatar, preferred display name, status (Active, Invited, Pending, Disabled, Access removed), and at most two understandable summaries. Show "Manage" only when actor has server-confirmed permission; others see "View access" if permitted. Hide counts/details for unauthorized viewers rather than relying on disabled controls as a security measure.
Separate linked dependent person profiles from adult signed-in accounts to avoid implying all children have email sign-in.

### 2. Member details
Summary groups:
- Household membership: Owner/Member and current status.
- Family relationship: Adult/Guardian/Teen/Child, where approved and verifiable.
- Access: what is shared, personal and guardian-linked; only reveal entitled resource information.
- Devices: personal devices aren't equivalent to permission; shared-display management stays separate.
For elevated changes require fresh server authorization, explicit effect preview and audit status. Never allow self-promotion or direct client writes to trusted role or guardian-link fields.

### 3. Guardian controls
Entry only for an actor authorized for the selected dependent. Proposed content:
- "You're managing access for [dependent]."
- "Can use" short approved feature groups (calendar, grocery, tasks, Quick Handoff, shortcuts) with plain descriptions.
- Approval requests and permitted recipients.
- "Why can't I change this?" accessible explanation when custody/link or policy prohibits a change.
No claimed functionality before backend policy approval; guardian changes must be independently auditable. Do not expose child personal content to unrelated adults.

### 4. Invite/Remove/Transfer
Invitation: review target household and recipient; initial membership Member, no implied owner/guardian rights; expiring single-use credentials through approved backend.
Removal: summarize what access ends, effect on pending handoffs/device pairing, and what retained private data or offline cache still requires cleanup; offer safe reauthentication and confirmation.
Transfer: guard against last-owner loss, disabled targets, pending changes and duplicate actions. Explicit account recovery path; never promise immediate server enforcement before verified.

### 5. Member/child-facing denial and recovery
Denied: "You don't have access to change this." Include request-help path only for an authorized recipient; never identify an unrelated guardian.
Offline: "Your access couldn't be checked. Reconnect to continue." Don't treat cached permissions as a server grant.
Invitation expired: "This invitation has expired. Ask the household owner for a new one."
Access revoked: "Your household access has changed. Sign in again or contact a household owner." Clear relevant cached protected views according to verified client contract.
Shared wall: "Open Family Hub on an authorized personal device to manage access." Never surface adult secrets.

## Essential UX and accessibility acceptance
- No view or capability leak when switching Classic, Modern, Matte, portrait/tablet, iPhone web or wall profiles.
- 360px mobile and keyboard/screen reader interaction; accessible role summaries without color-only state.
- Explicit loading, denied, expired, disabled, offline, conflict, duplicate, revoked and recovery states.
- No private content flashes before authorization resolves; queries are scoped to household/member permissions.
- Reauthentication, audit and confirmation requirements for security-sensitive changes; idempotent retries.
- No dependence on a local PIN or per-device profile to confer household cloud access.
- Preserve current legacy `family/main` setup until migration is approved, backward compatible and runtime verified.

## Copy and implementation boundary
All screens above are design requirements, not currently implemented features. Avoid publicly advertising granular permissions, child sign-in, guardian management, or cloud pairing before verified app/security support. A website-level Help page may explain that these are planned, using honest availability labels.

## Security dependency / outstanding gate
Issue #52 and the authoritative draft describe extensive isolated tests, including synthetic revocation/index and privileged-writer tests. They do **not** prove exclusive control of all deployed privileged writers; a direct Admin SDK writer can bypass the proposed advisory migration fence. Production writer inventory, rule/schema review, guardian/custody and child policy decisions, tested rollback, real authenticated mobile/web/wall QA and explicit deployment authorization remain mandatory.

## Suggested cross-team handoff
Treat this as UX input to the separate app roles workstream after the owner authorizes implementation. Do not alter the currently active app role branch, merge website PR #5 or create a public preview solely from this document. When implementation is authorized, track precise files, test evidence, screenshots, feature-branch commit and user-visible documentation against the actual delivered capability.
