# Onboarding v2 — Roles-aware content and release handoff
Date: 2026-10-26
Status: In Progress — planning, not production functionality
References: [Roles & Permissions draft v0.2](https://app.notion.com/p/405bdde74aee8104b723f2c01d45c88e), [app issue #52](https://github.com/AdamKarner/family-hub/issues/52), website draft PR #5.

## Important current evidence
- Website Onboarding v2 concept at `daef78c` is visually approved and its existing browser/demo workflows passed. Approval is visual only.
- Application authorization role design is **draft**. A recent issue #52 update reports successful isolated emulator tests, but explicitly identifies an unresolved Admin SDK writer-exclusivity counterexample. These tests do not establish production tenant or guardian authorization safety.
- The public website must not say guardian control, child sign-in, people-and-access management, role invitations, or live iPhone shared households are available without separate production verification.

## Intended information hierarchy
1. **Get Family Hub:** Android, iPhone web, Wall Display. Distinguish available published clients from preview-only paths.
2. **Set up your household:** Current manual Firebase process stays first-class until a migration plan is verified.
3. **When managed households launch:** Adult signs in with their own identity; household owner administers membership; guardians separately manage linked dependents; children/teens receive scoped views; walls display household-safe information.
4. **Get help:** invite expired, family not found, incorrect household, offline status, access removed, guardian changes, device pairing and replacement.

## Website-safe draft FAQ wording
**Who can manage our household?** Household owners are proposed to administer membership and invitations. Parent/guardian access to a child is a separate relationship, not implied by ownership. These managed controls are not available on today's public site.

**Can my child use their own device?** Parent-approved, email-free access is being designed. It is not yet offered as a public sign-up or pairing flow.

**Can someone in my family see my personal data?** The planned model distinguishes personal information from shared household information, but its protections must pass server-side security and device tests before we make an operational privacy promise.

**What about a wall display?** Shared screens are intended to show only approved household-safe information, not an adult's private account. Current device setup guidance remains the supported installation route.

**Do themes or device profiles change permissions?** No. Visual theme and device personalization must not confer authorization; server-side roles and policies must enforce it when launched.

**What happens to an existing household?** No silent migration is authorized. The current manual setup remains the supported route until tested account recovery and migration are approved.

## Acceptance gate checklist
- [ ] Product team approves owner vs guardian boundaries, teen/child defaults, custody links, consent and delegation.
- [ ] Backend team resolves the documented privileged-writer/fence counterexample and verifies all privileged writer paths.
- [ ] Versioned additive schema and security rules maintain `members/{uid}.role` and legacy household compatibility.
- [ ] Run adversarial emulator and realistic two-account, child, wall, revoked-access, offline and ownership-transfer tests.
- [ ] Approve public-facing support/privacy copy and data-rights procedures.
- [ ] Verify actual published client URLs/releases and real first-run journeys.
- [ ] Approve separate website merge and publication explicitly.

## Next website-only development
Preserve the visually approved `onboarding-v2-concept.html` baseline. When the policy contract is approved, update the draft concept with distinct adult / guardian / child / wall help entry points and review them for accessibility. Do not add a live role selector or authentication UI to the public website from this document alone.
