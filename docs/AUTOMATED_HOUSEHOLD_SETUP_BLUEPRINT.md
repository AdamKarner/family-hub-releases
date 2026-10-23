# Family Hub — Automatic Household Setup Blueprint
Status: PROPOSAL / DESIGN ONLY — 2026-10-23
Scope: Website planning and user journey. No provisioning backend, APK integration, authentication endpoint, or cloud deployment is implemented by this document.

## Decision
Recommend one **Family Hub-managed Firebase environment**, with each family isolated by a randomly generated household ID, over automatically creating a separate Google/Firebase project per family. Retain a clearly labeled advanced Bring Your Own Firebase path for existing households and technical users. Do not deprecate the existing manual setup until export, migration and rollback work.

## Plain-language user journey
1. Welcome — "Keep your family in sync", choices "Start a family" and "Join my family". Explain account is needed to protect data.
2. Start — Create account, verify email, choose a household name, accept privacy terms, and create empty household. User owns it; no Google Cloud console required.
3. Join — Open one-use or short-lived invitation via deep link/QR or enter join code; authenticate with individual user account, accept household name and inviter display name, then join.
4. Recovery — A returning user signs in and sees their existing households; lost invitations can be reissued by an owner. Never silently create a second household if the user already belongs to one.
5. Validation — Verify authenticated membership, successful connection, and a known shared item on two devices; distinguish "connected to server" from "data matches".
6. Devices — Wall device pairing uses a separate, short-lived device code approved by a signed-in household owner. Device cannot approve itself.
7. Exit — Manage family members, remove a device, revoke invite, export information, leave household, delete household (owner-only with confirmation).
8. Advanced — Existing manual Firebase setup is retained without promising it can be automatically migrated.

## Architecture concept
- Authentication: individual verified Firebase Auth identities; no sharing one family password.
- Data model: /households/{householdId} metadata; /households/{householdId}/members/{uid} roles; /households/{householdId}/data/... domain-specific records; /users/{uid}/householdRefs/...; /invitations/{randomTokenHash} stored server-side, not raw invitation secrets.
- Role model: owner, adult/member, optional wall-device/service principal with least privileges. Carefully decide what minors can access.
- Provisioning: trusted backend validates a Firebase ID token, applies rate limits and abuse protection, atomically creates household+owner membership, records audit event and returns opaque household ID. Idempotency prevents duplicate households from retries.
- Invitation acceptance: trusted backend validates expiry, one-time use, inviter authority and user identity, uses transaction to add membership, invalidates token; invites don't grant access until server-side acceptance.
- Security: deny-by-default Firestore/Storage rules check membership and action-specific role; rules verified with Firebase Emulator Suite and negative cross-household tests. A shared Firebase project does not itself isolate households.
- Authorization: token signature alone is insufficient; membership must be checked for each household path. Never trust a householdId, role, email or invite supplied by a browser without server verification.
- Operations: monitoring, structured non-sensitive logs, usage quotas, abuse throttling, automatic backups where financially viable, export/deletion handling, incident response, secrets managed server-side, accessibility and email deliverability.
- Existing app caveat: the current Android app uses a legacy family/main data model and Firebase project import; an app/backend migration is REQUIRED for the managed-cloud design and is OUT OF SCOPE for website-only work. Don't offer a functioning Start/Join button until supported end-to-end.

## Security and privacy acceptance gates
- Cross-household read/write denied in emulator and integration tests; membership revocation takes effect promptly.
- Invite expiry, reuse, enumeration, brute-force, session theft and device loss tested.
- Owner transfer, last-owner protection, account recovery and deletion/export documented and tested.
- Data migration uses non-destructive copy, reconciliation and rollback; no unexpected upload from a blank device.
- Child/family privacy and legal disclosures reviewed before public onboarding.
- No service account credentials, OAuth refresh tokens, or privileged access exposed in static GitHub Pages code.
- Accessibility: keyboard navigation, labels, reduced motion, screen-reader status, phone and wide display breakpoints.
- Analytics avoid recording family names, household items, credentials, invite secrets or private calendar events.

## Cost and operating model
- Separate the free quotas from a cost promise: Firestore free allowance is currently 1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB monthly outbound transfer per eligible free database (confirm before launch).
- Under a shared project these quotas are PROJECT-WIDE, not per household. Rate of reads, real-time listeners, offline resync, media/photo storage, backups, server functions, outbound bandwidth, and abuse matter more than household count alone.
- Identity Platform tier-1 authentication pricing currently lists first 50,000 monthly active users free; product and upgrade choices affect pricing. Phone/SMS and premium identity features require separate cost assessment.
- Use budget alerts and capacity simulations before launching. Alerts are not a hard billing cap. Plan for a Blaze/pay-as-you-go environment if server-side provisioning is deployed.
- Example (NOT a bill forecast): 100 households x 4 people, 60 reads per person/day = 24,000 reads/day, under 50,000 free read allowance; a 10x increase or listener amplification changes this materially. Include writes, bandwidth, storage and server costs separately.
Sources: https://cloud.google.com/firestore/pricing ; https://cloud.google.com/identity-platform/pricing ; https://firebase.google.com/docs/projects/billing/firebase-pricing-plans ; https://firebase.google.com/docs/rules

## Phased delivery
P0 (website-only): plain-language guide, accessible static concept preview, current setup preserved, no functioning provisioning.
P1 (backend design): data migration mapping; rules emulator tests; privacy/legal/cost approvals; onboarding API contract.
P2 (restricted pilot): real account/household/invite/pairing flows, role enforcement, support/recovery, QA with two devices.
P3 (opt-in migration): reversible household import with conflict checks, rollout gates and metrics.
P4 (general availability): after security testing, operational readiness, support documentation, validated Wall workflow.

## Success criteria
- New family can create household without seeing Firebase console or downloading configuration files.
- Returning user can join correct household using invitation without creating another.
- Households cannot read/write each other's records.
- Family names/roles and shared data reconcile on two actual devices.
- Existing manual households remain operational throughout migration.
- Privacy disclosures, deletion/export, monitoring and budgets reviewed before public launch.

## Website preview safety
Any prototype page must state "Concept preview — not live"; must not collect emails, credentials, family names, or invite codes; and should not pretend a household was created.
