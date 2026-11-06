# Ìtàn

Ìtàn is a Nigeria-first research prototype for **EthnoHack 2026, Track 4: Digital Health & Phytotherapy**. It helps people check claims about medicinal plants and see what researchers found, who they studied, and what remains unclear.

People hear claims about medicinal plants in everyday conversation, on product labels and online. Ìtàn lets them follow a claim to the relevant studies in its collection and see the differences between reported traditional use, animal or laboratory results, and research in people.

**[Try the claim checker](https://itan-ethnohack.vercel.app/claims)** · [App home](https://itan-ethnohack.vercel.app/) · [Teammate handoff](HANDOFF.md) · [Third-party notices](docs/THIRD_PARTY_NOTICES.md)

Claim checking, browsing, label reading and ingredient comparison work without provider keys. Live photo identification and optional AI explanations depend on the deployment configuration. Both providers were exercised in local testing.

## What you can try

1. **Check a plant claim.** Try “Does bitter leaf lower blood sugar?” Open the study in people and the study in rats, then follow their source links.
2. **Explore research.** Browse the plant library for local names and source summaries. Ask Ìtàn can guide navigation and, with consent and a configured provider, explain selected records.
3. **Scan and compare labels.** Review the ingredients read from a photo or enter them yourself. Compare two or three labels to see matching names, possible overlaps and unidentified names.
4. **Identify a plant.** With consent and a configured Pl@ntNet service, add a photo to get possible names. The library also supports manual search.
5. **Read health information.** The cholera page uses an archived 2024 advisory, and the malaria page links to official guidance.

A registration number can be checked on the linked NAFDAC websites. Ìtàn does not currently perform a live NAFDAC database lookup or authenticate the physical package.

The library contains **19 source-linked records across eight plants** and public-health guidance. It is a small, manually curated collection, not a complete search of all research. Botanical and pharmacist review is pending. This prototype does not provide diagnosis, treatment recommendations or proof that a product is safe or effective.

## How it works

- The claim checker matches the plant name and the stated effect to the curated collection. It checks the study result, the preparation and who or what researchers studied before showing a finding and links to the original sources.
- The label scanner uses **optical character recognition (OCR)** to suggest text from an image. Users review the suggestion.
- A rule-based matcher compares ingredient names against scientific names and aliases in the plant library. Common names can point to more than one plant, so possible matches stay uncertain.
- Comparison groups matching names and shows relevant, limited interaction research separately.
- The research assistant retrieves records from the versioned collection using names and keywords. If enabled, Google Gemini can draft explanations from selected records; citations and proposed claims are checked before display. These checks cannot guarantee accuracy. If the provider is unavailable, the app displays the cited records instead.
- Pl@ntNet provides the pretrained plant-photo identification model. Tesseract provides pretrained OCR. No model was trained by this project.

Traditional and complementary medicine (TCIM) refers here to traditional, complementary and integrative medicine. Traditional-use reports, laboratory studies, animal studies, human research and official guidance are labelled separately.

## Technology

The app uses TypeScript, React and Next.js, with Tesseract.js for on-device label reading. Optional integrations are Pl@ntNet for plant photos, Gemini for research explanations and Supabase for catalog access and server-side request limits. The versioned local catalog and manual entry work without a database or API keys.

The team developed the application, matching and comparison logic, evidence collection and interface during the hackathon. It uses the pretrained and third-party tools named above and in [third-party notices](docs/THIRD_PARTY_NOTICES.md). Codex was used to assist with development, documentation and research; the team remains responsible for checking the results, sources and licences.

## Run locally on Windows

You need [Node.js 24](https://nodejs.org/), npm, and Git. A code editor such as WebStorm is helpful.

1. Clone this repository or download it from GitHub, then open its folder in WebStorm.
2. Open **Terminal** in WebStorm. Install the project's dependencies and start it:

   ```powershell
   npm ci
   npm run dev
   ```

3. Open the local address printed in the terminal, usually [http://localhost:3000](http://localhost:3000). If that port is in use, follow the address printed by the terminal.
4. Open **Check a plant claim** or go to `/claims`. Enter “Does bitter leaf lower blood sugar?” and choose **Check the research**.

Press `Ctrl+C` in the terminal to stop the server. No credentials are needed for these manual flows or the saved research collection.

## Optional API and database setup

To enable external services, copy the provided template to a local file in the project root:

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` in your editor, fill in only the services you are authorized to use, save it, and restart the development server. Never commit this file or share its values in chat. The template contains no keys.

| Setting | Purpose and where to obtain it |
| --- | --- |
| `SUPABASE_URL` | Project URL from your authorized [Supabase project](https://supabase.com/dashboard). |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key from Supabase project API settings; enables the optional catalog read. |
| `SUPABASE_SECRET_KEY` | Server-only Supabase secret key, or a legacy service-role key, from the project's API settings. Required by the provider quota check. Never use a `NEXT_PUBLIC_` prefix. |
| `GEMINI_API_KEY` | Server-only key created in [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key); enables optional AI explanations when quota checks succeed. |
| `GEMINI_MODEL` | Optional model name. Leave empty to use the application's default, `gemini-2.5-flash`. |
| `PLANTNET_API_KEY` | Server-only key obtained for an authorized [Pl@ntNet API](https://my.plantnet.org/) account; enables photo-identification requests when quota checks succeed. |

Gemini and Pl@ntNet also require the protected quota function from `supabase/migrations`. Apply the migrations to a development database to try the integrations. Check compatibility before applying them to an existing deployment. If the quota cannot be checked, manual paths and research summaries still work. Provider usage limits, account terms and possible charges depend on the configured accounts.

## Tests and reproducibility

```powershell
npm test
npm run audit:claims
npm run audit:retrieval -- holdout
npx --no-install tsc --noEmit
npm run build
```

On 6 November 2026, a clean clone of revision `a4425ce` passed 39 automated tests, returned the expected results on 34 of 34 claim cases and retrieved the expected records on 16 of 16 questions in the separate retrieval set. The team wrote these checks. Specialist review and first-time-user testing are pending. See the [handoff](HANDOFF.md#reproduce-the-evaluation) for fixture details and remaining checks.

The NAFDAC product examples included in the public default are fictional. A separate local NAFDAC snapshot is excluded from Git and must not be included in a public release until its reuse rights are resolved. Scientific summaries link to their original sources; research and image provenance are documented in the app and [third-party notices](docs/THIRD_PARTY_NOTICES.md).

## Current limitations and next checks

- The plant collection and interaction records are small. Missing information does not mean a product or combination is safe.
- Plant-photo suggestions and OCR can be wrong. Review names and labels; never use a photo result as proof a plant is safe to consume.
- Live provider availability, privacy terms, quota enforcement and spending controls must be checked in the actual deployment. Hosted configuration is separate from `.env.local`.
- The archived cholera advisory is not a live alert. The app links to current official sources.
- Specialist review, first-time-user testing, physical-phone camera and installation checks remain outstanding.
- Sellers, reviews, live outbreak monitoring and live NAFDAC integration remain roadmap items.

For approved evidence identifiers, `npm run evidence:draft -- 23770031` creates a metadata-only draft in ignored `outputs/evidence-drafts`; it is not published until reviewed.
