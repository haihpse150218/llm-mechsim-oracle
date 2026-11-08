// Score blind VLM verdicts against ground truth (mutant = faulty, reference/gen-pass = correct) and against the oracle.
//   node oracle/vlm_score.mjs   -> prints table, writes results/vlm_vs_oracle.json
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './serve.mjs';

const SET = process.env.VLM_SET || 'vlm';
const key = JSON.parse(fs.readFileSync(path.join(ROOT, SET, 'key.json'), 'utf8'));
const oracle = {};
for (const f of ['results/mutants.jsonl', 'results/gen.jsonl', 'results/reference.jsonl', 'results/gen_lite.jsonl', 'results/reference_lite.jsonl']) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  for (const l of fs.readFileSync(p, 'utf8').split('\n').filter(Boolean)) {
    const r = JSON.parse(l);
    oracle[r.file.replace(/\.html$/, '')] = r;
  }
}
const rows = [];
for (const [id, k] of Object.entries(key)) {
  const outP = path.join(ROOT, SET, 'out', `${id}.json`);
  if (!fs.existsSync(outP)) continue;
  let v;
  try {
    v = JSON.parse(fs.readFileSync(outP, 'utf8'));
  } catch {
    v = {verdict: 'unparseable'};
  }
  const src = k.source; // e.g. mutants/four_bar/BRANCH, reference/four_bar_ref, gen/sonnet/four_bar_s1
  const isMut = src.startsWith('mutants/');
  const orc = oracle[src.replace(/^mutants\/(\w+?)\/(\w+)$/, 'mutants/$1__$2')];
  const truth = isMut ? 'error' : orc ? (orc.pass ? 'correct' : 'error') : /^reference/.test(src) ? 'correct' : '?';
  rows.push({
    id, mech: k.mech, source: src, op: isMut ? src.split('/').pop() : '-', truth,
    vlm: v.verdict, vlmConf: v.confidence, vlmWhat: (v.errors || []).map((e) => e.what).join(' | ').slice(0, 160),
    oracle: orc ? (orc.pass ? 'correct' : 'error') : '?', oracleFails: orc ? orc.fails.join(',') : '',
  });
}
rows.sort((a, b) => a.source.localeCompare(b.source));
const faulty = rows.filter((r) => r.truth === 'error');
const clean = rows.filter((r) => r.truth === 'correct');
const rate = (xs, f) => `${xs.filter(f).length}/${xs.length}`;
console.log('source'.padEnd(34), 'truth  ', 'VLM    ', 'oracle (fails)');
for (const r of rows) console.log(r.source.padEnd(34), r.truth.padEnd(7), String(r.vlm).padEnd(7), r.oracle, r.oracleFails ? `(${r.oracleFails})` : '');
console.log(`\nfaulty: VLM recall ${rate(faulty, (r) => r.vlm === 'error')}, oracle recall ${rate(faulty, (r) => r.oracle === 'error')}`);
console.log(`clean : VLM false-alarm ${rate(clean, (r) => r.vlm === 'error')}, oracle false-alarm ${rate(clean, (r) => r.oracle === 'error')}`);
const missed = faulty.filter((r) => r.vlm !== 'error' && r.oracle === 'error');
console.log(`VLM missed but oracle caught: ${missed.length}/${faulty.filter((r) => r.oracle === 'error').length}  [${missed.map((r) => r.mech + '/' + r.op).join(', ')}]`);
const byOp = {};
for (const r of faulty) (byOp[r.op] ||= []).push(r.vlm === 'error' ? 1 : 0);
console.log('VLM recall by fault class:', Object.entries(byOp).map(([k, v]) => `${k} ${v.reduce((a, b) => a + b, 0)}/${v.length}`).join('  '));
fs.writeFileSync(path.join(ROOT, `results/${SET}_vs_oracle.json`), JSON.stringify(rows, null, 2));
