# Onboarding v2 — Visual QA Review
Date: 2026-10-24
Status: Needs Verification (visual refinements recommended)
PR: https://github.com/AdamKarner/family-hub-releases/pull/5
Screenshot source: Public website checks workflow run 40130722441, artifact `website-browser-qa-evidence`, files `onboarding-v2-390.png` and `onboarding-v2-1440.png`.

## Verified
- Public website checks and Demo checks for commit `1790c42` both succeeded.
- Inspected rendered full-page 390px mobile and 1440px desktop captures.
- Three device cards fit in a row on desktop and stack on mobile. No obvious horizontal clipping in these captures.
- The concept is unambiguously labeled nonfunctional and retains a current setup guide link.
- iPhone remains explicitly in development; no credentials can be entered on this concept.

## Visual findings
1. **P1: Planning disclaimer dominates mobile first view.** On the 390px capture it occupies a large block directly after the wordmark. For a user-facing future journey, retain an unmistakable nonfunctional marker in review versions; replace this with genuine, concise release-state guidance only after launch approval.
2. **P2: Device cards look interchangeable.** Add carefully differentiated but theme-consistent device symbols/illustrations, consistent CTA placement, and priority contrast without generating generic dashboard cards.
3. **P2: Current and future journeys compete.** The lower panel offers conceptual Start/Join/Reconnect steps below live download CTAs, increasing cognitive load. Separate planning-only future-flow documentation from actual Get Started steps on eventual public page.
4. **P3: Desktop has generous unused width below the three cards.** A focused contextual FAQ or clear current-path setup prompt could use space better, but do not add unnecessary widgets.
5. **P3: Copy uses both “household” and “family” for related concepts.** Establish voice/copy consistency with the app's approved account contract.
6. **Missing evidence:** No automated contrast audit, screen reader assessment, actual browser sign-in, real iPhone access, account invitation, APK installation or Notion submission has been performed by this screenshot run.

## Next safe design iteration
- Maintain the existing reviewed concept as baseline; prepare a separate branch-only refinement with polished device selector hierarchy and clearer current-vs-future status before requesting visual approval.
- Derive final Start / Join / Reconnect language from the owning app/backend PRs rather than treating this concept as an API specification.
- Do not merge or publish public registration, iPhone access, or new shared-data claims without the required gates.
