# Option B analytics — staging verification (2026-10-22)

## Static source checks — PASS (14/14)
Verified directly against branch files:
- Firebase App Check v10.14.1 is imported and uses the reCAPTCHA Enterprise provider.
- The staged config includes an App Check site key and correct Firebase project.
- Token acquisition has a diagnostic success/failure log; not a live browser verification.
- Visitor lead submission has only fields allowed by the existing published rules.
- Click events use leadId, Android/Wall kind, build version, source and server timestamp.
- Build regex accepts build-number APK names.
- Clicks cannot hold navigation indefinitely; a 900ms timeout continues to the APK.
- Administrator email/password flow is retained.
- Administrator-only analytics panel includes totals and per-lead records.
- Click event documents do not repeat visitor email addresses.

## Tests that are NOT complete
- Real browser obtaining a valid Firebase App Check token.
- Creating a click event under proposed Firestore rules.
- Permission-denied tests for unauthenticated reads and forged writes.
- Admin totals displaying live new events.
- Browser/device compatibility and download behavior during network failure.
- Quota/abuse resilience on anonymous public Firestore writes.

## Launch blockers
1. The `distributionClicks` collection is NOT covered by current production Firestore rules. Do not merge until security rules are reviewed, published and tested.
2. App Check registration/monitoring does not enforce anything. Enabling Firestore App Check enforcement now could deny data access to existing Family Hub Android/Wall clients that do not send App Check tokens.
3. Anonymous public Firestore writes do not have reliable per-user or per-IP rate limits. Client-side checks and shape restrictions are not sufficient bot protection.
4. Reporting loads full collections; suitable only for small initial datasets. Add pagination and bounded queries before scale.
5. The current visitor email is unverified. Consent/retention/delete controls should be added before broader public launch.

## Recommended safe next steps
- Keep PR #4 in draft and continue using the current live website.
- Inspect App Check Monitoring traffic for valid requests after initializing SDK on a controlled test page.
- Set up compatible App Check providers in both Android and Wall apps before considering project-wide Firestore enforcement.
- Evaluate an independently rate-limited free-tier ingestion service or a no-PII aggregate tracking method if strong protection is required without enabling database-wide enforcement.
- Perform real end-to-end tests and explicitly approve any production publication.
