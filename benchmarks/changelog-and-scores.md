# Changelog & Multi-Source Verification Scoreboard

## `v1.0.0` — Initial Empirical Build (2026-11-22)

### Corpus Grounding
- Extracted and analyzed **600 real scholarly texts** from the OpenAlex public archive (`scripts/corpus-research.mjs` → `data/empirical-baselines.json`):
  - **300 verified pre-2022 human papers** (2015–2021, 61,665 words, 50 per discipline across 6 fields)
  - **300 post-2024 published papers** (2024–2026, 64,982 words, same 6 fields)
  - Confirmed **5.83x** overall Tier-1 excess-word surge (**12.2x** in CS, **16.3x** in Economics/Business, **16.2x** in Law/Policy), **7.23x** trailing participle surge, **2.06x** explicit transition surge, and measurable rhythmic flattening (`sentCV` `0.377 → 0.352`).

---

### Local Quantitative Pre-Flight Results (`scripts/stylometry-audit.mjs`)

| Benchmark Case | Stage | Words | Burstiness CV | AdjBurst | AvgWordLen | Tier-1 (`/1k`) | Transitions (`/1k`) | Participles (`/1k`) | Em-Dash (`/1k`) | Flagged Sent. | AI-Risk | Local Gates |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Case 1: STEM PhD (CS, Tier 0)** | Raw AI | 247 | `0.191` | `0.287` | `6.36` | `32.39` | `20.24` | `12.15` | `4.05` | `9` | `100.0` | `1/6 FAIL` |
| **Case 1: STEM PhD (CS, Tier 0)** | **Humanized** | 274 | **`0.471`** | **`0.692`** | **`5.65`** | **`0.0`** | **`0.0`** | **`0.0`** | **`0.0`** | **`0`** | **`0.0`** | **`6/6 PASS`** |
| **Case 2: Undergrad Essay (Psych, Tier 1)** | Raw AI | 222 | `0.300` | `0.345` | `6.44` | `31.53` | `18.02` | `4.50` | `4.50` | `8` | `96.8` | `1/6 FAIL` |
| **Case 2: Undergrad Essay (Psych, Tier 1)** | **Humanized** | 243 | **`0.451`** | **`0.727`** | **`5.04`** | **`0.0`** | **`0.0`** | **`0.0`** | **`0.0`** | **`0`** | **`0.0`** | **`6/6 PASS`** |
| **Case 3: Policy Brief (Econ/ESL, Tier 0)** | Raw AI | 218 | `0.116` | `0.152` | `6.64` | `27.52` | `18.35` | `13.76` | `4.59` | `8` | `100.0` | `1/6 FAIL` |
| **Case 3: Policy Brief (Econ/ESL, Tier 0)** | **Humanized** | 214 | **`0.421`** | **`0.658`** | **`5.38`** | **`0.0`** | **`0.0`** | **`0.0`** | **`0.0`** | **`0`** | **`0.0`** | **`6/6 PASS`** |

*Note*: During our first audit pass, `stylometry-audit.mjs` caught em-dash clusters in Case 1 (`14.81/1k`) and low burstiness + em-dashes in Case 3 (`CV=0.348`, `8.93/1k`), demonstrating the Step 7 automated catch-and-refine loop in action. After targeted edits, all 3 cases reached `0.0 / 100` risk and `6/6 PASS` with 100% factual & citation fidelity preserved.

---

### Multi-Platform External Detector Verification Worksheet (Live User Sign-Off)

Paste `case1-human.txt`, `case2-human.txt`, and `case3-human.txt` (from `benchmarks/samples/`) into at least **4 independent external detectors** and record results below. Any score `> 15%` should be logged into `data/failure-log.jsonl` for `v1.1.0` refinement.

| Sample | ZeroGPT (% AI) | GPTZero (% AI) | QuillBot (% AI) | Sapling (% AI) | Copyleaks | Pangram / Originality | Human Readability (1–5) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `case1-raw.txt` *(control)* | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | — | Control |
| `case1-human.txt` | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | Target: `<10%` med |
| `case2-raw.txt` *(control)* | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | — | Control |
| `case2-human.txt` | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | Target: `<10%` med |
| `case3-raw.txt` *(control)* | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | — | Control |
| `case3-human.txt` | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | Target: `<10%` med |
