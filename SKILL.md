---
name: adaptive-humanizer
description: >-
  Use this skill whenever the user asks to humanize, rewrite, de-AI, naturalize,
  or stylistically adapt research papers, academic reports, essays, literature
  reviews, technical documentation, or business briefs so they read like authentic
  human authorship matching a specific demographic, professional, academic, or
  personal writing profile, or when updating/auditing the humanizer skill itself.
---

# Adaptive Empirical Humanizer (`v1.0.0`)

An evidence-driven stylometric transformation and author-profiling skill grounded in empirical corpus analysis of pre-2022 human academic papers vs. post-2024 LLM drift and unedited LLM outputs, combined with computational stylometry and multi-detector verification.

> **Reference Library (Progressive Disclosure — Read on Demand):**
> - Empirical corpus metrics & AI vs. human tells: [empirical-ai-vs-human.md](./references/empirical-ai-vs-human.md)
> - Demographic, role, discipline, ESL & voice-cloning profiles: [persona-style-matrix.md](./references/persona-style-matrix.md)
> - Realistic human imperfections (Tier 0/1/2) & hard anti-patterns: [imperfection-calibration.md](./references/imperfection-calibration.md)
> - Multi-platform verification & self-updating protocol: [verification-and-evolution.md](./references/verification-and-evolution.md)

---

## Core Operating Principles

1. **Semantic-First Re-Authoring, Never Synonym-Swapping**: Do NOT mechanically swap words with a thesaurus. Understand the underlying claim and evidence of each paragraph, then re-author it from scratch in the target author's natural syntax and rhetorical cadence.
2. **Cluster Elimination Over Single-Word Fixes**: Modern detectors (GPTZero, Pangram, Originality.ai, Copyleaks, Binoculars) detect *converging statistical clusters*—uniform sentence rhythm, low-perplexity continuations, hyper-explicit transitions, trailing participle commentary, triads, and excess vocabulary—not isolated words.
3. **Hard Integrity Invariants**: Never alter statistics, dates, equations, units, quotes, or citations; never invent fake references; never insert zero-width characters, soft hyphens, or Unicode homoglyphs; never introduce sloppy errors that contradict the author's profile.

---

## 7-Step Deterministic Transformation Pipeline

Execute all 7 steps in order for every document or passage.

### Step 1 — Intake & Author Profile Lock
Lock an **Author Profile Card** before touching the draft. If the user does not specify fields, infer sensible defaults from the document genre or ask briefly.

```yaml
author_profile:
  age_band: "18-22 | 23-30 | 31-49 | 50+"
  role: "undergrad_student | phd_researcher | senior_academic | industry_analyst | executive_brief | legal_policy | software_engineer | esl_grad_scholar"
  discipline: "computer_science | medicine | economics_business | psychology_social | humanities_history | law_policy"
  doc_type: "research_paper | report | essay | literature_review | executive_memo | technical_postmortem"
  language_background: "US_L1 | UK_L1 | Commonwealth_L1 | ESL_L2 (specify L1 family if known)"
  imperfection_tier: "Tier_0_Publication | Tier_1_WorkingDraft | Tier_2_CasualFirstDraft"
  voice_sample_provided: true | false
```

- Consult [persona-style-matrix.md](./references/persona-style-matrix.md) to load exact target metrics and rhetorical habits.
- **Voice Cloning Mode**: If the user supplies 300+ words of their own writing, run `scripts/stylometry-audit.mjs` on that sample first and lock its exact `sentMean`, `sentCV`, punctuation profile, and transition habits as the primary target.

### Step 2 — Immutable Fact & Citation Anchor Extraction
List every factual anchor in the source draft that MUST survive 100% unchanged:
- All numbers, percentages, p-values, confidence intervals, sample sizes, dates, units, and formulas.
- All named entities, proper nouns, statutory sections, model/dataset names, and technical terms.
- All citations `(Author, Year)` / `[1]` and direct quotations.
- Exact causal strength (never upgrade *"correlates with"* into *"causes"*).

### Step 3 — Pre-Flight Stylometry Diagnostic
Run the local quantitative auditor on the input draft to expose exact AI-trigger hotspots:

```bash
node scripts/stylometry-audit.mjs --file <input.txt> --discipline <discipline> --persona <role>
```

Inspect every flagged metric and sentence hotspot (`sentCV`, `tier1ExcessPer1k`, `trailingParticiplePer1k`, `negativeParallelismPer1k`, `explicitTransitionsPer1k`, `triadsPer1k`, `emDashesPer1k`, `paraCV`).

### Step 4 — Deep Macro-Structural & Discourse De-Templating
Restructure at the document and paragraph level *before* polishing individual sentences:
1. **Break Symmetrical Templates**: Dismantle the default LLM skeleton (*grand hook → three balanced middle points → uplifting summary wrap-up*). Open directly with the specific research gap, finding, or decision bottleneck.
2. **Introduce Organic Paragraph Asymmetry**: Vary paragraph lengths naturally (e.g., pair a 2-sentence pivot or methodological caveat with a 6–8 sentence evidence paragraph; target `paraCV >= 0.25` on multi-paragraph documents).
3. **Strip Bow-Tied Summary Fluff**: Delete empty closing sentences that merely restate the paragraph (*"Ultimately, this underscores the importance of..."*). End paragraphs on concrete data, mechanisms, or unresolved tensions.
4. **Replace Hyper-Cohesion with Conceptual Flow**: Remove at least 60–75% of sentence-initial additive crutches (`Furthermore,`, `Moreover,`, `Additionally,`, `Consequently,`, `Notably,`). Connect ideas via lexical echo, concrete contrast, or direct logical progression.
5. **Apply Section-Specific Register Shifts**: In research papers, keep *Methods* dense and plain, *Results* direct and quantitative, and *Discussion* slightly more interpretive and candid about limitations.

### Step 5 — Semantic-First Syntactic & Lexical Re-Sculpting
Re-author flagged sentences and uniform stretches from meaning upward:
1. **Target Authentic Burstiness**: Achieve `sentCV >= 0.42` (mixing crisp 6–11 word assertions with 28–42 word analytical/subordinate sentences where meaning justifies it—never robotic fragments).
2. **Zero Tier-1 Excess Vocabulary**: Eliminate 100% of Tier-1 LLM markers (`delve`, `tapestry`, `testament`, `pivotal`, `underscore`, `showcase`, `intricate`, `multifaceted`, `meticulous`, `realm`, `seamless`, `holistic`, `synergy`, `cornerstone`, `interplay`, `plethora`, `myriad`, `poised`, `burgeoning`, `spearhead`, etc.) and sharply prune Tier-2 inflated words unless domain-mandatory.
3. **Eliminate Syntactic AI Packaging**:
   - Cut trailing present-participle commentary tails (*"..., thereby highlighting..."*, *"..., underscoring..."*)—split into a separate concrete claim or fold directly into the main verb.
   - Break negative parallelisms (*"not just X, but Y"*, *"not only X, but also Y"*) into direct declarative statements.
   - Break rigid Rule-of-Three triads into pairs, single precise nouns, or uneven four-item lists.
   - De-nominalize bloated copular phrases (*"conduct an analysis of"* → *"analyze"*, *"plays a crucial role in"* → *"drives"* / *"shapes"*).
   - Cap em-dashes strictly (`<= 3` per 1,000 words, or `0` for strict STEM/undergrad profiles); vary punctuation naturally with commas, parentheses, colons, and plain periods.
4. **Calibrate Epistemic Stance**: Replace vague RLHF hedging (*"it is widely believed"*, *"some critics argue"*, *"may potentially"*) with domain-appropriate precision (*"Smith (2020) found..."*, *"within the 12-month sample..."*, *"the regression cannot rule out..."*).
5. **Natural Noun Reuse**: Reuse plain, accurate technical nouns naturally instead of cycling awkward synonyms.

### Step 6 — Calibrated Imperfection & Persona Micro-Voice Pass
Consult [imperfection-calibration.md](./references/imperfection-calibration.md) and apply ONLY the micro-traits for the locked `imperfection_tier` and `author_profile`:
- **Tier 0 (Publication)**: Zero errors; asymmetrical structure, natural noun repetition, unwrapped endings, disciplined occasional first-person or sharp concession.
- **Tier 1 (Working Draft / Student / Internal)**: Add 1–2 subtle natural quirks per 500 words (plain phrasal verbs, slightly uneven sub-point depth, occasional conversational pivot, mild comma preference).
- **Tier 2 (Informal First Draft)**: Only if explicitly requested; natural spoken rhythm matching the persona's age band.
- **ESL / L2 Safeguard**: When writing an ESL profile, keep vocabulary straightforward and natural while maintaining strong **structural burstiness and concrete specificity** so commercial detectors do not trigger ESL false positives.

### Step 7 — Verification Gate & Multi-Source Audit
1. **Local Before/After Gate**: Run:
   ```bash
   node scripts/stylometry-audit.mjs --compare <raw_input.txt> <humanized_output.txt> --discipline <discipline> --persona <role>
   ```
   Confirm ALL 6 local gates return `[PASS]` (`Unicode Integrity`, `Tier-1 Excess = 0`, `Burstiness CV`, `Syntactic Clichés <= 2.0/1k`, `Transitions`, `Composite AI-Risk <= 15`). If any gate fails, iterate Steps 4–6 on the exact flagged sentences.
2. **Factual & Citation Diff**: Cross-check every anchor from Step 2 against the final output. Require 100% accuracy.
3. **Read-Aloud Quality Check**: Verify natural flow, persona plausibility, and zero "humanizer word salad".
4. **External Multi-Detector Cross-Check**: Follow [verification-and-evolution.md](./references/verification-and-evolution.md) to validate critical deliverables across **4+ independent detection architectures** (e.g., ZeroGPT, GPTZero, QuillBot, Sapling, Copyleaks, Pangram) and never rely on a single tool.

---

## Self-Updating Maintenance Command

When the user asks to **"update the humanizer skill"**, when **3+ flagged incidents** accumulate in `data/failure-log.jsonl`, or quarterly:
1. Run `node scripts/corpus-research.mjs --per-discipline 50` to refresh OpenAlex pre-2022 vs. current-year empirical baselines in `data/empirical-baselines.json`.
2. Review recent detector failure entries in `data/failure-log.jsonl` and search for newly published excess-vocabulary / detector benchmark updates.
3. Update feature lists in `scripts/lib/stylometry-core.mjs`, prune any rules causing over-correction, re-run `benchmarks/test-suite.md`, and bump the version in `SKILL.md` + `benchmarks/changelog-and-scores.md` following [verification-and-evolution.md](./references/verification-and-evolution.md).
