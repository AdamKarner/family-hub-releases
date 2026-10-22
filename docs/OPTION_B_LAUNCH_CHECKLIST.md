# Option B — Launch safety checklist (Spark / no billing)

## Status
Staged in draft PR #4. **Not live.** No Firebase rule change has been published by this PR.

## Analytics scope
- `distributionLeads`: one submitted email per form submission, unverified.
- `distributionClicks`: one event per Android/Wall click associated via random Firestore leadId, `kind`, APK build, and server timestamp.
- Administrator read-only dashboard lists submissions, unique normalized email addresses, download clicks per lead, and build versions.
- Metrics are **click attempts**, not successful APK downloads or installs.
- No Google Analytics tracking ID configured; website visitor counts and acquisition statistics are not yet available.

## Spark abuse risk
**Critical:** Anonymous write rules cannot themselves establish per-IP limits, proof of email ownership, or reliable bot protection. The existing public `distributionLeads` collection already has this limitation. A bad actor could consume shared Firestore free quota and interfere with the family app. The proposed rules for `distributionClicks` constrain shape and require an existing lead, but do not stop repeated writes. A 900ms client navigation fallback improves availability, not anti-abuse.

## App Check sequencing
Firebase App Check is supported on Spark with reCAPTCHA Enterprise, but **Firestore enforcement applies across the database**, not only the new analytics collection. BEFORE enabling enforcement:
1. Create an App Check web app registration for the downloads site using the existing Firebase Web app.
2. Add the public reCAPTCHA Enterprise site key to the web client initialization. Keep secret/admin credentials out of the public repo.
3. Inspect App Check request metrics and test the download page on actual Android/desktop browsers.
4. Audit the native Family Hub Android/Wall clients: they must initialize a valid App Check provider before project-wide Firestore enforcement, or family data access may break.
5. Once all active apps send valid App Check tokens and metrics confirm healthy traffic, consider enforcement. Test unknown clients and roll back enforcement if required.
6. Configure quota monitoring/alerts in Firebase console and keep the Firestore write rules narrow.
App Check is abuse mitigation rather than a hard per-visitor rate limit.

## Production acceptance
- [ ] Main site unchanged before release
- [ ] Visitor submits valid email: a `distributionLeads` doc is created
- [ ] Invalid email fails locally; unauthenticated lead read/update is denied
- [ ] Android/Wall clicks stored with correct leadId and kind (and not raw email)
- [ ] Stale/nonexistent leadId and unexpected kinds denied by Firestore rules
- [ ] Navigation works even when telemetry is rejected or offline
- [ ] Admin password sign-in and admin-only leads/clicks read succeed
- [ ] Ordinary visitor cannot read either collection
- [ ] Actual download and Wall APK links are verified
- [ ] No harmful regression to existing app Firestore reads/writes
- [ ] Basic privacy notice and retention/delete policy documented
- [ ] View usage trends after first day; reevaluate if abuse is detected

## Required manual actions
The user must create the relevant App Check/reCAPTCHA configuration in Firebase. The assistant must not guess a reCAPTCHA site key, alter project-wide App Check enforcement, or publish Firestore rules without a tested plan for the native app.

## Cost
Planned to stay on Spark. Firebase App Check is a no-cost Firebase product; reCAPTCHA Enterprise assessments have separate quotas and may be restricted by plan. Stay within documented free quotas; no billing account upgrade authorized.
