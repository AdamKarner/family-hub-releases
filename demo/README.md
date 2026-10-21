# Family Hub phone demo — v1.1 staging

The authoritative source is the supplied `FamilyHub_Phone_Demo_v1.0.zip`. The current `demo/index.html` on this branch is an earlier indexed copy and must **not** be considered source-identical to the ZIP. The two fictional portraits (`mia.webp`, `leo.webp`) are still absent.

## Verified import workflow

On a computer with a checkout of `feature/interactive-demo-v1.1`:

```bash
python scripts/import_phone_demo.py "/path/to/FamilyHub_Phone_Demo_v1.0.zip"
git status --short
git diff --check
git add demo/index.html demo/mia.webp demo/leo.webp
git commit -m "feat(demo): import exact v1.0 source and fictional portraits"
git push origin feature/interactive-demo-v1.1
```

The script verifies the original SHA-256 and byte size of all three files, refuses mismatches, and writes original bytes to `demo/`. Do not use real household data or images. Review the diff before pushing.

After pushing, GitHub Actions should run Playwright and the static privacy/website-protection checks. Do not merge until these checks pass and the visual and privacy audits are reviewed.

## Local preview

From repository root, run `python -m http.server 8765` and visit `http://127.0.0.1:8765/demo/`. The demo uses fictional local state and Google Fonts for Figtree, with system fallback. There is no Firebase connection.
