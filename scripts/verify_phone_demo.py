#!/usr/bin/env python3
"""Validate the exact approved Family Hub phone demo assets in a working tree.

Exit non-zero on missing, edited or substituted files. Does not modify files.
"""
from pathlib import Path
from hashlib import sha256
from import_phone_demo import EXPECTED, ROOT

def main():
    failures = []
    for name, (expected_digest, expected_size) in EXPECTED.items():
        file = ROOT / "demo" / name
        if not file.is_file():
            failures.append(f"MISSING: demo/{name}")
            continue
        raw = file.read_bytes()
        digest = sha256(raw).hexdigest()
        if len(raw) != expected_size or digest != expected_digest:
            failures.append(f"MISMATCH: demo/{name} ({len(raw)} bytes; sha256 {digest})")
        else:
            print(f"PASS demo/{name} ({len(raw)} bytes)")
    if failures:
        print("\n".join(failures))
        raise SystemExit(f"{len(failures)} baseline integrity check(s) failed")
    print("All authoritative v1.0 demo assets match source ZIP bytes.")

if __name__ == "__main__":
    main()
