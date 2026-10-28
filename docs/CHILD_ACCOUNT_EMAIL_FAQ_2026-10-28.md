# Child account email guidance correction — October 28, 2026

## Scope
Website-only follow-up to public Help/FAQ publishing. Do not change Android/Wall APKs, Firebase Authentication accounts or security rules.

## Why
The published Help Center did not explain how children without Google accounts can sign in. This omission was raised immediately after the website content refresh.

## Verified application behavior
The Android `Households.kt` sign-in UI offers Google authentication and `No Google on this device? Sign in with email`; email sign-in invokes Firebase `signInWithEmailAndPassword` for an account that already exists. Current Android code does not expose an email-password create-account/signup flow. `Invite a kid` creates a one-time child invite; after signing in, a child can join and the household owner can assign their Daily list and permissions.

## Published copy
- New searchable FAQ: `My child doesn't have a Google account. Can I use a made-up email address?`
- Detailed `start.html#kids-without-google` guidance with setup steps, parent-controlled reachable email/alias recommendation and account-recovery warnings.
- Distinguishes technically possible, pre-provisioned Firebase email-password users from a general public self-service signup feature.
- Warns against putting the owner's account on a child-owned device because permissions follow the logged-in member.
- Existing website design, downloads, privacy, legacy Firebase setup and feedback destination remain unchanged.

## Test and release verification
Playwright FAQ search and link-navigation coverage. Check exact candidate CI, Pages deployment and post-merge browser tests before declaring publication complete. No end-to-end kid account sign-in or authorization test was carried out during this website-only edit.
