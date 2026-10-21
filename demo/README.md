# Family Hub Phone Demo v1.0 — staging

This folder holds the v1.0 phone demo HTML extracted from the user-provided `FamilyHub_Phone_Demo_v1.0.zip`. Its functionality and local sample data are preserved as a standalone development baseline.

**Asset blocker:** the original ZIP also contains `mia.webp` and `leo.webp`, fictional bundled portraits referenced by `index.html`. The binary portrait assets have not yet been committed to GitHub; this branch is not ready for review or publication as a complete replica. Use the original ZIP to test the complete baseline locally.

**Source check:** the demo HTML was transferred from a pre-existing indexed copy of `index.html` (the same size-class, but not byte-identically confirmed against the supplied archive). Before finalizing v1.1 compare it against the archive byte-for-byte, and replace it with the authoritative file if differences exist.

Do not add a link from the live landing page or merge this draft PR until both portrait assets and verified source parity are committed, privacy-reviewed, and browser-tested.

## Offline baseline
Extract the original ZIP, retain both .webp images next to index.html, and serve the directory with `python -m http.server 8000`.

The standalone demo has no Firebase integration. Google Fonts Figtree CSS is externally loaded, with fallback fonts if unavailable.
