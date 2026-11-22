#!/usr/bin/env node
/**
 * Empirical Corpus Research & Self-Updating Drift Analyzer.
 *
 * Fetches genuine pre-2022 human-written scholarly texts (2015-2021) AND
 * post-2024 texts (2024-2026) across 6 disciplines from the OpenAlex public API,
 * plus analyzes local/bundled Raw-LLM comparator samples, to compute real
 * empirical stylometric baselines (median, mean, p10-p90 target bands) and
 * excess-vocabulary surge ratios (replicating Kobak et al.'s methodology).
 *
 * Usage:
 *   node corpus-research.mjs [--per-discipline 50] [--out ../data/empirical-baselines.json]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeText, mean, percentile } from './lib/stylometry-core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DISCIPLINES = [
  { key: 'computer_science', label: 'Computer Science & Engineering', fieldId: 'fields/17' },
  { key: 'medicine', label: 'Medicine & Biomedical Sciences', fieldId: 'fields/27' },
  { key: 'economics_business', label: 'Economics, Business & Finance', fieldId: 'fields/20' },
  { key: 'psychology_social', label: 'Psychology & Social Sciences', fieldId: 'fields/32' },
  { key: 'humanities_history', label: 'Arts, History & Humanities', fieldId: 'fields/12' },
  { key: 'law_policy', label: 'Law, Political Science & Policy', fieldId: 'fields/33' }
];

const USER_AGENT = 'AdaptiveHumanizerResearch/1.0 (mailto:stylometry-research@example.org)';

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== 'object') return '';
  const words = [];
  for (const [token, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = token;
    }
  }
  return words.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

async function fetchJsonWithRetry(url, retries = 4) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      const delay = 600 * attempt;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function fetchOpenAlexDiscipline(fieldId, yearRange, targetCount) {
  const filter = `primary_topic.field.id:https://openalex.org/${fieldId},publication_year:${yearRange},has_abstract:true,language:en,type:article`;
  const perPage = Math.min(100, targetCount + 25);
  const url = `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}&per-page=${perPage}&sort=cited_by_count:desc&select=id,title,publication_year,abstract_inverted_index`;
  const data = await fetchJsonWithRetry(url);
  const texts = [];
  for (const work of (data.results || [])) {
    const abs = reconstructAbstract(work.abstract_inverted_index);
    const wc = abs.split(/\s+/).length;
    if (wc >= 95 && wc <= 600) {
      texts.push({
        id: work.id,
        year: work.publication_year,
        title: work.title,
        text: abs
      });
    }
    if (texts.length >= targetCount) break;
  }
  return texts;
}

function summarizeAnalyses(analyses) {
  const getSeries = (fn) => analyses.map(fn).filter(v => v !== null && !Number.isNaN(v)).sort((a, b) => a - b);
  const stats = (arr) => ({
    mean: round3(mean(arr)),
    median: round3(percentile(arr, 50)),
    p10: round3(percentile(arr, 10)),
    p90: round3(percentile(arr, 90))
  });

  const totalWords = analyses.reduce((s, a) => s + a.counts.words, 0);
  const totalT1 = analyses.reduce((s, a) => s + a.lexical.tier1ExcessCount, 0);
  const totalT2 = analyses.reduce((s, a) => s + a.lexical.tier2InflatedCount, 0);
  const docsWithT1 = analyses.filter(a => a.lexical.tier1ExcessCount > 0).length;

  return {
    sampleCount: analyses.length,
    totalWords,
    sentMean: stats(getSeries(a => a.rhythm.sentMean)),
    sentCV: stats(getSeries(a => a.rhythm.sentCV)),
    adjBurstiness: stats(getSeries(a => a.rhythm.adjBurstiness)),
    shortSentPct: stats(getSeries(a => a.rhythm.shortSentPct)),
    longSentPct: stats(getSeries(a => a.rhythm.longSentPct)),
    mattr50: stats(getSeries(a => a.lexical.mattr50)),
    avgWordLen: stats(getSeries(a => a.lexical.avgWordLen)),
    tier1ExcessPer1kPooled: round3(totalWords > 0 ? (totalT1 / totalWords) * 1000 : 0),
    tier2InflatedPer1kPooled: round3(totalWords > 0 ? (totalT2 / totalWords) * 1000 : 0),
    pctDocsWithTier1Excess: round2(analyses.length ? (docsWithT1 / analyses.length) * 100 : 0),
    explicitTransitionsPer1k: stats(getSeries(a => a.syntaxAndDiscourse.explicitTransitionsPer1k)),
    trailingParticiplePer1k: stats(getSeries(a => a.syntaxAndDiscourse.trailingParticiplePer1k)),
    negativeParallelismPer1k: stats(getSeries(a => a.syntaxAndDiscourse.negativeParallelismPer1k)),
    triadsPer1k: stats(getSeries(a => a.syntaxAndDiscourse.triadsPer1k)),
    formulaicClichesPer1k: stats(getSeries(a => a.syntaxAndDiscourse.formulaicClichesPer1k)),
    emDashesPer1k: stats(getSeries(a => a.syntaxAndDiscourse.emDashesPer1k)),
    passiveIndicatorPer1k: stats(getSeries(a => a.syntaxAndDiscourse.passiveIndicatorPer1k)),
    firstPersonPer1k: stats(getSeries(a => a.syntaxAndDiscourse.firstPersonPer1k)),
    aiRiskScore: stats(getSeries(a => a.aiRiskScore))
  };
}

function round2(n) { return Math.round(n * 100) / 100; }
function round3(n) { return Math.round(n * 1000) / 1000; }

// Representative unedited raw-LLM academic/report drafts across all 6 domains for direct contrast
const RAW_LLM_COMPARATOR_SAMPLES = [
  `In today's rapidly evolving technological landscape, deep learning plays a pivotal role in transforming automated diagnostic workflows across clinical environments. This comprehensive study delves into the intricate interplay between convolutional feature extraction and transformer-based attention mechanisms, thereby highlighting the critical need for scalable, transparent, and robust architectures. Furthermore, our findings underscore the multifaceted challenges associated with domain shift across heterogeneous hospital datasets. Notably, the proposed framework is not just an incremental improvement, but a testament to the transformative potential of self-supervised pretraining. Moreover, by seamlessly integrating uncertainty calibration into the inference pipeline, clinicians can harness actionable risk estimates without sacrificing diagnostic accuracy. Ultimately, these insights pave the way for trustworthy, equitable, and high-impact deployment in real-world healthcare settings.`,
  `The modern macroeconomic landscape is characterized by unprecedented volatility, underscoring the vital importance of resilient supply chain strategies. This report delves into the intricate dynamics of post-pandemic trade realignments, showcasing how firms foster operational agility across global networks. It is important to note that strategic diversification is not merely a defensive maneuver, but a cornerstone of long-term competitive advantage. Furthermore, empirical evidence suggests that organizations leveraging predictive analytics achieve streamlined inventory allocation, reduced disruption exposure, and enhanced margin stability. Consequently, executives must meticulously balance cost efficiency with structural redundancy—ensuring sustained resilience amid geopolitical uncertainty. In conclusion, these findings illuminate a clear trajectory for corporate leaders navigating an increasingly complex global economy.`,
  `Understanding cognitive load in hybrid educational environments has emerged as a paramount concern for contemporary pedagogical researchers. This investigation delves into the nuanced relationship between digital multitasking, working memory retention, and student engagement across university cohorts. Moreover, our longitudinal survey reveals that asynchronous instructional design plays a crucial role in fostering autonomous learning habits, thereby underscoring the necessity of structured scaffolding. Interestingly, the data reveal that technological fluency is not solely a function of generational familiarity, but rather a multifaceted outcome shaped by institutional support and socioeconomic context. Additionally, some critics argue that excessive platform integration may potentially erode deep reading comprehension. Overall, this study provides a comprehensive foundation for educators seeking to elevate instructional efficacy and empower diverse learners.`,
  `Contemporary constitutional jurisprudence stands at a pivotal crossroads as algorithmic decision-making permeates public administration. This paper delves into the intricate tension between administrative efficiency and procedural due process within automated welfare eligibility systems. Furthermore, an analysis of recent appellate decisions underscores the profound ramifications of opaque scoring models, revealing persistent gaps in statutory accountability. It is essential to recognize that algorithmic transparency is not just a technical specification, but a fundamental pillar of democratic legitimacy. Additionally, regulatory frameworks must foster robust auditability, clear contestation rights, and meaningful human oversight—safeguarding vulnerable citizens from systemic bias. Ultimately, these recommendations serve as a catalyst for modernizing administrative law in an increasingly automated governance realm.`,
  `Post-colonial urban historiography offers a rich tapestry of spatial negotiation, memory politics, and architectural hybridity. This essay delves into the multifaceted transformation of civic monuments in mid-twentieth-century port cities, showcasing how municipal planners sought to balance imperial legacies with nationalist aspirations. Moreover, archival correspondence underscores the intricate interplay between local merchant guilds, colonial administrators, and emerging civic associations—illuminating overlooked vectors of cultural resistance. Notably, public plazas functioned not only as sites of ceremonial display, but also as contested arenas of everyday political expression. Consequently, examining these material shifts provides a nuanced, comprehensive, and compelling perspective on how collective identity is meticulously inscribed onto the urban landscape.`,
  `Distributed consensus protocols play a crucial role in ensuring fault tolerance across modern cloud-native infrastructure. This technical report delves into the intricate trade-offs between latency, throughput, and Byzantine resilience in geo-replicated state machines. Furthermore, benchmarking results showcase that adaptive batching mechanisms significantly bolster system scalability, thereby demonstrating the viability of hybrid leaderless designs under high contention. It is worth noting that network partitioning poses a formidable challenge—necessitating meticulous protocol verification and seamless failover orchestration. Additionally, our evaluation highlights how cryptographic aggregation reduces bandwidth overhead while maintaining rigorous safety guarantees. In summary, these findings underscore a transformative paradigm shift in architecting resilient, efficient, and secure distributed databases.`
];

async function main() {
  const args = process.argv.slice(2);
  let perDiscipline = 50;
  let outPath = path.join(__dirname, '..', 'data', 'empirical-baselines.json');

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--per-discipline' && args[i + 1]) perDiscipline = parseInt(args[++i], 10);
    if (args[i] === '--out' && args[i + 1]) outPath = path.resolve(args[++i]);
  }

  console.log(`=== Adaptive Humanizer Empirical Corpus Research ===`);
  console.log(`Target: ${perDiscipline} pre-2022 human papers + ${perDiscipline} post-2024 papers per discipline (${DISCIPLINES.length} disciplines)\n`);

  const pre2022All = [];
  const post2024All = [];
  const byDiscipline = {};

  for (const disc of DISCIPLINES) {
    process.stdout.write(`Fetching ${disc.label}... `);
    const [humanDocs, recentDocs] = await Promise.all([
      fetchOpenAlexDiscipline(disc.fieldId, '2015-2021', perDiscipline),
      fetchOpenAlexDiscipline(disc.fieldId, '2024-2026', perDiscipline)
    ]);

    const humanAnalyses = humanDocs.map(d => analyzeText(d.text));
    const recentAnalyses = recentDocs.map(d => analyzeText(d.text));

    pre2022All.push(...humanAnalyses);
    post2024All.push(...recentAnalyses);

    const hSum = summarizeAnalyses(humanAnalyses);
    const rSum = summarizeAnalyses(recentAnalyses);

    byDiscipline[disc.key] = {
      label: disc.label,
      pre2022Human: hSum,
      post2024Recent: rSum,
      tier1ExcessSurgeRatio: hSum.tier1ExcessPer1kPooled > 0
        ? round2(rSum.tier1ExcessPer1kPooled / hSum.tier1ExcessPer1kPooled)
        : (rSum.tier1ExcessPer1kPooled > 0 ? 'INF_FROM_ZERO' : 1)
    };

    console.log(
      `OK (${humanDocs.length} pre-2022 vs ${recentDocs.length} post-2024 | ` +
      `Human CV=${hSum.sentCV.median}, Tier1=${hSum.tier1ExcessPer1kPooled}/1k -> Post-2024 Tier1=${rSum.tier1ExcessPer1kPooled}/1k)`
    );
  }

  const rawLlmAnalyses = RAW_LLM_COMPARATOR_SAMPLES.map(t => analyzeText(t));

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'OpenAlex Public Scholarly API (Pre-2022 Human 2015-2021 vs Post-2024 2024-2026) + Raw-LLM Comparator Battery',
    totals: {
      pre2022HumanPapers: pre2022All.length,
      post2024RecentPapers: post2024All.length,
      rawLlmComparators: rawLlmAnalyses.length
    },
    overall: {
      pre2022Human: summarizeAnalyses(pre2022All),
      post2024Recent: summarizeAnalyses(post2024All),
      rawLlmComparator: summarizeAnalyses(rawLlmAnalyses)
    },
    byDiscipline
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n=== OVERALL EMPIRICAL COMPARISON ===');
  const h = report.overall.pre2022Human;
  const r = report.overall.post2024Recent;
  const a = report.overall.rawLlmComparator;
  console.table([
    {
      Cohort: `Pre-2022 Human (n=${h.sampleCount})`,
      SentMean: h.sentMean.median,
      BurstCV: h.sentCV.median,
      Tier1Per1k: h.tier1ExcessPer1kPooled,
      Tier2Per1k: h.tier2InflatedPer1kPooled,
      PctDocsTier1: `${h.pctDocsWithTier1Excess}%`,
      ParticiplePer1k: h.trailingParticiplePer1k.mean,
      TransitionsPer1k: h.explicitTransitionsPer1k.mean,
      AvgAIRisk: h.aiRiskScore.mean
    },
    {
      Cohort: `Post-2024 Drift (n=${r.sampleCount})`,
      SentMean: r.sentMean.median,
      BurstCV: r.sentCV.median,
      Tier1Per1k: r.tier1ExcessPer1kPooled,
      Tier2Per1k: r.tier2InflatedPer1kPooled,
      PctDocsTier1: `${r.pctDocsWithTier1Excess}%`,
      ParticiplePer1k: r.trailingParticiplePer1k.mean,
      TransitionsPer1k: r.explicitTransitionsPer1k.mean,
      AvgAIRisk: r.aiRiskScore.mean
    },
    {
      Cohort: `Raw-LLM Baseline (n=${a.sampleCount})`,
      SentMean: a.sentMean.median,
      BurstCV: a.sentCV.median,
      Tier1Per1k: a.tier1ExcessPer1kPooled,
      Tier2Per1k: a.tier2InflatedPer1kPooled,
      PctDocsTier1: `${a.pctDocsWithTier1Excess}%`,
      ParticiplePer1k: a.trailingParticiplePer1k.mean,
      TransitionsPer1k: a.explicitTransitionsPer1k.mean,
      AvgAIRisk: a.aiRiskScore.mean
    }
  ]);
  console.log(`Saved empirical baseline report to: ${outPath}`);
}

main().catch(err => {
  console.error('Corpus research failed:', err);
  process.exit(1);
});
