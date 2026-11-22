# Multi-Source Verification & Self-Updating Evolution Protocol

No single AI detector is reliable ground truth. Independent benchmarks show wide disagreement across commercial platforms (for example, ZeroGPT exhibits 14–17% false-positive rates on some human corpora while failing against basic paraphrasing, whereas neural models like Pangram, Originality.ai, Copyleaks, and GPTZero target deeper probability-curvature and transformer-level syntactic cues).

To verify whether this skill genuinely works—and keep it working as both LLMs and detectors evolve—follow the **4-Tier Verification Protocol** and the **Self-Updating Evolution Loop**.

---

## Part A: Multi-Source Verification Protocol

### Tier 1 — Local Quantitative Pre-Flight (`scripts/stylometry-audit.mjs`)
Run on every transformed output BEFORE external testing:
```bash
node scripts/stylometry-audit.mjs --compare raw_draft.txt humanized.txt --discipline <discipline> --persona <persona>
```
**Passing Gate Criteria**:
- Unicode Integrity = `CLEAN` (0 zero-width chars, 0 mixed-script homoglyphs)
- Tier-1 Excess Vocabulary = `0.0 / 1k words`
- Sentence Burstiness (`sentCV`) ≥ discipline pre-2022 human `p10` (typically `>= 0.40`)
- Syntactic AI Cliché Density (`trailingParticiple + negativeParallelism + formulaicCliches`) `<= 2.0 / 1k words`
- Explicit Additive Transition Density within persona target (`<= 4.5–8.0 / 1k words`)
- Composite Heuristic AI-Risk Score `<= 15.0 / 100`

### Tier 2 — Multi-Platform External Detector Panel (Minimum 4 Diverse Detectors)
Never validate on ZeroGPT alone. Test representative outputs across **at least 4 distinct detection architectures**:

| Platform | Architecture Family | Access Tier | What It Catches Best | Pass Target |
| :--- | :--- | :--- | :--- | :---: |
| **ZeroGPT** | Perplexity + heuristic statistical classifier | Free web | Low-perplexity smooth phrasing, textbook LLM templates | `< 10%` AI |
| **GPTZero** | Hybrid statistical + sentence-level neural classifier | Free tier (word-capped) | Uniform sentence rhythm, specific flagged transition sentences | `< 10%` AI ("Human") |
| **QuillBot AI Detector** | Fine-tuned neural classifier | Free web | Paraphraser artifacts + standard GPT/Claude prose | `< 10%` AI |
| **Sapling AI Detector** | Token-level transformer probability scorer | Free tier | Smooth token sequences, predictable clause completions | `< 15%` AI |
| **Copyleaks** | Enterprise transformer classifier | Free limited checks | Cross-model academic & formal prose signatures | `Human` |
| **Pangram / Originality.ai** | Adversarial-resistant high-sensitivity neural detectors | Paid / trial (gold standard) | Lightly edited AI, subtle structural symmetry, humanizer fingerprints | `< 15%` AI |
| **Binoculars / Fast-DetectGPT** *(optional)* | Open-source zero-shot dual-model / curvature detectors | Local Python/GPU | Cross-model probability peaks regardless of training set | Below human threshold |

> **Compliance Rule**: Respect every platform's Terms of Service. Never automate CAPTCHA bypassing or anti-bot evasion. When testing through web interfaces that present anti-bot gates, submit text directly in the browser UI and record the scores in the Verification Log Table below.

### Tier 3 — Blind Human-Expert Quality & Semantic Fidelity Rubric
A pass on AI detectors is **REJECTED** if it sacrifices human quality. Score every output 1–5 across four criteria:
1. **Factual & Citation Integrity (`5/5` required)**: Zero altered stats, dates, citations, or causal claims.
2. **Natural Readability (`>= 4.5/5`)**: Reads cleanly aloud without thesaurus awkwardness or broken cadence.
3. **Persona & Disciplinary Plausibility (`>= 4.5/5`)**: Matches the requested age, role, discipline, and L1/L2 profile convincingly.
4. **Analytical Sharpness (`>= 4.5/5`)**: Removing LLM filler tightened rather than diluted the core argument.

### Tier 4 — Cross-Detector Failure Diagnosis
If **any single detector** flags >15% AI (or highlights specific sentences):
1. Isolate the exact highlighted sentences.
2. Classify the missed signal:
   - *Probability smoothness*: Token sequence is still the single most predictable continuation → re-author the clause from meaning upward with concrete domain specifics.
   - *Symmetrical macro-structure*: Every paragraph follows Claim → Explanation → Significance → break paragraph order (lead with data, exception, or critique).
   - *Residual register bleed*: Tone drifted back to encyclopedic neutral voice → re-anchor to the Persona Style Matrix.
   - *Humanizer over-correction*: Forced short fragments or fake-casual openers triggered adversarial classifiers → smooth back toward authentic pre-2022 discipline cadence.
3. Log the failure in `data/failure-log.jsonl` (see Part B).

---

## Part B: Self-Updating & Continuous Evolution Loop

LLMs change their excess vocabulary with every model generation, and detectors retrain quarterly on popular humanization patterns. Execute this **4-step self-updating cycle** whenever: (a) a user triggers `"update humanizer skill"`, (b) 3+ failures accumulate in `data/failure-log.jsonl`, or (c) quarterly.

### Step 1 — Log Live Detector Failures
Append every flagged passage (>15% on any detector) as one JSON line in `data/failure-log.jsonl`:
```json
{"date":"2026-11-22","detector":"GPTZero","scorePct":28,"sourceModel":"gpt-5","persona":"phd_researcher","discipline":"computer_science","flaggedExcerpt":"...","rootCause":"uniform 22-word sentences in methods paragraph","ruleUpdate":"increased short/long sentence contrast in technical prose"}
```

### Step 2 — Re-Run Empirical Internet Corpus Drift Script
Execute `scripts/corpus-research.mjs` to pull fresh pre-2022 human baselines vs. latest current-year publications from OpenAlex across all 6 disciplines:
```bash
node scripts/corpus-research.mjs --per-discipline 50
```
Inspect changes in:
- Emerging excess vocabulary words (check new post-2024/2025/2026 computational linguistics papers and Wikipedia's *Signs of AI writing* updates via web search).
- New syntactic/formatting quirks introduced by newest frontier models.
- Updated RAID benchmark / detector evaluation findings.

### Step 3 — Prune Obsolete or Self-Defeating Rules
Audit `SKILL.md` and `scripts/lib/stylometry-core.mjs` for:
- **New Tier-1/Tier-2 excess words** to add to `stylometry-core.mjs`.
- **Over-aggressive rules** that have themselves become detectable humanizer signatures (e.g., predictable opener patterns or unnatural fragment ratios) — prune or relax them.
- **Updated discipline target bands** written to `data/empirical-baselines.json`.

### Step 4 — Regression-Gated Version Promotion
1. Re-run the full benchmark suite (`benchmarks/test-suite.md`) through the updated skill.
2. Confirm BOTH:
   - Median AI score across the multi-detector panel improved or stayed `< 10%` (with max single-detector score `< 20%`).
   - Blind human-quality rubric stayed `>= 4.5/5` with `5/5` factual integrity.
3. Bump semantic version in `SKILL.md` frontmatter (`metadata.version`) and append the dated evidence table to `benchmarks/changelog-and-scores.md`.
