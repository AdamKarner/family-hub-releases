# Family Hub website — Google-first onboarding documentation handoff

**Status:** Draft / publication-gated. **Date:** 2026-10-28  
**Decision source:** [Notion Google-first onboarding v1.0](https://app.notion.com/p/407bdde74aee818286ffdca49acf5c78)  
**Android candidate:** [PR #109](https://github.com/AdamKarner/family-hub/pull/109), open draft; not a released first-run experience.

## What changes when the matching app build ships

The intended new Family Hub journey is **Install → Welcome → Continue with Google → Create a household or Join with an invite code → Sync this device → My Day/Home**. Families should never be told to create or import their own Firebase project as the standard new-user setup. Firebase still provides backend authentication/data sync, so do not claim Firebase is removed.

**Do not change currently published onboarding instructions before a verified public APK supports this exact journey.** Public `start.html` currently tells visitors to use `Settings → Sync across devices → Household`, which may be correct for the released build. Preserve all current website/legacy functions while preparing the copy update.

## Publication-gated page checklist

| Page/surface | Update after app release |
| --- | --- |
| `start.html` | For new and invited users, start with Google on opening the app; create/join after sign-in; deliberate sync confirmation. Keep returning-member and no-Google alternatives. |
| `install.html` / `download.html` | Align after-install next steps with the new welcome flow without changing APK source/download URLs. |
| `help.html` / FAQs | Searchable FAQs: Google picker cancellation, wrong Google account, create vs join, invite expired, duplicate-household protection, device sync proof, existing shared account migration, children without Google, Wall/no-Google fallback. |
| `setup.html` / `setup/` | Preserve accurate manual Firebase steps under **Legacy / older family login recovery**; remove as recommended new-household path. Do not delete user support assets/screenshots. |
| `privacy.html` | Still disclose Firebase authentication and Firestore data. Review policy wording and deletion/migration references if behavior genuinely changes. |
| Navigation / hero / entry points | Point new users to the current accurate start route, while making legacy support findable and distinct. |

## Suggested public-facing copy (future; not yet published)

**Getting started:** "Open Family Hub and choose **Continue with Google**. Create a household for your family, or join one using the code a family member sent you. Then choose **Sync this device** to connect your information."

**Already have a household?** "Sign in using the Google account you used before. Family Hub should recognize your existing household. Don't create a new household or clear app data to fix a connection problem."

**Older family setup:** "If your family originally used a shared login or imported Firebase project, choose **Using an older family login?** inside Family Hub. Follow the legacy guide only if you know you use that setup. Preserve your existing household data."

**Without Google:** "Some wall devices and pre-provisioned child accounts can use the separate Household email sign-in. This is not a self-service new email account signup. A parent should not sign into a child's device using their unrestricted Google account."

## Release verification and ownership

Before changing live site: PR #109 merged with permission; new exact-head APK publicly available; validated primary sign-in/create/join on Android plus regression for legacy and wall fallback; actual strings/screenshots checked against APK; website copy reviewed; separate site branch/PR accepted and website tests run; explicit site publishing approval. After publication verify pages on phone/desktop and that legacy, accessibility, privacy, download and support links still work.

No code, Firebase, website pages, production assets or published APKs are changed by this documentation-only file.
