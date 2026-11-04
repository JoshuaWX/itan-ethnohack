# Setup and verification

Verified on 2026-11-02. Windows 11 Pro; Node.js 24.19.0, npm 11.17.0,
Git 2.55.0, Python 3.13.0, Codex CLI 0.166.0, and Obsidian 1.13.7 were
already installed. Codex CLI reported a ChatGPT login and its version matched
the npm stable version checked during setup. No reinstall was needed.
WebStorm was not detected in PATH, standard uninstall entries, or searched
standard locations; a portable installation elsewhere was not ruled out.

## Open the project

Open `C:\dev-folder\Ethnohack` in WebStorm. In its PowerShell terminal run:

```powershell
Set-Location 'C:\dev-folder\Ethnohack'
codex.cmd
```

In Obsidian, choose **Open folder as vault**, then select
`C:\dev-folder\Ethnohack\docs`. The Markdown notes and vault settings are
prepared; the user confirmed opening the vault in Obsidian.
Local workspace state and community plugins are ignored by Git; notes and the
two shared core settings are preserved. No community plugins were installed.

## Verified

- A local Git repository was initialized on `main`; no commit or remote exists.
- `skills@1.7.4 list -a codex` listed the project skills. Codex app-server
  `skills/list` returned all 20 project skills as enabled and no discovery errors.
- The custom skill passed the built-in skill creator's structural validator.
- A fresh CLI session reported the root `AGENTS.md` instruction in its initial
  context. A context-supplied test of five hypothetical tasks produced appropriate
  routes for evidence, ML suitability, RAG evaluation, a routine edit, and a
  patient-specific dosing request. This tests reasoning with supplied text, not
  automatic loading in every future session.
- Third-party skill files were checked against upstream Git blob hashes and a
  SHA-256 manifest was recorded. Run `py -3 scripts/verify_setup.py` for offline
  documentation, inventory, reference, and file-integrity checks.
- The isolated CLI test's read-only PowerShell commands were rejected by execution
  policy. The test did not establish end-to-end shell access within that particular
  sandbox. The policy was not weakened; check ordinary interactive CLI operation
  in your terminal if needed. The user subsequently confirmed that an interactive
  CLI session ran `git status --short`, with a warning about access to the global
  Git ignore file. A separate status command from the setup session did not show
  that warning; the precise cause of the difference remains unverified.

The initial remote Skills CLI clone stalled; installation succeeded from
individually downloaded, verified upstream files. Skills directory searches
returned results but encountered a Windows/Node assertion on exit; the project
`skills list` command subsequently succeeded. See [skills](SKILLS.md) for all
installed identifiers, provenance, optional dependencies, and deferred additions.

Organizer requirements, project idea, stack, data, and project-specific validation
remain TBD. No application, trained model, clinical validation, or deployment was
created. Consult [progress](PROGRESS.md) and [scientific standards](SCIENTIFIC_EVIDENCE.md).
