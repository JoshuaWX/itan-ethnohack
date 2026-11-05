# Installed skills and selection

The public repository contains **19 project skills** under `.agents/skills/`, installed as
ordinary files for Git portability. Skills are instructions and references, not
installed scientific libraries, clinical validation, or service access.

## Project inventory

| Exact skill identifier | Use when | Source |
| --- | --- | --- |
| `ethnohack-workflow` | Track 4 research-to-engineering decisions and milestone coordination | Custom, this repository |
| `paper-lookup` | Retrieve papers, identifiers, citations, and lawful full text | K-Dense |
| `literature-review` | Plan and document reproducible evidence synthesis | K-Dense |
| `scientific-critical-thinking` | Appraise study design, claims, bias, and applicability | K-Dense |
| `scientific-brainstorming` | Generate and compare research directions without treating hypotheses as facts | K-Dense |
| `scientific-writing` | Report actual evidence and results with traceable sources | K-Dense |
| `database-lookup` | Bounded, auditable queries to authoritative structured databases | K-Dense |
| `clinical-decision-support` | Research-only aggregate/synthetic evaluation and governance artifacts | K-Dense |
| `exploratory-data-analysis` | Authorized local data profiles, missingness, leakage, and quality audits | K-Dense |
| `statistical-analysis` | Analysis plans, assumptions, effect sizes, uncertainty, and inference | K-Dense |
| `scikit-learn` | Classical ML pipelines, preprocessing, tuning, and evaluation | K-Dense |
| `pytorch-lightning` | Neural architecture/training organization, callbacks, logging, and evaluation when justified | K-Dense |
| `transformers` | Tokenizers, inference, and fine-tuning when a transformer is justified | K-Dense |
| `shap` | Audit fitted model feature attributions and their limitations | K-Dense |
| `frontend-design` | Design a UI after a real product brief exists | Anthropic |
| `webapp-testing` | Browser-based verification of an existing web application | Anthropic |
| `vercel-react-best-practices` | React/Next.js performance if that stack is selected | Vercel |
| `mlflow-onboarding` | Set up experiment tracking or GenAI tracing after a concrete use case exists | MLflow |
| `mlflow-evaluation` | Define and evaluate LLM/RAG scorers, datasets, and results using MLflow | MLflow |

All 13 requested scientific identifiers exist. Vercel's folder is
`skills/react-best-practices`, while its declared skill identifier is
`vercel-react-best-practices`. No full skill collection was installed.

## Coverage and deliberate limits

EDA plus scikit-learn cover dataset checks, preprocessing, splits, pipelines,
training, tuning, and evaluation. Lightning/Transformers add conditional deep
learning expertise; SHAP covers attribution. MLflow adds experiment tracking and
GenAI evaluation without installing the MLflow package. For an LLM/RAG design,
start with the architecture and scientific standards, then evaluate retrieval,
citations, abstention, and answer support. No evaluator guarantees hallucination
detection or clinical correctness.

Investigated additions and existing capabilities:

- [NVIDIA skills](https://github.com/NVIDIA/skills), `rag-eval`: deferred; it is
  specifically tied to NVIDIA RAG Blueprint's repository layout and services.
- [Hugging Face skills](https://github.com/huggingface/skills): dataset/trainer/
  evaluator workflows are useful when the Hub or that runtime is selected;
  deferred to avoid overlap and unsolicited model/cloud dependencies.
- [Supabase agent skills](https://github.com/supabase/agent-skills): Postgres
  guidance already exists through the Desktop plugin; defer project installation
  until a relational database is selected. This does not select Supabase.
- [OpenAI skills](https://github.com/openai/skills): existing personal
  `security-best-practices`, `security-threat-model`, `gh-address-comments`,
  `gh-fix-ci`, and Playwright skills cover relevant workflows; no second copies
  were installed. Security review remains scoped to its supported languages.
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) are
  available upstream. The local guideline skill is excluded from distribution.
- Existing `codebase-design`, `diagnosing-bugs`, `tdd`, `code-review`, and
  `resolving-merge-conflicts` provide general engineering support. Desktop's
  Vercel backend/API/deployment skills are available when relevant. They are
  machine/plugin capabilities, not guaranteed in a teammate's checkout.
- Backend/API contracts and database decision criteria are in
  [architecture](ARCHITECTURE.md); framework-specific skills and deployment
  providers can be added after stack selection. No application framework was chosen.

The existing personal `frontend-design` and Desktop React guidance overlap the
requested project copies. Prefer repository copies by exact path when necessary;
do not combine both versions. No new Claude Code tools or hooks were installed.
An unrelated Claude-specific personal skill predated setup and was left untouched.

## How Codex selects skills

Codex discovers skill names/descriptions from the repository's `.agents/skills/`.
It can choose a relevant skill implicitly or the user can request `$skill-name`.
The body and supporting references are loaded when needed. `AGENTS.md` asks for
project context first and the smallest relevant combination; the custom workflow
routes Track 4 tasks to the inventory above. Selection is probabilistic and can
vary by prompt/model. Use `$ethnohack-workflow` explicitly when desired.

Start a new Codex turn/session after installation if its skill selector is stale.
New skills are intended to be available on the next turn. The currently running
setup conversation's initial skill catalog is not itself a refresh check.
See [official skill discovery](https://learn.chatgpt.com/docs/build-skills) and
[AGENTS.md discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

## Runtime dependencies and script review

No PyTorch, Transformers, scikit-learn, SHAP, MLflow, model weights, CUDA, vector
database, or browser binaries were installed. Some may already exist elsewhere;
this setup did not audit every unrelated environment. Install only what a scoped
task needs into an isolated, versioned environment.

Paper lookup, core EDA, and clinical research validators include standard-library
Python tools. Literature export, schematics, scientific numerical analysis,
training, SHAP, and browser testing have optional or task-specific dependencies.
Some search endpoints work anonymously; other services require keys or licenses.
Use direct authoritative retrieval where available and report coverage limits.
Do not interpret a skill's listed library versions as a project dependency lock.

Before executing a third-party helper, inspect its full implementation and any
imported local helpers, then limit input/output paths and network use to the task.
No third-party training, retrieval, export, or server-start script ran during
installation. Static inspection covered file integrity, metadata, script imports,
and sensitive-operation call sites; this is not a comprehensive security audit.
The Anthropic `with_server.py` helper uses `shell=True` and terminates the shell
process; on Windows it can leave child servers running. Prefer native managed
processes or an already running authorized server unless its lifecycle is adapted.

MLflow onboarding links to an optional `mlflow-trace-instrumentation` sibling that
was deliberately not installed. Its traditional ML path is self-contained; for
GenAI trace verification, consult the linked
[official tracing documentation](https://mlflow.org/docs/latest/genai/tracing/)
or review/install the sibling only when needed. Other optional companion skills
mentioned upstream are recommendations, not hidden installed dependencies.

## Sources and reproducibility

Reviewed upstream snapshots:

| Source | Commit |
| --- | --- |
| [K-Dense scientific skills](https://github.com/K-Dense-AI/scientific-agent-skills) | `a25cf9ec00e2745d03f8704acf6f6919694ccd9a` |
| [Anthropic skills](https://github.com/anthropics/skills) | `ca45fc496a3436251f191354091d557da31c15b5` |
| [Vercel agent skills](https://github.com/vercel-labs/agent-skills) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` |
| [MLflow skills](https://github.com/mlflow/skills) | `6a505d8f30b7fbf93533cdf4e7d88fc30d66ba8b` |

`../skills-lock.json` records pinned upstream sources using the Skills CLI schema.
`../.agents/skill-sources.json` records per-file SHA-256 hashes and Git blob
verification, allowing offline integrity checks without relying on the temporary
download cache. Preserve available license files and [notices](THIRD_PARTY_NOTICES.md).
Project files are the team installation; a clone does not need to rerun installers.

Setup used reviewed `skills@1.7.4`, `--skill` selections, `-a codex`, `--copy`, and
project scope. Local verified downloads were used after the remote clone stalled;
temporary paths in the generated lock were replaced with the verified upstream
source, commit, and skill path. No source content was changed.

To list the installed project skills in PowerShell:

```powershell
$env:npm_config_ignore_scripts = 'true'
$env:DISABLE_TELEMETRY = '1'
npx.cmd --yes skills@1.7.4 list -a codex
```

Review updates before installing them. A pinned lock and passing discovery check
do not make a future upstream update trusted automatically.
