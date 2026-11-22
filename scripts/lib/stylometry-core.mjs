/**
 * Core computational stylometry & AI-signature feature extractor.
 * Grounded in Kobak et al. (Science Advances), Liang et al. (Stanford),
 * Reinhart et al., Wikipedia WikiProject AI Cleanup, and RAID stylometry literature.
 * Zero external dependencies — runs natively on Node.js 18+.
 */

export const TIER1_EXCESS_WORDS = [
  'delve', 'delves', 'delving', 'delved',
  'tapestry', 'testament', 'pivotal',
  'underscore', 'underscores', 'underscoring', 'underscored',
  'showcase', 'showcases', 'showcasing', 'showcased',
  'intricate', 'intricacies', 'multifaceted',
  'meticulous', 'meticulously', 'realm', 'realms',
  'beacon', 'symphony', 'odyssey', 'ever-evolving',
  'game-changer', 'game-changing', 'seamless', 'seamlessly',
  'holistic', 'synergy', 'cornerstone', 'linchpin',
  'interplay', 'plethora', 'myriad', 'poised',
  'burgeoning', 'spearhead', 'spearheading', 'commendable',
  'unleash', 'unleashing', 'unlocking', 'reimagine', 'reimagining'
];

export const TIER2_INFLATED_WORDS = [
  'crucial', 'vital', 'robust', 'comprehensive', 'landscape',
  'paradigm', 'foster', 'fosters', 'fostering', 'harness', 'harnesses', 'harnessing',
  'notably', 'noteworthy', 'nuanced', 'transformative', 'elucidate', 'elucidating',
  'bolster', 'bolstering', 'elevate', 'elevating', 'empower', 'empowering',
  'paramount', 'unprecedented', 'groundbreaking', 'catalyze', 'ubiquitous',
  'illuminate', 'illuminating', 'augment', 'augmenting', 'imperative',
  'endeavor', 'endeavors', 'trajectory', 'ramifications', 'profound', 'profoundly'
];

export const EXPLICIT_TRANSITIONS_RE = /^(furthermore|moreover|additionally|in addition|consequently|nevertheless|nonetheless|subsequently|ultimately|notably|conversely|correspondingly|accordingly|in summary|in conclusion|to summarize|overall|importantly|significantly|interestingly)\b/i;

export const NEGATIVE_PARALLELISM_RE = /\bnot\s+(?:just|only|merely|simply)\b[^.!?;]{1,90}\b(?:but(?:\s+also)?|yet|rather)\b/gi;

export const TRAILING_PARTICIPLE_RE = /,\s*(?:thereby\s+|thus\s+|effectively\s+|ultimately\s+)?(?:highlighting|underscoring|emphasizing|demonstrating|illustrating|reflecting|suggesting|revealing|ensuring|enabling|fostering|creating|paving|marking|signaling|reinforcing|solidifying|enhancing|shaping|showcasing|bridging|offering|providing|yielding|driving)\b/gi;

export const FORMULAIC_CLICHE_PATTERNS = [
  { name: 'meta_importance_filler', re: /\bit is (?:important|worth|essential|crucial|imperative|vital) to (?:note|recognize|understand|remember|highlight|acknowledge)\b/gi },
  { name: 'fast_paced_opener', re: /\bin today['’]s (?:fast-paced|rapidly|modern|digital|ever-evolving|increasingly|interconnected)\b/gi },
  { name: 'plays_role_bloat', re: /\bplays? a (?:pivotal|crucial|vital|key|significant|central|critical|major|indispensable) role\b/gi },
  { name: 'serves_as_testament', re: /\bserves? as a (?:testament|reminder|catalyst|beacon|cornerstone|bridge|foundation)\b/gi },
  { name: 'vague_authority', re: /\b(?:some critics argue|experts (?:agree|suggest|point out|contend)|it is widely (?:believed|recognized|acknowledged)|it has been argued that)\b/gi },
  { name: 'at_its_core', re: /\b(?:at its core|in the realm of|a rich tapestry of|pave the way for|bridge the gap between|stand as a testament|navigate the complexities)\b/gi },
  { name: 'from_x_to_y_sweep', re: /\bfrom\s+[a-z-]+\s+(?:[a-z-]+\s+)?to\s+[a-z-]+(?:\s+[a-z-]+)?,/gi }
];

export const TRIAD_RE = /\b([a-z][a-z-]{2,}),\s+([a-z][a-z-]{2,}),\s+and\s+([a-z][a-z-]{2,})\b/gi;

export const SAFETY_HEDGE_RE = /\b(?:tends? to|appears? to|can be argued|may potentially|can be considered|can be viewed as|is characterized by|is widely regarded as|one might argue)\b/gi;

export const PASSIVE_BE_RE = /\b(?:is|are|was|were|be|been|being)\s+[a-z]{3,}(?:ed|en|wn)\b/gi;

export const ZERO_WIDTH_RE = /[\u200B-\u200D\uFEFF\u00AD\u2060]/g;
export const MIXED_SCRIPT_HOMOGLYPH_RE = /[A-Za-z][\u0400-\u04FF\u0370-\u03FF]|[\u0400-\u04FF\u0370-\u03FF][A-Za-z]/g;

const TIER1_SET = new Set(TIER1_EXCESS_WORDS);
const TIER2_SET = new Set(TIER2_INFLATED_WORDS);

export function tokenizeWords(text) {
  const matches = text.toLowerCase().match(/[a-z]+(?:['’-][a-z]+)*/g);
  return matches || [];
}

export function splitParagraphs(text) {
  return text
    .split(/\r?\n\s*\r?\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0 && !/^#{1,6}\s/.test(p));
}

export function splitSentences(text) {
  // Protect common scholarly abbreviations before splitting
  const protectedText = text
    .replace(/\b(et al|e\.g|i\.e|vs|Dr|Prof|Mr|Mrs|Ms|Fig|Eq|Sec|No|Vol|pp|Inc|Ltd|Co|U\.S|U\.K)\./gi, '$1<DOT>')
    .replace(/(\d)\.(\d)/g, '$1<DOT>$2');

  const raw = protectedText
    .replace(/\r?\n+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“(\[])/)
    .map(s => s.replace(/<DOT>/g, '.').trim())
    .filter(s => tokenizeWords(s).length >= 2);

  return raw;
}

export function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function stdDev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = (p / 100) * (sortedArr.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (idx - lo);
}

/**
 * Moving-Average Type-Token Ratio (MATTR) — length-invariant lexical diversity.
 */
export function computeMATTR(words, windowSize = 50) {
  if (!words.length) return 0;
  if (words.length <= windowSize) {
    return new Set(words).size / words.length;
  }
  const counts = new Map();
  let unique = 0;
  for (let i = 0; i < windowSize; i++) {
    const w = words[i];
    const c = counts.get(w) || 0;
    if (c === 0) unique++;
    counts.set(w, c + 1);
  }
  let sumTTR = unique / windowSize;
  const windows = words.length - windowSize + 1;
  for (let i = windowSize; i < words.length; i++) {
    const outW = words[i - windowSize];
    const outC = counts.get(outW) - 1;
    counts.set(outW, outC);
    if (outC === 0) unique--;

    const inW = words[i];
    const inC = counts.get(inW) || 0;
    if (inC === 0) unique++;
    counts.set(inW, inC + 1);

    sumTTR += unique / windowSize;
  }
  return sumTTR / windows;
}

export function countMatches(text, regex) {
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  const m = text.match(re);
  return m ? m.length : 0;
}

export function analyzeText(text) {
  const words = tokenizeWords(text);
  const wordCount = words.length;
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);

  const sentLengths = sentences.map(s => tokenizeWords(s).length);
  const sentMean = mean(sentLengths);
  const sentStd = stdDev(sentLengths);
  const sentCV = sentMean > 0 ? sentStd / sentMean : 0;

  let adjDiffs = [];
  for (let i = 1; i < sentLengths.length; i++) {
    adjDiffs.push(Math.abs(sentLengths[i] - sentLengths[i - 1]));
  }
  const adjBurstiness = sentMean > 0 && adjDiffs.length ? mean(adjDiffs) / sentMean : 0;

  const shortSentPct = sentLengths.length
    ? (sentLengths.filter(l => l <= 10).length / sentLengths.length) * 100
    : 0;
  const longSentPct = sentLengths.length
    ? (sentLengths.filter(l => l >= 30).length / sentLengths.length) * 100
    : 0;

  const paraWordCounts = paragraphs.map(p => tokenizeWords(p).length);
  const paraMean = mean(paraWordCounts);
  const paraCV = paraWordCounts.length >= 2 && paraMean > 0 ? stdDev(paraWordCounts) / paraMean : null;

  const per1k = (n) => (wordCount > 0 ? (n / wordCount) * 1000 : 0);

  // Excess vocabulary tracking
  const tier1Hits = [];
  const tier2Hits = [];
  for (const w of words) {
    if (TIER1_SET.has(w)) tier1Hits.push(w);
    else if (TIER2_SET.has(w)) tier2Hits.push(w);
  }

  // Sentence-level diagnostics
  let explicitTransitionCount = 0;
  const flaggedSentences = [];

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const sWords = tokenizeWords(s);
    const flags = [];

    if (EXPLICIT_TRANSITIONS_RE.test(s)) {
      explicitTransitionCount++;
      flags.push('explicit-transition-opener');
    }
    const sT1 = sWords.filter(w => TIER1_SET.has(w));
    if (sT1.length > 0) flags.push(`tier1-excess(${[...new Set(sT1)].join(',')})`);

    const sT2 = sWords.filter(w => TIER2_SET.has(w));
    if (sT2.length >= 2) flags.push(`tier2-cluster(${[...new Set(sT2)].join(',')})`);

    if (countMatches(s, NEGATIVE_PARALLELISM_RE) > 0) flags.push('negative-parallelism');
    if (countMatches(s, TRAILING_PARTICIPLE_RE) > 0) flags.push('trailing-participle-clause');
    if (countMatches(s, TRIAD_RE) > 0) flags.push('triad-rule-of-three');

    for (const pat of FORMULAIC_CLICHE_PATTERNS) {
      if (countMatches(s, pat.re) > 0) flags.push(pat.name);
    }

    const emCount = (s.match(/—|--/g) || []).length;
    if (emCount >= 2) flags.push('em-dash-cluster');

    if (flags.length > 0) {
      flaggedSentences.push({
        index: i + 1,
        words: sWords.length,
        flags,
        excerpt: s.length > 160 ? s.slice(0, 157) + '...' : s
      });
    }
  }

  const negParallelCount = countMatches(text, NEGATIVE_PARALLELISM_RE);
  const trailingPartCount = countMatches(text, TRAILING_PARTICIPLE_RE);
  const triadCount = countMatches(text, TRIAD_RE);
  const clicheCount = FORMULAIC_CLICHE_PATTERNS.reduce((sum, p) => sum + countMatches(text, p.re), 0);
  const emDashCount = (text.match(/—|--/g) || []).length;
  const semicolonCount = (text.match(/;/g) || []).length;
  const parenCount = (text.match(/\([^)]+\)/g) || []).length;
  const safetyHedgeCount = countMatches(text, SAFETY_HEDGE_RE);
  const passiveCount = countMatches(text, PASSIVE_BE_RE);
  const firstPersonCount = words.filter(w => ['i', 'we', 'my', 'our', 'us'].includes(w)).length;

  const zeroWidthCount = (text.match(ZERO_WIDTH_RE) || []).length;
  const homoglyphCount = (text.match(MIXED_SCRIPT_HOMOGLYPH_RE) || []).length;

  const mattr50 = computeMATTR(words, 50);
  const avgWordLen = wordCount > 0 ? words.reduce((a, w) => a + w.length, 0) / wordCount : 0;

  // Heuristic Composite AI-Fingerprint Score (0 = highly human-like, 100 = strongly raw-LLM-like)
  // Calibrated from multi-feature clustering rather than any single tell
  let risk = 0;
  // 1. Burstiness penalty (low sentence variance)
  if (sentences.length >= 4) {
    if (sentCV < 0.25) risk += 22;
    else if (sentCV < 0.35) risk += 14;
    else if (sentCV < 0.42) risk += 6;
    if (adjBurstiness < 0.30) risk += 8;
  }
  // 2. Excess vocabulary penalty
  const t1Rate = per1k(tier1Hits.length);
  const t2Rate = per1k(tier2Hits.length);
  risk += Math.min(26, t1Rate * 4.5);
  risk += Math.min(12, Math.max(0, t2Rate - 3) * 1.5);
  // 3. Syntactic clichés & discourse packaging
  const structRate = per1k(negParallelCount + trailingPartCount + clicheCount);
  risk += Math.min(24, structRate * 3.5);
  // 4. Triad & explicit transition hyper-cohesion
  const transRate = per1k(explicitTransitionCount);
  if (transRate > 8) risk += Math.min(12, (transRate - 8) * 1.2);
  const triadRate = per1k(triadCount);
  if (triadRate > 4) risk += Math.min(8, (triadRate - 4) * 1.5);
  // 5. Em-dash overuse
  const emRate = per1k(emDashCount);
  if (emRate > 6) risk += Math.min(10, (emRate - 6) * 1.2);
  // 6. Paragraph symmetry penalty (when >= 3 paragraphs)
  if (paraCV !== null && paragraphs.length >= 3 && paraCV < 0.16) risk += 8;
  // 7. Tampering hard penalty
  if (zeroWidthCount > 0 || homoglyphCount > 0) risk = 100;

  const aiRiskScore = Math.round(Math.min(100, Math.max(0, risk)) * 10) / 10;

  return {
    counts: {
      words: wordCount,
      sentences: sentences.length,
      paragraphs: paragraphs.length
    },
    rhythm: {
      sentMean: round2(sentMean),
      sentStd: round2(sentStd),
      sentCV: round3(sentCV),
      adjBurstiness: round3(adjBurstiness),
      shortSentPct: round1(shortSentPct),
      longSentPct: round1(longSentPct),
      paraMeanWords: round1(paraMean),
      paraCV: paraCV === null ? null : round3(paraCV)
    },
    lexical: {
      mattr50: round3(mattr50),
      avgWordLen: round2(avgWordLen),
      tier1ExcessCount: tier1Hits.length,
      tier1ExcessPer1k: round2(t1Rate),
      tier1WordsFound: [...new Set(tier1Hits)],
      tier2InflatedCount: tier2Hits.length,
      tier2InflatedPer1k: round2(t2Rate),
      tier2WordsFound: [...new Set(tier2Hits)]
    },
    syntaxAndDiscourse: {
      explicitTransitionsPer1k: round2(transRate),
      negativeParallelismPer1k: round2(per1k(negParallelCount)),
      trailingParticiplePer1k: round2(per1k(trailingPartCount)),
      triadsPer1k: round2(triadRate),
      formulaicClichesPer1k: round2(per1k(clicheCount)),
      safetyHedgingPer1k: round2(per1k(safetyHedgeCount)),
      passiveIndicatorPer1k: round2(per1k(passiveCount)),
      firstPersonPer1k: round2(per1k(firstPersonCount)),
      emDashesPer1k: round2(emRate),
      semicolonsPer1k: round2(per1k(semicolonCount)),
      parentheticalsPer1k: round2(per1k(parenCount))
    },
    integrity: {
      zeroWidthChars: zeroWidthCount,
      mixedScriptHomoglyphs: homoglyphCount,
      cleanUnicode: zeroWidthCount === 0 && homoglyphCount === 0
    },
    aiRiskScore,
    flaggedSentences
  };
}

function round1(n) { return Math.round(n * 10) / 10; }
function round2(n) { return Math.round(n * 100) / 100; }
function round3(n) { return Math.round(n * 1000) / 1000; }
