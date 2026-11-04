---
name: ethnohack-workflow
description: "Coordinate EthnoHack Track 4 research and engineering: phytotherapy evidence appraisal, data provenance, ML/DL suitability, architecture planning, scientific validation, and hackathon milestones. Use for project-specific research-to-implementation decisions and substantial Track 4 workflows; routine edits and unrelated tasks can proceed directly."
---

# EthnoHack workflow

## Establish the task

Resolve paths below from the repository root. Read `docs/PROJECT_BRIEF.md` and
`docs/PROGRESS.md`; distinguish participant-confirmed context from organizer rules
still marked TBD. For Track 4 requirements, obtain and cite primary organizer
guidance before treating a detail as mandatory. Preserve the undecided idea and
stack until the team selects them.

Classify the requested work, state the intended artifact and completion criteria,
then inspect `.agents/skills/*/SKILL.md` metadata and `docs/SKILLS.md`. Select the
smallest relevant set and read only their applicable instructions/references.
Missing tools, credentials, or specialist expertise are explicit limitations;
do not install dependencies or use a paid service merely because a skill suggests it.

## Route by the actual question

- Literature discovery/synthesis: `paper-lookup` and, for a structured review,
  `literature-review`; appraisal uses `scientific-critical-thinking`.
- Medicinal-plant claims: read `docs/SCIENTIFIC_EVIDENCE.md`; resolve species,
  plant part/preparation, evidence type, safety signals, and uncertainty. Use
  `database-lookup` only for relevant authoritative structured data. Research-only
  evaluation/governance artifacts may use `clinical-decision-support` within its scope.
- Data work: read `docs/DATA_SOURCES.md`; establish permission, provenance,
  coverage, quality, and independent units before `exploratory-data-analysis` or
  `statistical-analysis`. Preserve raw inputs and keep private data out of the vault.
- ML/DL suitability: read `docs/ARCHITECTURE.md`. Compare a non-ML baseline;
  assess target/labels, dataset size/quality, leakage, validation feasibility,
  benefit, compute, and time. Recommend no ML when these do not justify it.
  `scikit-learn`, `pytorch-lightning`, `transformers`, and `shap` are conditional
  expertise, not requirements. Consult the inventory for tracking and RAG evaluation.
- Software architecture/implementation: use `docs/ARCHITECTURE.md` and relevant
  contracts. Select design/testing/security skills for the actual stack and task;
  a skill's preferred framework does not decide the stack. Implement only the
  requested scope and verify the affected behavior.
- Scientific reporting: `scientific-writing` applies after evidence and results
  exist. Brainstorming can use `scientific-brainstorming`; hypotheses stay labeled.
- Milestones: read `docs/DEVELOPMENT_PLAN.md`, distinguish proposed dates from
  official deadlines, and reprioritize for a useful validated demonstration.

## Finish with evidence

Test changed behavior proportionately. Scientific checks must establish claim
support, provenance, uncertainty, and limitations, rather than just code execution.
For ML/RAG, define held-out evaluation and baseline comparisons before optimization;
include unsupported answers and missing-evidence cases per the scientific standards.

Record findings in the appropriate research note, material choices in
`docs/DECISIONS.md`, and observed progress/blockers in `docs/PROGRESS.md`. Report
what was actually verified. The project remains a hackathon research prototype;
apply the clinical and privacy boundaries in the referenced standards throughout.
