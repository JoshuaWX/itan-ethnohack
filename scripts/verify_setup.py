"""Offline checks for the documentation/skill setup; no application dependencies."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
REQUIRED_NOTES = (
    "PROJECT_BRIEF", "RESEARCH_FINDINGS", "EXPERT_INTERVIEWS", "DATA_SOURCES",
    "SCIENTIFIC_EVIDENCE", "ARCHITECTURE", "DEVELOPMENT_PLAN", "DECISIONS", "PROGRESS",
)


def main() -> int:
    errors: list[str] = []
    for name in REQUIRED_NOTES:
        path = ROOT / "docs" / f"{name}.md"
        if not path.is_file() or not path.read_text(encoding="utf-8").strip():
            errors.append(f"Missing or empty required note: {name}")

    for path in [ROOT / "README.md", ROOT / "AGENTS.md", *(ROOT / "docs").glob("*.md")]:
        if not path.is_file():
            errors.append(f"Missing documentation: {path.relative_to(ROOT)}")
            continue
        text = re.sub(r"```.*?```", "", path.read_text(encoding="utf-8"), flags=re.S)
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
            target = target.strip("<>").split("#", 1)[0]
            if not target or re.match(r"[a-zA-Z][a-zA-Z0-9+.-]*:", target):
                continue
            if not (path.parent / unquote(target)).exists():
                errors.append(f"Broken link in {path.relative_to(ROOT)}: {target}")

    for path in (ROOT / "docs/.obsidian").glob("*.json"):
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError) as exc:
            errors.append(f"Invalid vault JSON {path.name}: {exc}")

    skills_root = ROOT / ".agents/skills"
    skills = sorted(p for p in skills_root.iterdir() if p.is_dir())
    names: set[str] = set()
    for skill in skills:
        path = skill / "SKILL.md"
        if not path.is_file():
            errors.append(f"Missing SKILL.md: {skill.name}")
            continue
        text = path.read_text(encoding="utf-8")
        header = re.match(r"\A---\r?\n(.*?)\r?\n---", text, re.S)
        name = re.search(r"^name:\s*([a-z0-9-]+)\s*$", header[1], re.M) if header else None
        if not name or name[1] != skill.name or name[1] in names:
            errors.append(f"Missing, mismatched, or duplicate skill name: {skill.name}")
        else:
            names.add(name[1])
        if not header or not re.search(r"^description:\s*\S", header[1], re.M):
            errors.append(f"Missing description: {skill.name}")

    manifest = json.loads((ROOT / ".agents/skill-sources.json").read_text(encoding="utf-8"))
    lock = json.loads((ROOT / "skills-lock.json").read_text(encoding="utf-8"))
    verified_files = 0
    recorded_names: set[str] = set()
    for record in manifest["skills"]:
        name = record["name"]
        recorded_names.add(name)
        folder = skills_root / name
        expected = record["files_sha256"]
        actual = {
            p.relative_to(folder).as_posix()
            for p in folder.rglob("*") if p.is_file() and "__pycache__" not in p.parts
        }
        if actual != set(expected):
            errors.append(f"Unexpected/missing files: {name}")
        for relative, digest in expected.items():
            path = folder / relative
            if not path.resolve().is_relative_to(folder.resolve()) or path.is_symlink():
                errors.append(f"Invalid skill path: {name}/{relative}")
            elif not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != digest:
                errors.append(f"Integrity mismatch: {name}/{relative}")
            else:
                verified_files += 1
        entry = lock.get("skills", {}).get(name, {})
        if (entry.get("source"), entry.get("ref"), entry.get("skillPath")) != (
            record["repository"], record["commit"], record["skill_path"]
        ):
            errors.append(f"Lock provenance mismatch: {name}")
    if names != recorded_names | {"ethnohack-workflow"}:
        errors.append("Installed skill inventory differs from provenance manifest")

    coordinator = (skills_root / "ethnohack-workflow/SKILL.md").read_text(encoding="utf-8")
    for target in re.findall(r"`(docs/[A-Z_]+\.md)`", coordinator):
        if not (ROOT / target).is_file():
            errors.append(f"Broken coordinator reference: {target}")
    if "[TODO:" in coordinator:
        errors.append("Unfinished custom skill scaffold")
    if errors:
        print("Setup verification failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"PASS: {len(REQUIRED_NOTES)} required notes, Markdown links, vault JSON,")
    print(f"{len(skills)} skill manifests, coordinator references, {verified_files} upstream file hashes,")
    print("and pinned source-lock consistency. Runtime/service behavior is outside this offline check.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
