# Kindlane custom-domain cutover — review-only runbook

**Prepared:** 2026-11-07 CT  
**Status:** DRAFT — source-only. Do not merge/publish or change DNS without separate Product Owner approval.

## Current deployment and ownership
- Product Owner reports owning `kindlane.app` and `adavertechnologies.com`, purchased from Atom; ownership was not independently validated against registrar records.
- Current public informational website is `https://adamkarner.github.io/family-hub-releases/` from `AdamKarner/family-hub-releases`. Current authenticated browser app is `https://family-hub-7cb05.web.app/` and is **not** being moved by this change.
- This draft branch builds on the merged Kindlane site-branding PR #20 only. The Skylight guide remains an independent draft PR #21 and is **not** included. Existing pages, public download logic and relative links are preserved.
- GitHub Pages publishing mode (branch vs Actions) and registrar DNS hosting must be verified in the respective account settings before launch. A `CNAME` file applies to branch publishing; for custom Actions publishing, GitHub Pages custom-domain setting is authoritative.

## Pre-cutover verification and authorization
1. Confirm domain ownership in Atom and inspect active DNS host/nameservers. Check for existing records, mail forwarding, DNSSEC, redirects and any other live services; do not overwrite them blindly.
2. In the GitHub account that owns `AdamKarner/family-hub-releases`, go to **Settings → Pages → Verified domains**. Add `kindlane.app`. GitHub provides the exact unique DNS **TXT** challenge; copy its generated name and value into the DNS host. **Do not invent this token.** Verify with GitHub and retain TXT record.
3. Confirm current GitHub Pages build/source configuration and evaluate deployed URLs and public redirects for existing guides, `/download.html`, `/releases.html`, APK links and mobile browsers.
4. Review this draft PR and its exact-head CI; obtain explicit Product Owner approval for protected merge, Pages settings and live DNS changes. Trademark/legal brand clearance remains separate and unresolved.

## Approved cutover sequence — DO NOT EXECUTE UNTIL AUTHORIZED
1. In GitHub repository **Settings → Pages**, configure custom domain **`kindlane.app`** (for branch publishing, GitHub may create/update a root `CNAME` file). Confirm this repository alone owns the custom domain.
2. In the authoritative DNS host, remove only conflicting default **apex** A/AAAA/ALIAS/ANAME records after confirming they're unused, then configure four GitHub Pages apex **A** records for host `@`:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Optional but recommended: `www` **CNAME** → `adamkarner.github.io` (no repo path, no scheme). Do not use wildcard DNS. GitHub should redirect `www.kindlane.app` to the configured apex.
4. Once GitHub domain is verified and HTTPS certificate is active, enable **Enforce HTTPS** and test `https://kindlane.app/`, all guides, help search, downloads, feedback/privacy, mobile/desktop widths and old `github.io` URLs. **.app domains require working HTTPS in modern browsers.**
5. Verify `<link rel="canonical">`, `og:url`, `og:image` and `twitter:image` all point to `kindlane.app`. External Firebase app URLs, GitHub release APIs and package identifiers stay unchanged.
6. Record GitHub Pages setting, registrar screenshot/DNS records, HTTPS status, final exact commit SHA, CI results and end-to-end URL checks in the Family Hub tracker.

## Rollback and separation
- If TLS, content, downloads or redirects fail, stop promotion and restore the last verified Pages custom-domain and DNS configuration using recorded pre-cutover values; observe DNS/certificate propagation and test both URL entry points.
- `adavertechnologies.com` is **not** an alias of Kindlane. It needs its own proposed website and separate hosting target; do not point it to the Kindlane Pages repository. Corporate public branding and trademark clearance are outstanding.

## Official references
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
