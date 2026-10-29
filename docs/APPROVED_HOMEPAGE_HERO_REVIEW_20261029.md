# Family Hub approved homepage hero — implementation handoff

Status: In Progress — review-only; no production edits or deployment.
Date: October 29, 2026
Branch: feature/approved-homepage-hero-review-20261029
Base: main at 8ab4adfc47b78bcc546b2fcacb2c31754297a13b

## Design approval
Latest user-approved four-device, warm-kitchen concept: `a_clean_warm_modern_photoreal_ui_showcase_sce.png`.
Separate previously approved mobile art: `family_hub_a_calmer_home.png`.
These are ChatGPT-generated visuals, **not authenticated production screenshots**. The final render uses user-provided captures as references, but its device screens can be altered and include identifiable household details; sanitize before public distribution.

## Working local candidate
`Family_Hub_Homepage_Review_2026-10-29.zip` was generated in the design chat. It contains:
- `index.html`: standalone, responsive, semantic review prototype, real HTML navigation, hero heading and CTA anchors.
- `assets/desktop-hero.webp`: reduced-size copy of approved final four-device concept.
- `assets/mobile-hero.webp`: approved earlier mobile-specific concept.

Do not treat the local package as a verified production replacement for existing `/index.html`. Existing website landing-page DOM, theme contract `fh_site_theme`, all support/download flows, and privacy links must be preserved while integrating.

## Verification already completed (local only)
- Chromium responsive DOM checks at 1440x900 and 390x844.
- Both viewport-specific imagery loaded successfully.
- No document horizontal overflow or JavaScript page errors.
- Mobile menu opened and `aria-expanded` updated.
- Android and Wall hero CTAs use `download.html?device=android` / `download.html?device=wall` from existing public site.
- Not verified: live APK resolution, production navigation, accessibility screen-reader, physical devices, public deployment.

## Coordination / current overlapping work
- Public website open PR #4: draft email-linked APK analytics; **do not merge/deploy** without security approval.
- Open PR #5: draft onboarding plan; preserve setup journeys.
- No app/Firebase/schema changes authorized here.

## Next safe implementation
1. Transfer sanitized, approved visual assets to `assets/website/` in this review branch and check copyright/privacy/provenance.
2. Port the tested responsive design into existing `index.html` rather than replacing the existing site wholesale; keep dark/light and accent controls, download resolver, links and lower sections.
3. Add focused responsive/CTA/appearance tests, and run existing website smoke tests without Android builds.
4. Prepare a review PR with exact test evidence, screenshots and explicit production-release gate. Do not merge, publish or deploy until separately approved.

Source of truth: Notion website workstream and Atlas coordination page.
