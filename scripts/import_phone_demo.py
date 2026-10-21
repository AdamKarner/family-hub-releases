#!/usr/bin/env python3
"""Import the authoritative v1.0 ZIP into demo/ without altering the landing page.

Usage: python scripts/import_phone_demo.py /path/to/FamilyHub_Phone_Demo_v1.0.zip
Then review the diff and commit on feature/interactive-demo-v1.1.
"""
from pathlib import Path
import hashlib
import sys
import zipfile

EXPECTED = {
    "index.html": ("405670ca67e6c175adfd8bd23f0d6d209df84abe5d35ceead8b6aa17e1a869e5", 58230),
    "mia.webp": ("640ec5b2f90209ef7fbb6d6a1421c6c36b290fddb63037742dba427e55b87106", 16012),
    "leo.webp": ("5e36f9dc91a0e9bffc51fec74ab382a76d0565a1f3eec44558e0b6ea2bbf2e1a", 14402),
}
ROOT = Path(__file__).resolve().parents[1]

def main(archive):
    with zipfile.ZipFile(archive) as zf:
        records = {}
        for name in EXPECTED:
            matches = [p for p in zf.namelist() if p.rsplit("/", 1)[-1] == name and not p.endswith("/")]
            if len(matches) != 1:
                raise ValueError(f"Expected exactly one {name}, found {len(matches)}")
            payload = zf.read(matches[0])
            sha, size = EXPECTED[name]
            if len(payload) != size or hashlib.sha256(payload).hexdigest() != sha:
                raise ValueError(f"{name}: SHA-256 or size differs from approved baseline")
            records[name] = payload
    target = ROOT / "demo"
    target.mkdir(exist_ok=True)
    for name, data in records.items():
        (target / name).write_bytes(data)
        print(f"Verified and wrote demo/{name} ({len(data)} bytes)")
    print("All three byte-identical baseline files imported. Review git diff before committing.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/import_phone_demo.py <original-v1.0.zip>")
    main(sys.argv[1])
