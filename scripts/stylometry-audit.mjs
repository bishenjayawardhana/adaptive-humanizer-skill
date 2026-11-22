#!/usr/bin/env node
/**
 * Local Quantitative Stylometry Auditor & Persona Target Verifier.
 *
 * Audits any draft file (or stdin) against empirical pre-2022 human baselines
 * and persona-specific stylistic bands, reporting exact metrics and
 * sentence-by-sentence AI-trigger hotspots.
 *
 * Usage:
 *   node stylometry-audit.mjs --file draft.txt [--discipline computer_science] [--persona phd_researcher] [--json]
 *   node stylometry-audit.mjs --compare before.txt after.txt [--discipline economics_business]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeText } from './lib/stylometry-core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = path.join(__dirname, '..', 'data', 'empirical-baselines.json');

const PERSONA_TARGETS = {
  undergrad_student: { sentMean: [14, 21], sentCV: [0.42, 0.72], tier1Max: 0.0, transMax: 6.0 },
  phd_researcher:    { sentMean: [19, 28], sentCV: [0.38, 0.65], tier1Max: 0.0, transMax: 7.5 },
  senior_academic:   { sentMean: [20, 31], sentCV: [0.42, 0.75], tier1Max: 0.0, transMax: 6.5 },
  industry_analyst:  { sentMean: [15, 23], sentCV: [0.45, 0.75], tier1Max: 0.0, transMax: 5.5 },
  executive_brief:   { sentMean: [12, 19], sentCV: [0.45, 0.80], tier1Max: 0.0, transMax: 4.5 },
  legal_policy:      { sentMean: [22, 34], sentCV: [0.38, 0.68], tier1Max: 0.0, transMax: 8.0 },
  esl_grad_scholar:  { sentMean: [16, 24], sentCV: [0.42, 0.70], tier1Max: 0.0, transMax: 6.0 }
};

function loadBaselines() {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
}

function evaluateGates(report, personaKey, baselines, disciplineKey) {
  const gates = [];
  const pTarget = PERSONA_TARGETS[personaKey] || PERSONA_TARGETS.phd_researcher;
  const discBand = baselines?.byDiscipline?.[disciplineKey]?.pre2022Human || baselines?.overall?.pre2022Human;

  gates.push({
    check: 'Unicode Integrity (No Zero-Width / Homoglyphs)',
    value: report.integrity.cleanUnicode ? 'CLEAN' : 'TAMPERED',
    pass: report.integrity.cleanUnicode
  });

  gates.push({
    check: 'Tier-1 LLM Excess Vocabulary (/1k words)',
    value: report.lexical.tier1ExcessPer1k,
    target: `<= ${pTarget.tier1Max}`,
    pass: report.lexical.tier1ExcessPer1k <= pTarget.tier1Max
  });

  const minCV = discBand ? Math.max(0.36, discBand.sentCV.p10) : pTarget.sentCV[0];
  gates.push({
    check: 'Sentence Burstiness (CV = std/mean)',
    value: report.rhythm.sentCV,
    target: `>= ${Math.round(minCV * 100) / 100}`,
    pass: report.counts.sentences < 4 || report.rhythm.sentCV >= minCV
  });

  const structTells =
    report.syntaxAndDiscourse.negativeParallelismPer1k +
    report.syntaxAndDiscourse.trailingParticiplePer1k +
    report.syntaxAndDiscourse.formulaicClichesPer1k;
  gates.push({
    check: 'Syntactic AI Cliché Density (/1k words)',
    value: Math.round(structTells * 100) / 100,
    target: '<= 2.0',
    pass: structTells <= 2.0
  });

  gates.push({
    check: 'Explicit Additive Transition Density (/1k words)',
    value: report.syntaxAndDiscourse.explicitTransitionsPer1k,
    target: `<= ${pTarget.transMax}`,
    pass: report.syntaxAndDiscourse.explicitTransitionsPer1k <= pTarget.transMax
  });

  gates.push({
    check: 'Composite Heuristic AI-Risk Score (0-100)',
    value: report.aiRiskScore,
    target: '<= 15.0',
    pass: report.aiRiskScore <= 15.0
  });

  return gates;
}

function printHumanReport(label, report, gates) {
  console.log(`\n============================================================`);
  console.log(`STYLOMETRY AUDIT: ${label}`);
  console.log(`============================================================`);
  console.log(`Volume: ${report.counts.words} words | ${report.counts.sentences} sentences | ${report.counts.paragraphs} paragraphs`);
  console.log(`Rhythm: mean=${report.rhythm.sentMean}w, std=${report.rhythm.sentStd}w, CV=${report.rhythm.sentCV}, adjBurst=${report.rhythm.adjBurstiness}, short(<11w)=${report.rhythm.shortSentPct}%, long(>=30w)=${report.rhythm.longSentPct}%, paraCV=${report.rhythm.paraCV ?? 'n/a'}`);
  console.log(`Lexical: MATTR-50=${report.lexical.mattr50}, avgWordLen=${report.lexical.avgWordLen}, Tier1=${report.lexical.tier1ExcessPer1k}/1k [${report.lexical.tier1WordsFound.join(', ') || 'none'}], Tier2=${report.lexical.tier2InflatedPer1k}/1k [${report.lexical.tier2WordsFound.join(', ') || 'none'}]`);
  console.log(`Syntax/Discourse (/1k): transitions=${report.syntaxAndDiscourse.explicitTransitionsPer1k}, trailingPart=${report.syntaxAndDiscourse.trailingParticiplePer1k}, negParallel=${report.syntaxAndDiscourse.negativeParallelismPer1k}, triads=${report.syntaxAndDiscourse.triadsPer1k}, cliches=${report.syntaxAndDiscourse.formulaicClichesPer1k}, emDash=${report.syntaxAndDiscourse.emDashesPer1k}, passive=${report.syntaxAndDiscourse.passiveIndicatorPer1k}`);
  console.log(`\nComposite Heuristic AI-Risk Score: ${report.aiRiskScore} / 100`);

  console.log(`\n--- GATE CHECKS ---`);
  for (const g of gates) {
    const badge = g.pass ? '[PASS]' : '[FAIL]';
    console.log(`${badge} ${g.check}: ${g.value}${g.target ? ` (target: ${g.target})` : ''}`);
  }

  if (report.flaggedSentences.length > 0) {
    console.log(`\n--- FLAGGED SENTENCE HOTSPOTS (${report.flaggedSentences.length}) ---`);
    for (const f of report.flaggedSentences) {
      console.log(`  S${f.index} (${f.words}w) [${f.flags.join('; ')}]: "${f.excerpt}"`);
    }
  } else {
    console.log(`\n--- FLAGGED SENTENCE HOTSPOTS: None (0 triggers) ---`);
  }
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  const args = process.argv.slice(2);
  let filePath = null;
  let compareFiles = null;
  let discipline = 'computer_science';
  let persona = 'phd_researcher';
  let asJson = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) filePath = args[++i];
    else if (args[i] === '--compare' && args[i + 1] && args[i + 2]) {
      compareFiles = [args[++i], args[++i]];
    }
    else if (args[i] === '--discipline' && args[i + 1]) discipline = args[++i];
    else if (args[i] === '--persona' && args[i + 1]) persona = args[++i];
    else if (args[i] === '--json') asJson = true;
  }

  const baselines = loadBaselines();

  if (compareFiles) {
    const beforeText = fs.readFileSync(compareFiles[0], 'utf8');
    const afterText = fs.readFileSync(compareFiles[1], 'utf8');
    const beforeRep = analyzeText(beforeText);
    const afterRep = analyzeText(afterText);
    const beforeGates = evaluateGates(beforeRep, persona, baselines, discipline);
    const afterGates = evaluateGates(afterRep, persona, baselines, discipline);

    if (asJson) {
      console.log(JSON.stringify({ before: beforeRep, after: afterRep, beforeGates, afterGates }, null, 2));
      return;
    }
    printHumanReport(`BEFORE (${path.basename(compareFiles[0])})`, beforeRep, beforeGates);
    printHumanReport(`AFTER (${path.basename(compareFiles[1])})`, afterRep, afterGates);

    const deltaRisk = Math.round((afterRep.aiRiskScore - beforeRep.aiRiskScore) * 10) / 10;
    console.log(`\n>>> SUMMARY DELTA: AI-Risk ${beforeRep.aiRiskScore} -> ${afterRep.aiRiskScore} (${deltaRisk >= 0 ? '+' : ''}${deltaRisk}) | Burstiness CV ${beforeRep.rhythm.sentCV} -> ${afterRep.rhythm.sentCV} | Flagged Sentences ${beforeRep.flaggedSentences.length} -> ${afterRep.flaggedSentences.length}`);
    return;
  }

  const text = filePath ? fs.readFileSync(filePath, 'utf8') : await readStdin();
  const report = analyzeText(text);
  const gates = evaluateGates(report, persona, baselines, discipline);

  if (asJson) {
    console.log(JSON.stringify({ report, gates }, null, 2));
  } else {
    printHumanReport(filePath ? path.basename(filePath) : 'STDIN', report, gates);
  }
}

main().catch(err => {
  console.error('Audit error:', err);
  process.exit(1);
});
