# Managed Households — Pilot Execution Plan
Date: 2026-10-23
Status: DESIGN APPROVED FOR PLANNING; IMPLEMENTATION NOT STARTED
Repository boundary: public website documentation only. APK, backend, Firebase and production deployment require a separate implementation workstream.

## Objective
Run an opt-in internal pilot with 10 households, expandable to a maximum of 25 only after the gates below pass. Existing independently configured households continue to work with their own project. No silent migration, no changes to existing cloud data.

## Product decisions to approve in app/backend workstream
- Proposed model: one Family Hub Firebase project; isolated /households/{id} records; individual verified identities; owner invitation controls; least-privilege wall device pairing.
- Pilot is invite-only. Signup cannot be opened to the public before authorization and cost controls are tested.
- New users see Start a family / Join my family. Returning users see their existing household; do not default to creating another.
- First owner can invite and revoke members, replace devices, export and delete household data.
- No family email/password sharing and no download of google-services.json for managed households.
- Privacy policy and support procedures must accurately reflect the provider-operated service before launch.

## Gates
G0 — Architecture review: API contract; membership roles; data model; threat model; migration design; user flows. Deliverable: approved implementation PRD.
G1 — Security: deny-by-default rules; cross-household access tests; invitations expire and are one use; idempotent creation; rate limiting; verification of role changes; device pairing approval; administrative credentials only server-side.
G2 — Reliability: two-device synchronization and offline reconciliation; backups/restore test; no unintended upload from blank devices; rollback & support escalation.
G3 — Privacy & operations: deletion/export handling, incident reporting, consent/disclosure, abuse protection, authenticated account recovery and owner transfer.
G4 — Cost: billing plan choice, monitoring, budget alerts, quotas for photos and requests, staged enrollment ceiling; no assumption alerts stop spend.
G5 — Pilot usability: 10 invited households, success metrics and support routing. Only expand to 25 if no critical access-control bugs or unexplained billing spikes.

## Cost baseline
Four devices observed ~1,600 reads/day, ~227 writes/day; this is one household only and may not represent other usage. At 25 equivalent households: 40,000 reads and 5,675 writes per day, before listener amplification or provisioning overhead. At 30 equivalent households: 48,000 reads/day. Standard Firestore free operation allowances are 50,000 reads/day and 20,000 writes/day for the eligible free database; confirm geography, SKU and current billing before deployment.
Estimate reads/writes separately from photo storage, storage transfer, server compute, auth, backups and monitoring. Never represent a model-only total as a guaranteed monthly bill.
Budget policy for pilot: define a team-approved monthly cap *target* and operational shutdown/disable-registration procedure; billing alerts alone are not a hard cap.

## Pilot analytics: privacy-preserving
Measure account creation completion; invitation redemption; pairing completion; first sync confirmation; successful support resolution; reads/writes per active household; median listener counts; storage/bandwidth per household. Avoid storing family content in telemetry. Establish baseline before adding users.

## Website deliverables
- Existing /setup.html remains the current functioning setup path.
- /household-setup-concept.html is an interactive *non-functional* preview only, never solicits credentials or claims real registration.
- Help Center may link to current setup and explain that managed households are not live.
- A future public /start.html route must remain disabled until G1–G4 are independently approved and the app supports the API.
- No public email collection/waitlist by default; use existing Notion support only if users independently request pilot information.

## Owner validation checklist before launch
[ ] Service owner and data controller named
[ ] Rules and cross-tenant emulator tests green
[ ] Auth, invite, device pairing and revocation proven end-to-end
[ ] Privacy, deletion, export, child data review complete
[ ] Billing project, usage dashboards, throttles, abuse guardrails configured
[ ] Backup & restore rehearsal complete
[ ] Pilot Android and Wall acceptance tests complete
[ ] Ten pilot households provisioned only after above approvals

## Technical handoff
Implement in the private application/backend repository by its owning development chat. Do not reuse legacy /family/main as a multi-tenant storage location. Do not point existing app builds to a shared production project until the tenancy rules and migration strategy pass security review.
