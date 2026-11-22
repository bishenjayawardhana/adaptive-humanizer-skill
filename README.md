# Adaptive Humanizer Skill (`v1.0.0`)

An empirically researched, multi-persona **AI Agent Skill** (`SKILL.md` + reference library + zero-dependency Node.js stylometry & corpus-research scripts) for transforming AI-drafted reports, research papers, essays, and briefs into authentic human writing—plus a **Master Builder Meta-Prompt** for recreating or extending the skill inside any AI system.

---

## What's Inside

| Path | Purpose |
| :--- | :--- |
| [SKILL.md](./SKILL.md) | Portable Agent Skill runbook with a deterministic 7-step transformation pipeline |
| [humanizer-skill-builder-prompt.md](./humanizer-skill-builder-prompt.md) | Copy-paste Master Meta-Prompt to build/research this skill inside another AI (Claude, ChatGPT, Gemini, DeepSeek, Cursor) |
| [references/empirical-ai-vs-human.md](./references/empirical-ai-vs-human.md) | Empirical human-vs-AI quantitative findings from our 600-paper OpenAlex corpus run + peer-reviewed literature |
| [references/persona-style-matrix.md](./references/persona-style-matrix.md) | Author profiling matrix (age, role, profession, discipline, L1/L2 ESL safeguards, 300-word Voice Cloning) |
| [references/imperfection-calibration.md](./references/imperfection-calibration.md) | Tier 0/1/2 realistic human micro-imperfections + strict anti-patterns (no homoglyphs, no thesaurus-salad, no typo spam) |
| [references/verification-and-evolution.md](./references/verification-and-evolution.md) | 4-tier multi-detector verification SOP (ZeroGPT, GPTZero, QuillBot, Sapling, Copyleaks, Pangram) + self-updating loop |
| [scripts/corpus-research.mjs](./scripts/corpus-research.mjs) | Harvests pre-2022 human vs. current-year papers from OpenAlex across 6 disciplines to refresh empirical baselines |
| [scripts/stylometry-audit.mjs](./scripts/stylometry-audit.mjs) | Local quantitative stylometry auditor & before/after comparison gate (`Node.js 18+`, zero dependencies) |
| [data/empirical-baselines.json](./data/empirical-baselines.json) | Generated empirical metrics across 300 pre-2022 human papers (61,665 words) vs. 300 post-2024 papers (64,982 words) |
| [data/failure-log.jsonl](./data/failure-log.jsonl) | Append-only detector failure telemetry log driving versioned updates |
| [benchmarks/](./benchmarks/) | Multi-persona before/after test suite ([test-suite.md](./benchmarks/test-suite.md)) & [changelog-and-scores.md](./benchmarks/changelog-and-scores.md) |

---

## Empirical Highlights (600-Paper OpenAlex Run)

Generated directly via `node scripts/corpus-research.mjs --per-discipline 50` across 6 fields (Computer Science, Medicine, Economics/Business, Psychology/Social Sciences, Humanities/History, Law/Policy):

| Signal | Pre-2022 Human (`n=300`) | Post-2024 Drift (`n=300`) | Raw-LLM Baseline (`n=6`) |
| :--- | :---: | :---: | :---: |
| **Sentence Burstiness CV (median)** | `0.377` | `0.352` | `0.163` |
| **Adjacent Burstiness Ratio (median)** | `0.459` | `0.427` | `0.218` |
| **Lexical Diversity (`MATTR-50` med)** | `0.791` | `0.804` | `0.943` |
| **Tier-1 Excess Words (`/1k` pooled)** | `0.211` (`3.67%` of docs) | `1.231` (**5.83x**, `17.33%` of docs) | `53.25` (`100%`) |
| **Trailing Participle Clauses (`/1k`)** | `0.228` | `1.648` (**7.23x surge**) | `10.38` |
| **Explicit Additive Openers (`/1k`)** | `0.844` | `1.738` (**2.06x surge**) | `29.48` |
| **First-Person Ownership (`/1k` med)** | `9.76` | `5.53` (**-43% drop**) | `4.17` |

---

## Quick Start

### 1. Use as an Agent Skill
Copy this repository folder into your agent's skills directory (e.g., `.agents/skills/adaptive-humanizer/` in Antigravity, or your agent's `SKILL.md` skills path), or attach `SKILL.md` + `references/` in your prompt context.

### 2. Run the Local Stylometry Auditor
Requires **Node.js 18+** (no `npm install` needed):

```bash
# Audit a single draft
node scripts/stylometry-audit.mjs --file benchmarks/samples/case1-raw.txt --discipline computer_science --persona phd_researcher

# Compare before vs. after transformation
node scripts/stylometry-audit.mjs --compare benchmarks/samples/case1-raw.txt benchmarks/samples/case1-human.txt --discipline computer_science --persona phd_researcher
```

### 3. Refresh Empirical Corpus Baselines Over Time
Re-run the OpenAlex corpus drift comparison quarterly or after major frontier model releases:

```bash
node scripts/corpus-research.mjs --per-discipline 50
```

### 4. Benchmark Summary (`v1.0.0`)

| Case | Persona | Burstiness CV | Tier-1 (`/1k`) | Flagged Sent. | Local AI-Risk | Gates |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Case 1** | STEM PhD (CS, Tier 0) | `0.191 → 0.471` | `32.39 → 0.0` | `9 → 0` | `100 → 0` | **6/6 PASS** |
| **Case 2** | Undergrad Essay (Psych, Tier 1) | `0.300 → 0.451` | `31.53 → 0.0` | `8 → 0` | `96.8 → 0` | **6/6 PASS** |
| **Case 3** | Policy Brief (Econ/ESL, Tier 0) | `0.116 → 0.421` | `27.52 → 0.0` | `8 → 0` | `100 → 0` | **6/6 PASS** |
