# Multi-Persona Benchmark Test Suite

This benchmark suite validates `adaptive-humanizer` across three starkly different genres, age bands, disciplines, language backgrounds, and imperfection tiers. Every test pair lives in `benchmarks/samples/` so `scripts/stylometry-audit.mjs --compare` can be re-run after any skill edit as a regression gate.

---

## Case 1 — STEM PhD Research Paper (Computer Science)
- **Raw Draft**: [case1-raw.txt](./samples/case1-raw.txt)
- **Humanized Output**: [case1-human.txt](./samples/case1-human.txt)
- **Locked Profile**:
  - `age_band`: `23-30` | `role`: `phd_researcher` | `discipline`: `computer_science`
  - `doc_type`: `research_paper` | `language_background`: `US_L1` | `imperfection_tier`: `Tier_0_Publication`
- **Immutable Factual Anchors Preserved (100%)**:
  - `Llama-3-8B`, `A100-80GB GPU`, `16k` context window, `FP16`, `INT4` / `4-bit`
  - `38.4%` KV-cache VRAM reduction, `1.72x` batch decoding throughput gain
  - `4` attention-sink tokens, `128` sliding-window tokens, `0.41` WikiText-2 perplexity degradation, `32` decoder layers
  - Citations: `Dettmers et al. (2022)`, `Hooper et al. (2024)`

---

## Case 2 — Undergraduate Essay (Psychology / Social Science)
- **Raw Draft**: [case2-raw.txt](./samples/case2-raw.txt)
- **Humanized Output**: [case2-human.txt](./samples/case2-human.txt)
- **Locked Profile**:
  - `age_band`: `18-22` | `role`: `undergrad_student` | `discipline`: `psychology_social`
  - `doc_type`: `essay` | `language_background`: `US_L1` | `imperfection_tier`: `Tier_1_WorkingDraft`
- **Immutable Factual Anchors Preserved (100%)**:
  - `184` college students (`n = 184`), `22%` drop in reading-comprehension recall
  - `4.3` minutes recovery lag, `3`-second glance
  - Citations: `Rosen et al. (2013)`, `Ward et al. (2017)`

---

## Case 3 — Policy & Economics Analyst Brief (ESL / L2 Academic Profile)
- **Raw Draft**: [case3-raw.txt](./samples/case3-raw.txt)
- **Humanized Output**: [case3-human.txt](./samples/case3-human.txt)
- **Locked Profile**:
  - `age_band`: `31-49` | `role`: `esl_grad_scholar` | `discipline`: `economics_business`
  - `doc_type`: `report` | `language_background`: `ESL_L2 (South Asian Academic/Policy)` | `imperfection_tier`: `Tier_0_Publication`
- **Immutable Factual Anchors Preserved (100%)**:
  - `2019–2023` audit period, `Tallinn`, `Kansas City`
  - `14%` to `19%` ridership growth, `3.2%` private car-trip displacement, `$18.6M` annual operating subsidy gap
  - Policy pairing: means-tested passes + dedicated bus lanes

---

## Re-Running the Regression Suite

```powershell
$s = ".\scripts\stylometry-audit.mjs"
$b = ".\benchmarks\samples"
node $s --compare "$b\case1-raw.txt" "$b\case1-human.txt" --discipline computer_science --persona phd_researcher
node $s --compare "$b\case2-raw.txt" "$b\case2-human.txt" --discipline psychology_social --persona undergrad_student
node $s --compare "$b\case3-raw.txt" "$b\case3-human.txt" --discipline economics_business --persona esl_grad_scholar
```
