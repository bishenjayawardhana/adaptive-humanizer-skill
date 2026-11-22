# Persona & Sociolinguistic Style Matrix

This reference provides concrete, actionable linguistic profiles for duplicating any author demographic, career stage, profession, discipline, or language background. When a user supplies an Author Profile Card (or a 300+ word reference sample for Voice Cloning), select and combine the relevant layers below.

---

## 1. Age & Career-Stage Layer

| Age / Stage | Typical Sentence Length | Burstiness (CV) | Subordination & Syntax | Lexical & Idiom Habits | Punctuation & Mechanics |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **18–22 (Undergrad / Early Adult)** | 14–21 words | 0.42–0.72 | Favors coordination (`and`, `but`, `so`, `because`) over deeply nested relative clauses; occasional direct subject-verb-object runs followed by a loose `which` clause. | Concrete nouns, plain verbs (`shows`, `looks at`, `points out`, `ends up`), mild intensifiers (`fairly`, `pretty clear`, `really`), rare Latinate abstractions unless required by the syllabus. | Prefers commas and periods; rarely uses semicolons or colons properly; occasional parenthetical clarification; avoids ornate em-dash flair. |
| **23–30 (Grad Student / Junior Researcher)** | 19–27 words | 0.38–0.65 | Dense technical noun phrases; heavier use of parenthetical citations and methodological qualifiers; occasional over-qualification (`while this does not conclusively prove...`). | High domain jargon fidelity, careful empirical verbs (`correlates with`, `diverges from`, `accounts for`), low colloquialism in Methods/Results, slightly freer voice in Discussion. | Regular use of parentheses, hyphens in compound modifiers, occasional semicolons in citation lists; disciplined adherence to APA/IEEE/Chicago style. |
| **31–49 (Mid-Career Practitioner / Analyst / Faculty)** | 15–25 words | 0.44–0.74 | Pragmatic economy: cuts throat-clearing; opens paragraphs directly with claims or evidence; contrasts short verdicts (6–10 words) with dense analytical sentences (30–42 words). | Domain-native shorthand, crisp active verbs (`tracks`, `caps`, `erodes`, `flags`), willingness to state limitations bluntly (`the sample is too small to settle this`). | Clean colons for explanations, restrained parentheses, selective dashes or semicolons; skips filler transition adverbs when logic speaks for itself. |
| **50+ (Senior Academic / Executive / Veteran Specialist)** | 12–19w (Exec) OR 21–32w (Academic) | 0.42–0.78 | *Senior Academic*: periodic sentences with fronted subordinate clauses, historical cross-references, nuanced parenthetical asides. *Senior Executive*: clipped, high-signal declarative sentences and direct recommendations. | Broader cross-disciplinary vocabulary without trendy buzzwords; comfortable using first-person judgment (`In my view`, `We saw the same pattern in 2008`) where genre allows. | Traditional punctuation: crisp semicolons separating balanced independent clauses, formal colons, traditional spacing/spelling conventions. |

---

## 2. Role & Profession Layer

### A. Academic Researcher (STEM / Biomedical)
- **Voice & Stance**: Evidence-first; claims scale strictly to the sample size, p-value, or error bar. Avoids cheerleading adjectives (*groundbreaking, transformative, remarkable*).
- **Register Shift by Section**:
  - *Introduction*: Moves rapidly from narrow gap → concrete question → what this paper actually measured (no "Since the dawn of civilization..." hooks).
  - *Methods*: Ultra-compressed, reproducible, heavier acceptable passive voice (*"Samples were centrifuged at 3,000 rpm"*), exact units, minimal transitions.
  - *Discussion*: Higher first-person (*"We observed"*, *"Our data leave open..."*), explicit comparison with named prior studies, candid acknowledgment of confounding variables.

### B. Academic Researcher (Humanities / Qualitative Social Science)
- **Voice & Stance**: Interpretive, argumentative, comfortable with ambiguity without using RLHF clichés. Engages specific scholars by surname rather than "some critics argue".
- **Syntax**: Longer reflective sentences punctuated by short emphatic reframings; rich quotation integration; fewer bullet points; discursive paragraphs of genuinely uneven length.

### C. Undergraduate / Coursework Writer
- **Voice & Stance**: Grounded in assigned readings/lecture concepts rather than omniscient mastery; builds arguments step-by-step; occasionally circles back to restate the assignment thesis in plain English.
- **Tells to Avoid**: Never sound like a tenured journal editor OR a corporate keynote speaker. Drop words like *paradigm, epistemic, multifaceted, empirical provenance* unless they appear directly in the course prompt.

### D. Corporate / Business / Financial Analyst
- **Voice & Stance**: Decision-oriented; leads with the bottom line, dollar/percentage impact, and operational risk. Uses concrete metrics, quarters, cohorts, and unit economics instead of vague strategy buzzwords.
- **Syntax**: Short-to-medium sentences; occasional crisp 5–8 word takeaway lines; structured tables or terse bullets ONLY when comparing numbers/options—never padded 3-sentence "Bold Label: Explanation" bullet lists.

### E. Legal / Policy Researcher
- **Voice & Stance**: Narrowly scoped, precedent-anchored, precise conditional framing (*"Under Section 4(b)..."*, *"Absent statutory amendment..."*). Distinguishes statutory text, administrative guidance, and empirical effect cleanly.
- **Syntax**: Controlled nested conditionals where legal precision requires them, offset by crisp topic sentences stating the holding or policy bottleneck.

### F. Software / Systems Engineer (Technical Report / Post-Mortem / RFC)
- **Voice & Stance**: Blameless, mechanistic, concrete. Talks about latency percentiles (`p99`), queue depth, lock contention, memory pressure, and trade-offs instead of "seamless scalability".
- **Syntax**: Direct active voice, concrete causal chains (*"Once the connection pool saturated, retries amplified load by 4x"*), occasional parenthetical implementation notes.

---

## 3. Language Background Layer (L1 Varieties & L2/ESL Profiles)

### L1 Regional Conventions
- **US English**: `-ize`, `color`, `analyze`, periods/commas inside quotation marks, `data` frequently singular in business / plural in strict science.
- **UK / Commonwealth English**: `-ise` (or Oxford `-ize` consistently), `colour`, `analyse`, logical punctuation outside quotation marks, `whilst` (sparingly), `amongst`, `learnt`, `programme` (non-computing).
- **South Asian Academic English**: Clear formal precision, occasional preference for constructions like `prepone` (informal), `as compared to`, `with respect to`, `in the context of`, formal British-influenced spelling.

### Authentic L2 / ESL Academic Profiles — Avoiding the Detector False-Positive Trap
> **Critical Empirical Warning (Stanford ESL Bias Research):** Commercial detectors (especially ZeroGPT and legacy GPTZero models) falsely flag genuine non-native English writing at elevated rates because ESL writers often use a smaller, higher-probability pool of safe verbs (`make`, `get`, `use`, `show`, `help`) and uniform sentence structures, lowering statistical perplexity!

To write an **authentic L2/ESL academic persona that STILL passes AI detectors**:
1. **Keep vocabulary direct and unpretentious**, using natural high-frequency academic verbs (`show`, `find`, `suggest`, `reduce`, `increase`) and avoiding ornate native idioms or LLM buzzwords.
2. **Preserve authentic L2 structural habits** *selectively* (slightly more direct S-V-O clauses, occasional mild collocation variation like *"do an experiment"* or *"has a strong effect on"*, clear explicit logical sequencing like *"First... Second..."* rather than *"Furthermore... Moreover..."*).
3. **Compensate for simpler vocabulary with REAL human syntactic burstiness and specificity**: mix short concrete empirical statements (7–11 words) with longer data-rich sentences (26–38 words), inject exact domain specifics/numbers/citations, and avoid symmetrical AI paragraph templates. That raises human structural variance without breaking the ESL voice!

---

## 4. Voice Cloning Protocol (When the User Supplies a Writing Sample)

Whenever the user provides **300+ words** of their own prior writing (or a target author's paper), extract a **Style DNA Card** BEFORE rewriting:

1. **Run `scripts/stylometry-audit.mjs`** on the user's reference sample to record exact numerical targets:
   - `sentMean`, `sentCV`, `shortSentPct`, `longSentPct`, `mattr50`, `firstPersonPer1k`, `passiveIndicatorPer1k`, `emDashesPer1k`, `semicolonsPer1k`, `parentheticalsPer1k`.
2. **Extract Qualitative Micro-Habits** from the sample:
   - Favorite transition words (e.g., does the author prefer `Still,`, `Yet`, `Even so,`, `That said,`, or zero openers?).
   - Paragraph opening style (claim-first, evidence-first, question-first, concession-first?).
   - Punctuation signature (uses parentheses often? avoids semicolons? uses colons to introduce examples? Oxford comma yes/no?).
   - Lexical comfort level (plain-spoken, moderately formal, heavily theoretical?).
   - Citation / evidence habits (leads with author name or puts citation at end of sentence?).
3. **Lock the Style DNA Card** as the highest-priority target in Step 5 & Step 6 of `SKILL.md` — overriding generic persona defaults wherever the user's real sample provides direct evidence.
