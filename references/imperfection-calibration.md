# Calibrated Human Imperfections & Hard Integrity Anti-Patterns

A widespread myth in AI "humanizing" is that adding random typos, broken grammar, or bizarre synonyms fools AI detectors. **Empirical benchmarks (including the RAID adversarial dataset and modern Pangram/GPTZero evaluations) prove the opposite**:
1. Random spelling errors and synthetic character perturbations are explicitly trained into modern adversarial detectors as evasion signatures.
2. Typos in a peer-reviewed paper, thesis, or executive report destroy credibility with the actual human reader.

Authentic human writing is NOT defined by sloppiness—it is defined by **asymmetry, pragmatic economy, local focus shifts, and natural cognitive habits**.

---

## 1. The Three-Tier Human Imperfection Calibration Scale

Select the exact tier matching the locked Author Profile Card. Never exceed the requested tier.

### Tier 0 — Publication-Grade Human Polish
*Default for: Peer-reviewed research papers, Master's/PhD theses, legal briefs, C-suite/board reports.*
- **Zero spelling or grammatical errors.**
- **Natural human micro-traits to weave in**:
  1. **Asymmetrical groupings**: Prefer pairs (`speed and stability`) or uneven four-item lists over constant Rule-of-Three triads.
  2. **Natural noun repetition**: Humans repeat core technical nouns (`the model`, `the cohort`, `the tariff`) rather than awkwardly rotating synonyms (`the algorithm` → `the architecture` → `the computational framework` → `the system`).
  3. **Organic paragraph asymmetry**: Allow a punchy 2-sentence transition or pivot paragraph right next to a dense 7-sentence evidence paragraph.
  4. **Unwrapped endings**: Not every paragraph or section needs a neat bow-tied "takeaway" sentence summarizing what the reader just read. End a paragraph on a specific finding, limitation, or concrete contrast.
  5. **Conversational precision in margins**: Occasional sentence starting with `But`, `Yet`, or `Still,` (when making a sharp turn), or a crisp parenthetical aside `(see Table 2; though see Klein 2018 for a narrower estimate)`.
  6. **Uneven analytical depth**: Spend 5 sentences unpacking the thorny mechanism that actually matters, and only 1 sentence acknowledging an obvious background point—instead of giving every sub-point equal, robotic word counts.

### Tier 1 — Realistic Working Draft / Student / Internal Report
*Default for: Undergraduate essays, lab reports, graduate seminar drafts, internal engineering/business memos.*
- Includes all Tier 0 traits, PLUS **1–2 subtle natural draft quirks per 500 words** (never stacked in the same sentence):
  1. **Natural phrasal verbs** where formal prose would pick a stiff Latinate verb (`breaks down`, `points to`, `runs into`, `lines up with`, `holds up under`).
  2. **Slightly looser transitions**: Letting two consecutive ideas sit next to each other with an implicit bridge, or using plain spoken pivots (`That creates a problem.`, `Here is where the numbers diverge.`).
  3. **Mild structural informality**: Occasional split infinitive (`to quickly isolate`), ending a sentence cleanly on a preposition (`the threshold most teams rely on`), or a mild comma-style preference (e.g., skipping an optional comma after a short 2-word introductory phrase like `In 2019 the panel revised...`).
  4. **Mild pragmatic repetition or self-qualification**: E.g., *"The second issue is harder to pin down, mostly because the public filings stop breaking out regional costs after Q3."*
  5. **Slight uneven register**: Mixing high-precision domain terminology with completely ordinary surrounding English (real students and engineers do this constantly; LLMs inflate the surrounding English to match the jargon).

### Tier 2 — Unedited First Draft / Informal Note
*Use ONLY when explicitly requested by the user/profile (e.g., informal reflection, personal blog, rapid field notes).*
- Includes Tier 0–1 traits, PLUS:
  1. Occasional colloquialisms matching the persona's age bracket (`pretty much`, `kind of`, `a bit messy`).
  2. Occasional punctuation looseness (e.g., a parenthetical interruption with dashes or an occasional long run-on-feeling compound sentence joined cleanly with `and` / `so`).
  3. Rare, psychologically plausible mechanical slips ONLY if explicitly requested—never mangling technical terms, citations, names, or numbers.

---

## 2. Hard Integrity Invariants (NEVER VIOLATE)

Every transformation MUST obey these strict boundaries:

1. **Zero Stealth / Tampering Characters**: NEVER insert zero-width spaces (`U+200B`), soft hyphens (`U+00AD`), non-breaking spaces used as obfuscation, or Cyrillic/Greek homoglyphs (`а`, `е`, `о` replacing Latin `a`, `e`, `o`). Automated integrity scanners (Turnitin, Originality, Pangram, and our own `stylometry-audit.mjs`) immediately flag these as malicious obfuscation.
2. **Zero Thesaurus-Salad Swapping**: NEVER mechanically replace normal words with obscure synonyms (`use` → `utilize`/`employ`, `show` → `evince`, `important` → `consequential`, `people` → `individuals`/`populace`). Mechanical synonymization increases awkwardness, degrades human readability, and is easily flagged by neural classifiers.
3. **Zero Meaning / Evidence Corruption**:
   - Preserve 100% of numerical values, confidence intervals, p-values, sample sizes, dates, units, equations, and proper nouns.
   - Preserve 100% of real citations and never invent fake references or author names.
   - Preserve causal direction and hedging strength (do not turn *"associated with"* into *"caused"*).
4. **Zero Artificial Fragment Spam**: Do NOT chop every long sentence into choppy 5-word bullets just to inflate burstiness. True human burstiness comes from *meaningful* rhythm—a crisp 7-word claim framed by a 28-word analytical sentence—not staccato robotic fragments.
5. **Zero New "Humanizer Clichés"**: Never rely on repetitive fake-human crutches like starting every other paragraph with *"Honestly,"*, *"Look,"*, *"Here's the thing:"*, or *"Let's be real"*—especially in academic or professional reports! Those phrases immediately expose an amateur humanizer prompt.
