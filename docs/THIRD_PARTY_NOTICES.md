# Third-party skill notices

## Botanical images — 5 November 2026

- Bitter leaf: `Vernonia_amygdalina_plant.jpg`, Zmu'az4Z, CC BY 4.0.
  [Source](https://commons.wikimedia.org/wiki/File:Vernonia_amygdalina_plant.jpg).
- Neem leaves: `Starr_060928-0469_Azadirachta_indica.jpg`, Forest & Kim Starr,
  CC BY 3.0. [Source](https://commons.wikimedia.org/wiki/File:Starr_060928-0469_Azadirachta_indica.jpg).

Both copies were resized to at most 800 pixels and converted to WebP. Source
identifications and licenses were checked, and the images visually inspected.
Independent botanical review is pending. The papaya download was rate-limited,
so its record retains a labeled illustration fallback.

Skill source URLs, exact revisions, and file hashes are recorded in
`../.agents/skill-sources.json` and [skill inventory](SKILLS.md). Upstream content
was copied without local modifications. Retain embedded notices and per-skill
license files when sharing these directories.

- K-Dense scientific skills: root MIT license retained at
  [licenses/K-Dense-LICENSE.md](licenses/K-Dense-LICENSE.md); individual skill
  frontmatter may identify additional terms for referenced software. Instruction
  examples do not grant rights to datasets, papers, APIs, or external software.
- Anthropic `frontend-design` and `webapp-testing`: each installed folder contains
  its upstream `LICENSE.txt` (Apache-2.0). No Claude Code software was installed.
- MLflow skills: Apache-2.0 license retained at
  [licenses/MLflow-LICENSE.txt](licenses/MLflow-LICENSE.txt).
- Vercel `vercel-react-best-practices`: frontmatter declares MIT; the reviewed
  repository snapshot has no standalone license file. `web-design-guidelines`
  has no explicit license declaration in its manifest. These are provenance
  observations, not an invented license grant. Review upstream terms before
  redistributing this skill pack outside the team or republishing its contents.

The Skills CLI was used as a tool; its package and runtime dependencies are not
vendored in this repository. No license for the team's future application has
been selected.
