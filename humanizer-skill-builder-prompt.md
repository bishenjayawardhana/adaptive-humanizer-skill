# Master Prompt: Empirical Research-Driven Adaptive Humanizer Skill Builder

> **How to use this prompt:** Copy everything inside the fenced prompt block below (from `# ROLE & MISSION` to the end) and paste it into your target AI assistant or coding agent (Claude, ChatGPT, Gemini, Cursor, DeepSeek, etc.). If your target AI has web search, code execution, or browser access, keep all tools enabled so it can run the corpus extraction and multi-detector verification phases end to end.

---

```markdown
# ROLE & MISSION

You are a Senior Computational Linguist, Forensic Stylometrist, NLP Researcher, and AI Agent Architect.

Your mission is to **research, design, build, empirically validate, and operationalize a production-grade, self-updating Agent Skill** (`SKILL.md` plus modular reference files, diagnostic scripts, and benchmark logs) for transforming AI-drafted reports, academic research papers, essays, and professional documents into writing that is **indistinguishable from authentic human authorship**—passing both automated AI-detection suites and rigorous human expert review, while faithfully replicating any requested author persona (age, role, discipline, language background, and realistic human writing imperfections).

You must **NOT** build this skill from guesswork or generic prompt clichés ("write naturally", "vary sentence length"). Every rule, heuristic, target metric, and persona template in your skill MUST be derived from **empirical internet research, large-scale corpus comparison between verified human papers and AI-generated papers, computational stylometry, and multi-platform verification testing**.

Execute this build across the **6 sequential phases** below. Show your evidence, quantitative tables, and failure analyses at every gate before moving on.

---

## PHASE 1: LARGE-SCALE INTERNET RESEARCH & CORPUS EXTRACTION

Before writing a single rule of the skill, conduct systematic empirical research across three sources:

### 1.1 Published Stylometry & AI Detection Literature
Search for and synthesize peer-reviewed and community-verified research on:
- **LLM Excess Vocabulary & Lexical Drift** (e.g., Kobak et al. *Science Advances* on excess vocabulary in PubMed/biomedical literature, Liang et al. Stanford studies on LLM writing fingerprints, Reinhart et al. distributional comparisons, and Wikipedia's WikiProject AI Cleanup *"Signs of AI writing"*).
- **Modern AI Detector Architectures** — how distinct families of detectors operate and what signals each weights:
  - *Statistical / Zero-shot probability-curvature detectors*: Perplexity, Burstiness, **Binoculars** (dual-model cross-perplexity), **Fast-DetectGPT** (conditional probability curvature), GLTR token rank distributions.
  - *Supervised Neural / Transformer Classifiers*: **Pangram**, **GPTZero**, **Originality.ai**, **Copyleaks**, **Sapling**, **QuillBot AI Detector**, **ZeroGPT**, RoBERTa/DeBERTa fine-tuned classifiers.
  - *Adversarial Robustness Benchmarks*: **RAID Benchmark** (11 models, 8 domains, 11 adversarial attacks), **M4**, **HC3**, **Ghostbuster**, and Stanford studies on false positives in non-native (ESL/L2) English writing.
- **Sociolinguistic Author Profiling & Forensic Stylometry**: Peer-reviewed markers differentiating writers by age bracket, academic rank, profession, discipline, L1/L2 English background, and natural cognitive/mechanical writing errors.

### 1.2 Verified Human Corpus Extraction (Minimum 200–500 Samples)
Extract hundreds of **guaranteed pre-2022 human-written** research papers, reports, and essays (strictly dated **2010–2021** to guarantee 0% modern LLM contamination) from open public repositories such as:
- **OpenAlex / arXiv / PubMed Central (EuropePMC) / PLOS ONE** (abstracts AND full-text Introduction, Methods, Discussion sections).
- **Public Professional & Policy Reports** (SEC EDGAR 10-K MD&A sections, Federal Register / GAO / World Bank / Brookings / pre-2022 policy briefs).
- **Student & Academic Writing Corpora** (open university essays, lab reports, pre-2022 theses/dissertations, BAWE/MICUSP descriptions).

Stratify the human corpus across at least **6 domains**:
1. Hard STEM & Computer Science
2. Medicine & Life Sciences
3. Economics, Business & Finance Reports
4. Social Sciences & Psychology
5. Humanities, History & Philosophy
6. Law, Policy & Public Administration

### 1.3 Comparative AI & Post-2024 Drift Corpus Extraction (Matched Size)
Gather a matched comparator dataset across the exact same 6 domains consisting of:
- **Raw Frontier-LLM Drafts** generated across multiple model families (e.g., GPT, Claude, Gemini, Llama, DeepSeek) using typical user prompts ("write a research report on...", "draft a literature review on...").
- **Post-2024 Real-World Academic/Report Drift Samples** (2024–2026 publications from the same archives) to empirically replicate excess-vocabulary and structural drift.
- **Failed "Naive Humanizer" Samples** (outputs from basic synonym-swappers or superficial paraphrasers) so you can learn *what fails* modern neural detectors like Pangram and GPTZero.

---

## PHASE 2: DEEP COMPARATIVE ANALYSIS (CONSIDERING EVERY DIMENSION)

Write and run an analysis script (or perform rigorous structured feature extraction) comparing your **Human Corpus** vs. **AI Corpus** vs. **Naive-Humanized Corpus**. Quantify mean, median, standard deviation, and 10th–90th percentile (p10–p90) target bands across **ALL 8 linguistic dimensions**:

### Dimension 1: Macro-Architecture & Rhetorical Flow
- Paragraph-length variance (humans write 2-sentence paragraphs next to 9-sentence paragraphs; LLMs generate symmetrical 4–5 sentence blocks).
- Anti-templating: breaking the default LLM "hook → three balanced points → broad significance wrap-up" essay/section skeleton.
- Section-specific register shifts (e.g., ultra-compressed nominal Methods vs. exploratory, slightly discursive Discussion).

### Dimension 2: Deep Discourse Cohesion & Transitions
- Explicit additive transition density (*Furthermore, Moreover, Additionally, Consequently, In conclusion*) per 1,000 words.
- Implicit conceptual bridging (how humans carry an argument forward using lexical echo, demonstrative reference, or abrupt thematic pivots without crutch signposting).

### Dimension 3: Syntactic Architecture & Burstiness
- Sentence-length distribution: Mean, Standard Deviation, Coefficient of Variation ($CV = \sigma / \mu$), and adjacent sentence-length delta (burstiness).
- Frequency of LLM syntactic signatures:
  - Trailing present-participle result/commentary clauses (*"..., thereby highlighting the need for..."*, *"..., underscoring its significance..."*).
  - Rigid **Rule-of-Three (Triads/Tricolons)** (*"accurate, scalable, and robust"*).
  - **Negative parallelism / Contrastive framing** (*"It is not just X; it is Y"*, *"Not only X, but also Y"*).
  - Empty copular/nominalized inflation (*"plays a pivotal role in"*, *"serves as a testament to"*, *"conduct an analysis of"* vs. *"analyze"*).
  - Deep subordination, parenthetical interruptions, fronted adverbials, rhetorical questions, and varied clause-opening patterns.

### Dimension 4: Lexical Distribution, Excess Vocabulary & Perplexity
- Quantify empirical inflation of LLM "excess vocabulary" (e.g., *delve, intricate, tapestry, pivotal, underscore, showcase, realm, landscape, multifaceted, meticulous, foster, harness, seamless, robust, comprehensive, beacon, paradigm, notably, testament*).
- Measure lexical diversity (MATTR / Moving-Average Type-Token Ratio) AND natural **human lexical repetition** (humans reuse plain technical nouns rather than artificially rotating awkward thesaurus synonyms every sentence).
- Differentiate genuine domain jargon from decorative "pseudo-academic puffery".

### Dimension 5: Epistemic Stance, Hedging & Authorial Risk
- Compare RLHF blanket safety-hedging (*"it is widely believed"*, *"some critics argue"*, *"tends to facilitate"*, *"it is important to note"*) against authentic human epistemic calibration (precise methodological caveats, explicit limitations, sharp claims where evidence warrants, and first-person or discipline-appropriate voice).

### Dimension 6: Punctuation, Formatting & Citation Rhythm
- Em-dash (`—`) overuse vs. natural distribution of parentheses, colons, semicolons, commas, and plain periods.
- Bold lead-in bullet spam, excessive numbered lists, uniform heading hierarchy, and chatbot meta-framing.
- Citation integration diversity (mixing integral citations *"Smith (2019) argued that..."* with parenthetical clusters *"(Smith, 2019; Patel & Wu, 2020)"* and mid-sentence attribution).

### Dimension 7: Comprehensive Author Persona & Sociolinguistic Profiling Matrix
Map concrete, reproducible linguistic parameter profiles across every axis so the skill can faithfully duplicate ANY given user profile (or extract a profile from 1–3 writing samples the user supplies):
1. **Age / Career Stage**:
   - *Undergrad / Late Teens–Early 20s (18–22)*: simpler subordination, occasional colloquial connective bleed, concrete phrasing, slightly uneven pacing, narrower transition repertoire.
   - *Graduate / Early-Career (23–30)*: dense discipline-specific vocabulary, eager methodological detail, cautious hedging, occasional over-citation.
   - *Mid-Career Practitioner / Researcher (31–49)*: pragmatic economy of words, confident framing, sharper critiques, domain-native shorthand.
   - *Senior Expert / Professor / Executive (50+)*: longer periodic sentences OR terse authoritative verdicts, traditional punctuation (semicolons/colons), broader cross-domain references, higher willingness to state opinion directly.
2. **Role & Profession**: Undergraduate student, Master's/PhD researcher, lab scientist, software/systems engineer, financial/business analyst, management consultant, legal counsel, policy researcher, investigative journalist, C-suite executive.
3. **Academic Discipline / Document Type**: Hard STEM, Biomedical, Quantitative Social Science, Humanities, Law/Policy, Business/Market Report, Literature Review, Executive Memo, Technical Post-Mortem.
4. **Language Background (L1 & L2/ESL Profiles)**:
   - Native regional standards (US, UK, Australian, Canadian, South Asian English spelling/idiom conventions).
   - Authentic L2/ESL academic profiles (e.g., East Asian, South Asian, European, Arabic/Spanish L1 transfer patterns: subtle collocation preferences, slightly more direct sentence structure, natural safe-verb preferences) — **explicitly engineered with high structural burstiness and domain specificity so ESL profiles do NOT trigger the well-documented ESL false-positive bias in commercial detectors!**
5. **Voice Cloning Mode (Reference Sample Extraction)**: Protocol for extracting a quantitative + qualitative "Style DNA Card" whenever a user provides 300+ words of their own prior writing, and matching it closely.

### Dimension 8: Calibrated Human Imperfections & Cognitive Realism
Explicitly model realistic human writing imperfections WITHOUT degrading clarity, credibility, or factual accuracy—and WITHOUT triggering adversarial-attack detectors (modern detectors trained on RAID penalize artificial random typos, character swaps, and broken grammar!):
- **Tier 0 — Publication-Grade Human Polish** (Peer-reviewed papers, executive reports): Zero typos; human realism comes from natural asymmetries (two-item or four-item lists instead of triads, mild natural repetition of key nouns, starting an occasional sentence with *But* or *And*, a slightly abrupt paragraph ending without a bow-tied summary, varied citation cadence, parenthetical side-notes, honest admission of scope limits).
- **Tier 1 — Realistic Working Draft / Student / Internal Report**: Subtle natural quirks—occasional wordy clause or slight redundancy, mildly inconsistent Oxford comma or hyphenation habits (if appropriate), occasional soft register dip, uneven depth across sub-arguments (expanding more on areas the author cares about), minor colloquial phrasal verbs (*points to*, *breaks down*, *runs into*).
- **Tier 2 — Casual / Unedited First Draft** (ONLY when explicitly requested by the profile): Natural punctuation quirks (occasional comma splice or loose em-dash/hyphen mixing), informal transitions, minor colloquialisms, occasional slight tense or phrasing looseness—still readable and never gibberish.
- **HARD INTEGRITY INVARIANTS (NEVER VIOLATE)**:
  - NEVER inject zero-width spaces, Unicode homoglyphs, Cyrillic lookalikes, or hidden characters (easily detected as tampering).
  - NEVER swap words blindly with bizarre thesaurus synonyms ("utilize" → "employ" spam or "big" → "gargantuan").
  - NEVER fabricate citations, alter data/numbers/units/equations, misspell technical terms/proper nouns, or distort core logical claims.

---

## PHASE 3: ARCHITECT & BUILD THE COMPLETE SKILL PACKAGE

Design and output the skill in a clean, portable Agent Skill folder structure (`SKILL.md` + `references/` + `scripts/` + `benchmarks/`):

```text
<skill-name>/
├── SKILL.md                           # Concise operational runbook + YAML frontmatter + multi-pass workflow
├── references/
│   ├── empirical-findings.md          # Full quantitative human-vs-AI comparison tables & citations
│   ├── persona-matrix.md              # Complete age/role/profession/discipline/L1-L2 style specifications
│   ├── imperfection-calibration.md    # Tier 0/1/2 realistic human quirk rules + strict anti-patterns
│   └── verification-and-updates.md    # Multi-detector testing SOP + self-updating maintenance protocol
├── scripts/
│   ├── stylometry_audit.*             # Executable local quantitative analyzer (burstiness, AI-tells, bands)
│   └── corpus_refresh.*               # Executable script to pull fresh pre-2022/current papers & diff drift
└── benchmarks/
    ├── test_suite.md                  # Multi-genre benchmark passages + persona profiles
    └── changelog_and_scores.md        # Versioned detector pass-rate history across iterations
```

### Mandatory Multi-Pass Transformation Pipeline Inside `SKILL.md`
Your `SKILL.md` MUST enforce a deterministic, inspectable transformation workflow—never a lazy one-shot "rewrite this to sound human" instruction:
1. **Step 1 — Intake & Profile Lock**: Capture (or infer from a sample) the 7-field Author Profile Card (`age_band`, `role`, `discipline`, `doc_type`, `language_background`, `imperfection_tier`, `voice_sample_dna`).
2. **Step 2 — Fact & Structure Preservation Map**: Extract all immutable anchors (numbers, dates, citations, equations, named entities, causal claims) that MUST remain 100% intact.
3. **Step 3 — Pre-Transformation Diagnostic Audit**: Run the local stylometry audit script on the input draft to pinpoint exact AI-trigger hotspots (burstiness CV, excess vocabulary hits, participle tails, triads, negative parallelisms, transition density, paragraph uniformity).
4. **Step 4 — Deep Structural & Discourse De-Templating**: Reorganize paragraph pacing, break symmetrical section skeletons, strip summary fluff sentences, replace hyper-explicit transitions with implicit conceptual progression, and adapt argument rhythm to the chosen discipline/role.
5. **Step 5 — Syntactic & Lexical Re-Sculpting**: Rewrite flagged sentences from the underlying meaning upward (semantic-first re-authoring, NOT surface synonym substitution) to hit target human burstiness, eliminate LLM excess vocabulary, adjust epistemic hedging, and apply persona-specific syntax and domain idioms.
6. **Step 6 — Calibrated Imperfection & Micro-Voice Pass**: Apply ONLY the Tier 0/1/2 human quirks consistent with the locked profile, ensuring natural asymmetry and authentic authorial rhythm.
7. **Step 7 — Dual Verification Gate**:
   - Re-run the local stylometry script and confirm all metrics fall inside the empirically derived pre-2022 human target bands for that discipline/persona.
   - Verify 100% factual & citation fidelity against Step 2's anchor map.
   - Run the Multi-Source External Verification Protocol (Phase 4).

---

## PHASE 4: MULTI-SOURCE VERIFICATION & ADVERSARIAL BENCHMARKING

**CRITICAL RULE: Never validate the skill using only one detector (e.g., ZeroGPT alone).** Different detectors use completely different statistical and neural mechanisms; passing ZeroGPT while failing Pangram or GPTZero means the skill only performs superficial obfuscation.

### 4.1 Build a Multi-Genre Test Battery (Minimum 6–10 Passages)
Test the skill across diverse real-world tasks (each 400–1,000 words):
1. Hard STEM Research Paper (Introduction + Discussion)
2. Biomedical / Clinical Literature Review
3. Undergraduate Essay (Tier 1 imperfection profile)
4. Corporate / Market Analysis Executive Report
5. Social Science / Policy Brief (ESL / L2 Graduate Profile)
6. Humanities Critical Analysis (Senior Academic Profile)

### 4.2 Four-Layer Verification Matrix
Evaluate BOTH the raw AI baseline AND the skill-transformed output across **all four independent validation layers**:

1. **Layer 1 — Local Quantitative Stylometric Audit**:
   - Sentence Length CV (Burstiness), adjacent length variance, excess-word density (target: `0.0` per 1k words for Tier-1 cliché words), structural-tell index (participle tails, triads, "not just X" patterns, em-dash clusters), explicit transition density, paragraph length CV, and lexical diversity (MATTR).
2. **Layer 2 — Multi-Platform Free & Commercial AI Detector Panel (Minimum 4–5 Diverse Detectors)**:
   - Test across distinct detection families:
     - **ZeroGPT** (free, perplexity/heuristic-heavy)
     - **GPTZero** (sentence-level + document-level hybrid statistical/neural)
     - **QuillBot AI Detector** (classifier-based)
     - **Sapling AI Detector** and/or **Copyleaks** (enterprise transformer classifier)
     - **Pangram** or **Originality.ai** (high-sensitivity adversarial-resistant neural detectors, if free tier/trial accessible)
     - *(Optional local open-source check)*: **Binoculars** or **Fast-DetectGPT** if GPU/Python environment is available.
   - *Note*: Respect all website Terms of Service and never bypass CAPTCHAs or anti-bot gates; if any web detector requires manual submission by the user, output an automated **Verification Worksheet** with the exact passages and a structured score-logging table so the user can paste results back for analysis.
3. **Layer 3 — Blind Human-Quality & Semantic Integrity Audit (Score 1–5 each)**:
   - Factual & Citation Fidelity (must be 5/5)
   - Natural Readability & Coherence (must be ≥ 4.5/5 — zero "paraphraser word salad")
   - Persona & Disciplinary Authenticity (must be ≥ 4.5/5)
   - Rhetorical Substance (did removing AI fluff sharpen or weaken the argument?)
4. **Layer 4 — Cross-Detector Failure Diagnosis & Iterative Refinement**:
   - Whenever ANY detector flags a transformed passage >15% AI (or highlights specific sentences), inspect the exact flagged sentences, identify the missed syntactic/discourse/probability pattern, update the skill rules, and re-test until the **median score across ALL detectors is <10% AI** (with **no single detector >20%** and **zero degradation in human readability**).

---

## PHASE 5: SELF-UPDATING & CONTINUOUS EVOLUTION MECHANISM

AI models and AI detectors co-evolve every quarter. A static humanizer skill becomes detectable within months as detectors retrain on its output patterns. Therefore, **embed an explicit Self-Updating Protocol directly inside the skill**:

1. **Failure Telemetry Log (`benchmarks/failure-log.jsonl` or `.md`)**:
   - Every time a user reports a sentence or document flagged by any detector (ZeroGPT, GPTZero, Turnitin, Pangram, Originality, etc.), log: `[date, detector_name, score, model_used, persona_profile, flagged_excerpt, suspected_trigger_pattern]`.
2. **Periodic Corpus & Literature Refresh Command (`scripts/corpus_refresh.*`)**:
   - Provide a runnable script + workflow trigger (`"update humanizer skill"` / quarterly refresh) that:
     - Pulls fresh pre-2022 human baselines + newest current-year publications from OpenAlex/arXiv/PubMed.
     - Re-computes emerging excess vocabulary (words spiking in current-year LLM releases) and new syntactic/formatting habits of the latest frontier models.
     - Searches for newly published detector architecture updates (e.g., new RAID leaderboard entries, GPTZero/Pangram release notes, Turnitin updates).
3. **Rule Drift Audit & Anti-Pattern Pruning**:
   - Identify if any rule inside the skill has itself become a detectable "humanizer fingerprint" (e.g., over-injecting short fragments, repetitive casual openers, or forced punctuation quirks).
   - Prune over-aggressive rules and recalibrate quantitative target bands.
4. **Regression-Gated Versioning**:
   - Maintain Semantic Versioning (`v1.0.0`, `v1.1.0`, etc.) in `SKILL.md` frontmatter and `benchmarks/changelog_and_scores.md`.
   - **Promotion Gate**: An update to the skill is ONLY merged if it improves or maintains pass rates across the **full multi-detector benchmark suite** AND passes the **human-readability & factual-fidelity gate** without regressions on older genres.

---

## PHASE 6: DELIVERABLES & FINAL OUTPUT CHECKLIST

Do NOT stop at theory. Produce ALL of the following complete, ready-to-use artifacts:
1. **Empirical Research Report** summarizing your corpus sizes, data sources, quantitative human-vs-AI feature comparison tables (with exact numbers, not hand-waving), and key discoveries.
2. **Complete `SKILL.md`** and all supporting `references/` files (Persona Matrix, Empirical Findings, Imperfection Calibration, Verification & Update SOP).
3. **Working Local Diagnostic & Corpus-Refresh Scripts** (`scripts/`) — tested and verified to execute cleanly with zero errors.
4. **Before-and-After Demonstration & Verification Report** on at least 2–3 contrasting personas (e.g., STEM PhD paper vs. Undergrad social science report vs. Executive business brief), showing pre/post local stylometric scores and multi-detector verification results (or ready-to-log verification sheet for manual web checks).
5. **Quick-Start Usage Guide** showing how to invoke the skill with custom profiles or with a user-supplied writing sample for voice cloning, plus how to trigger the self-update loop over time.

Begin with **Phase 1** now. Document every empirical finding before designing the skill rules.
```
