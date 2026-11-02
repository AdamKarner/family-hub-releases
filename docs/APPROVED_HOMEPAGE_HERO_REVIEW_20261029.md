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

## Update November 2, 2026: approved artwork integrated into index.html
Product Owner approved `privacy_safe_family_hub_dashboard.png` (1672x941): warm kitchen, portrait Wall, desktop, landscape tablet, phone, fictional Riley and Taylor with initials icons. It replaces the earlier rejected set.

Integrated with `scripts/apply-approved-homepage-hero.js` (inline WebP data URIs, so no relative image paths and no `content://` breakage):
- Desktop and tablet (above 680px): full scene, `desktop-hero.webp`, 1672x941, 155,876 bytes, SHA256 `bb27ae35289a938bf5c67372846cb5054d20bbc0056cd973a229da54b82b1011`.
- Phone (680px and below): crop of the same image, left 780px (Wall display and phone), `mobile-hero.webp`, 780x941, 84,884 bytes, SHA256 `ee0a59131a04fdd6e496084c9bdd8dd776b69755a535d78e8975fdad000680ce`. The monitor and tablet are cut off on phones. **This crop has not been approved by the Product Owner.**
- The helper manifest hashes were updated on purpose. The fixture guard is unchanged.
- The artwork is a visual concept. The device screens are not captures of a released build.
