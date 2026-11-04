# EthnoHack 2026 — Submission Requirements & Production Checklist

**Source of truth:** Official EthnoHack Devpost overview and rules, EthnoHack opening-ceremony slides, and the submission form copied by the team.  
**Deadline:** Sunday 8 November 2026 at **10:00 CET = 10:00 WAT (Nigeria)**. **Target:** finish submission by 7 November.  
**Team:** 2–5 members. Identify all on Devpost.  
**Track:** State the selected primary track (e.g. Track 4: Digital Health & Phytotherapy) and explain any cross-track methodology.

## 1. Compulsory deliverables

- [ ] **Devpost project page:** project name, track, tagline, problem, solution, technologies, dataset sources, results/demo, team members, impact and future development.
- [ ] **Public GitHub repository (or equivalent):** runnable source code, data-processing scripts, model/notebooks where applicable, README, install and reproduction instructions, dataset sources/permissions/licences.
- [ ] **Pitch/demo video:** accessible link; **10 minutes maximum**; problem, motivation, methodology, technologies, data, results, actual product demonstration, impact, future development.
- [ ] **Slide presentation:** **10 slides maximum**; clearly show problem, method, data, results, working demonstration and potential impact. Upload using appropriate Devpost file field and verify accessibility.

## 2. Devpost form fields and limits (copied from team member's live form)

| Field | Constraint | Status |
|---|---|---|
| Project name | Required; <=60 characters | [ ] |
| Elevator pitch | Required; <=200 characters | [ ] |
| About the project | Required; explanation of inspiration, what was learned, how built, obstacles encountered | [ ] |
| Built with | Required; <=25 tags | [ ] |
| Try it out links | GitHub and (if available) functional deployment / additional links | [ ] |
| Image gallery | Optional; <=15 JPG/PNG/GIF images; <=5 MB each; 3:2 ratio suggested | [ ] |
| Video demo link | Required; linked video accessible to judges | [ ] |
| Upload a file | Marked required in user's form; <=35 MB; use for slide deck PDF/PPTX and verify accepted upload | [ ] |
| Team members & track | Include all members and track even if captured in a different form section | [ ] |

The organisers' rule makes the slide deck compulsory. The copied upload field is marked required, but whether it is specifically designated for slides should be confirmed with event organisers if unclear. Do not assume supplementary ZIP substitutes for required public video or code links.

## 3. Suggested structure for the Devpost 'About the project' field

1. **Project summary and inspiration:** What motivated this work? Why now?
2. **Problem:** Who is affected; what happens today; credible citations supporting the need.
3. **Existing solutions / gap:** What exists; the specific unmet need addressed; avoid unsupported novelty claims.
4. **Solution / prototype:** What the system demonstrably does, not merely the future vision.
5. **Data sources:** Dataset identifiers, provenance, dates accessed, licences, access limitations, and known bias.
6. **Methods / technical architecture:** Data flow, algorithms, AI/model usage, processing, safety controls, major design decisions.
7. **Implementation:** Stack, integration, development process and individual contributions.
8. **Validation / results:** Real tests, sample sizes, chosen metrics, baseline or manual checks, failures, and reproducible outputs.
9. **Challenges and lessons learned:** Actual difficulties, mitigations, insights.
10. **Limitations and safety:** Uncertainty, incomplete evidence, absence of clinical validation, privacy and ethical concerns.
11. **Impact and next steps:** Intended users, feasible impact, remaining development and research.
12. **Team, acknowledgements, citations and links.**

## 4. Repository deliverables

### Officially required
- [ ] Runnable code and clear entrypoints.
- [ ] README explaining project, track, problem, solution, demonstration, stack, install, configuration, run and test commands.
- [ ] Processing scripts and model/notebook code where relevant.
- [ ] Dataset and external-resource credits, licences and terms.
- [ ] Reproducibility instructions for any claimed results, where reasonably possible.

### Strongly recommended supporting documents (individual files are not specifically required)
- [ ] `docs/DEVPOST_SUBMISSION.md` — submission text, keeping draft and final versions traceable.
- [ ] `docs/PROBLEM_AND_RESEARCH.md` — problem, scope, existing solutions, evidence links, literature notes.
- [ ] `docs/DATA_SOURCES.md` — names, URLs, licence, provenance, relevant tables/fields, handling of missing data.
- [ ] `docs/METHODOLOGY.md` — data pipeline, architecture, assumptions, algorithm/method explanations.
- [ ] `docs/EVALUATION.md` — actual benchmarks/tests/metrics, figures, known limitations. Clearly label planned vs completed.
- [ ] `docs/LIMITATIONS_AND_SAFETY.md` — medical uncertainty, disclaimer, data quality, safety guardrails, privacy and user risk.
- [ ] `docs/ATTRIBUTIONS_AND_AI_USE.md` — dependencies, external data, pre-existing work and substantial AI tool usage.
- [ ] `docs/TEAM_AND_CONTRIBUTIONS.md` — approved names/roles and contributions; never invent.
- [ ] `docs/VIDEO_SCRIPT_AND_SHOT_LIST.md` — 10-minute max demo storyboard with time allocations.
- [ ] `docs/SLIDE_OUTLINE.md` — <=10 slide outline with true figures/screen captures and references.
- [ ] `docs/SUBMISSION_STATUS.md` — checklist with owners, blockers, links and last-verified status.
- [ ] `media/screenshots/` — authentic screenshots, no mocked results presented as actual.
- [ ] `slides/` — editable deck and export PDF, if available.
- [ ] `results/` — reproducible metrics/outputs; do not invent data.

Avoid document sprawl: consolidate related files as appropriate. The goal is a credible, testable, clearly explained prototype.

## 5. Video and slides plan

### Pitch video (up to 10 min)
- Opening / problem / motivation.
- Research gap and evidence.
- Dataset sources / methodological choices.
- Architecture and implementation.
- **Live or recorded working demonstration.**
- **Actual, verifiable results** and validation.
- Limitations / uncertainty / safeguards.
- Impact, future development and acknowledgements.

### Suggested slide sequence (at most 10)
1. Project name, track and one-sentence value proposition.
2. Problem, affected users and quantified evidence where available.
3. Prior work and the specific gap.
4. Data sources, provenance and limitations.
5. Methodology / computational approach.
6. Technical architecture.
7. Prototype demonstration with a genuine screenshot.
8. Evaluation methods and actual results.
9. Safety, limitations, scalability / impact.
10. Team, conclusions and future work.

The slide structure is a recommendation, not an official template.

## 6. Compliance and research integrity

- [ ] Do not present traditional use, a model prediction, association or a lab result as established clinical effectiveness.
- [ ] Avoid treatment prescriptions and unsafe herb–drug recommendations; clearly identify non-clinical prototype status.
- [ ] Distinguish medicinal **product registration**, **seller licensing**, and claims about safety or efficacy.
- [ ] Clearly label mock/synthetic data and simulated integrations. Never claim real-time or official verification unless it actually works.
- [ ] Track every external dataset/API/library/model with attribution and the applicable licence/usage terms.
- [ ] Disclose significant generative AI/AI-assisted work and pre-existing project components.
- [ ] Respect personal data, Indigenous/traditional knowledge provenance, cultural context and access restrictions.
- [ ] Keep scientific references traceable to individual claims.
- [ ] Report uncertainty, missing data, small sample sizes and false positives/negatives where relevant.
- [ ] Do not manufacture performance metrics, reviewer quotes, team roles, deployments, paper references or test outcomes.

## 7. Parallel production workflow

**Continuously while building:** keep README accurate, save citations and dataset licences, maintain architecture notes, record important technical choices, generate real screenshots, and save actual metrics/tests.

**At each milestone:** update Devpost draft, pitch outline, slide outline and submission status with only verified material.

**Before upload:** verify fresh-clone installation, reproducible commands, public GitHub access, accessible deployed demo if provided, publicly viewable video, slide count <=10, video length <=10 min, slide file <=35 MB if uploaded through that field, gallery constraints, all team members, primary track, and final submission confirmation.

## 8. Human/team responsibilities

**Codex can:** write/update code, tests, docs, scripts, track checklist, assemble drafts, generate diagrams/slide files if its environment supports it and actual data exists.

**Team must supply/approve:** final project decisions, scientific interpretations, actual team membership and names, source licences, patient safety decisions, authentic demo recording/narration, claims and figures, Devpost login/upload and final verification. Codex must never claim those human tasks are already finished without evidence.

**Suggested owners** (assign actual names): Technical lead; data/science lead; validation lead; presentation/content lead; final Devpost owner. In a four-person team, roles should overlap.

## 9. Sources

- Devpost overview: https://ethnohack2026.devpost.com/
- Official rules: https://ethnohack2026.devpost.com/rules
- Opening Ceremony presentation: supplied by the team; see slide 12 (deliverables), slide 7 (deadlines), slide 19 (track leads), slide 24 (Track 4).
- Actual Devpost form constraints: copied from the team member's authenticated submission page.
