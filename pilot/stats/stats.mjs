// Statistics for the pilot (RQ1-RQ4).  node stats/stats.mjs  -> stats/STATS.md + stats/stats.json
// Unit of analysis for repair (RQ3/RQ4) = one file-run (a faulty file in one repetition); every arm was run on the
// same file-runs, so arms are compared as paired binary outcomes (final oracle PASS after <= 3 rounds).
//   Cochran's Q across arms, exact McNemar per pair (Holm-adjusted), Wilson 95% CIs, Fisher exact for 2x2 between groups.
// Phase 5 (iter5/rep1, rep2) + phase 6 locate (iter5/abl1 = rep1 files, abl2 = rep2 files); geneva_s2 is excluded
// (its error is outside the marker contract, oracle-invisible). Phase 7 lambda = iter7/rep1 (no VLM arm).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

// ---------- math ----------
const lnFact = (() => { const c = [0]; for (let i = 1; i <= 400; i++) c[i] = c[i - 1] + Math.log(i); return (n) => c[n]; })();
const choose = (n, k) => Math.exp(lnFact(n) - lnFact(k) - lnFact(n - k));
function wilson(x, n, z = 1.959964) {
  if (!n) return [NaN, NaN];
  const p = x / n, d = 1 + (z * z) / n, c = (p + (z * z) / (2 * n)) / d, h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}
// exact McNemar: b = A pass & B fail, c = A fail & B pass; two-sided binomial(b+c, 1/2)
function mcnemar(b, c) {
  const n = b + c;
  if (!n) return 1;
  let s = 0;
  for (let i = 0; i <= Math.min(b, c); i++) s += choose(n, i);
  return Math.min(1, (2 * s) / 2 ** n);
}
// regularized upper incomplete gamma Q(a, x) -> chi-square survival
function gammaQ(a, x) {
  if (x <= 0) return 1;
  const lg = (z) => { const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = z, t = z + 5.5; t -= (z + 0.5) * Math.log(t); let s = 1.000000000190015; for (const c of g) s += c / ++y; return -t + Math.log((2.5066282746310005 * s) / z); };
  if (x < a + 1) { let sum = 1 / a, del = sum, ap = a; for (let n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-14) break; } return 1 - sum * Math.exp(-x + a * Math.log(x) - lg(a)); }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-14) break; }
  return Math.exp(-x + a * Math.log(x) - lg(a)) * h;
}
// Cochran's Q for an n x k binary matrix
function cochranQ(M) {
  const k = M[0].length, C = Array.from({length: k}, (_, j) => M.reduce((s, r) => s + r[j], 0)), R = M.map((r) => r.reduce((a, b) => a + b, 0)), N = C.reduce((a, b) => a + b, 0);
  const den = k * N - R.reduce((s, r) => s + r * r, 0);
  if (den === 0) return {Q: 0, df: k - 1, p: 1};
  const Q = ((k - 1) * (k * C.reduce((s, c) => s + c * c, 0) - N * N)) / den;
  return {Q, df: k - 1, p: gammaQ((k - 1) / 2, Q / 2)};
}
// Fisher exact two-sided for [[a,b],[c,d]]
function fisher(a, b, c, d) {
  const r1 = a + b, c1 = a + c, n = a + b + c + d;
  const pr = (x) => (choose(c1, x) * choose(n - c1, r1 - x)) / choose(n, r1);
  const p0 = pr(a);
  let s = 0;
  for (let x = Math.max(0, r1 + c1 - n); x <= Math.min(r1, c1); x++) { const p = pr(x); if (p <= p0 * (1 + 1e-9)) s += p; }
  return Math.min(1, s);
}
const holm = (ps) => { const o = ps.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0]); const out = Array(ps.length); let run = 0; o.forEach(([p, i], r) => { run = Math.max(run, Math.min(1, p * (ps.length - r))); out[i] = run; }); return out; };
const fmtP = (p) => (p < 0.001 ? p.toExponential(1) : p.toFixed(3));
const pct = (x, n) => `${x}/${n} (${Math.round((100 * x) / n)}%)`;
const ci = (x, n) => { const [l, h] = wilson(x, n); return `[${Math.round(100 * l)}, ${Math.round(100 * h)}]`; };

// ---------- data ----------
const finalPass = (dir) => {
  const s = rd(`${dir}/summary.json`);
  const R = Math.max(...s.rows.map((r) => r.round));
  const out = {};
  for (const r of s.rows.filter((r) => r.round === R)) for (const [f, v] of Object.entries(r.per)) (out[f] ||= {})[r.arm] = v === 'PASS' ? 1 : 0;
  return out;
};
const kindOf = (f) => (/jansen|lambda/.test(f) ? 'design' : 'assembly');
const runs = [];
for (const [rep, abl] of [['rep1', 'abl1'], ['rep2', 'abl2']]) {
  const a = finalPass(`iter5/${rep}`), b = finalPass(`iter5/${abl}`);
  for (const [f, arms] of Object.entries(a)) {
    if (f === 'sonnet/geneva_s2') continue;
    runs.push({phase: 5, rep, file: f, model: f.split('/')[0], mech: f.split('/')[1].replace(/_s\d+$/, ''), kind: kindOf(f), ...arms, oracle_locate: b[f].oracle_locate});
  }
}
const lam = finalPass('iter7/rep1');
for (const [f, arms] of Object.entries(lam)) runs.push({phase: 7, rep: 'rep1', file: f, model: f.split('/')[0], mech: 'lambda', kind: 'design', ...arms, vlm: null});

const ARMS5 = ['oracle_spec', 'oracle_locate', 'oracle_coarse', 'vlm', 'none'];
const ARMS4 = ['oracle_spec', 'oracle_locate', 'oracle_coarse', 'none'];
const L = (a) => a.replace('oracle_', '');
const lines = [];
const J = {};
function block(title, rs, arms, key) {
  const M = rs.map((r) => arms.map((a) => r[a]));
  const q = cochranQ(M);
  lines.push(`\n### ${title} (n = ${rs.length} file-runs)\n`, '| arm | PASS | 95% Wilson CI (%) |', '|---|---|---|');
  for (const a of arms) { const x = rs.filter((r) => r[a]).length; lines.push(`| ${L(a)} | ${pct(x, rs.length)} | ${ci(x, rs.length)} |`); }
  lines.push('', `Cochran's Q = ${q.Q.toFixed(2)}, df = ${q.df}, p = ${fmtP(q.p)}`, '', '| pair | A only | B only | exact McNemar p | Holm p |', '|---|---|---|---|---|');
  const pairs = [];
  for (let i = 0; i < arms.length; i++) for (let j = i + 1; j < arms.length; j++) {
    const b = rs.filter((r) => r[arms[i]] && !r[arms[j]]).length, c = rs.filter((r) => !r[arms[i]] && r[arms[j]]).length;
    pairs.push({A: arms[i], B: arms[j], b, c, p: mcnemar(b, c)});
  }
  const adj = holm(pairs.map((p) => p.p));
  pairs.forEach((p, i) => { p.holm = adj[i]; lines.push(`| ${L(p.A)} vs ${L(p.B)} | ${p.b} | ${p.c} | ${fmtP(p.p)} | ${fmtP(p.holm)} |`); });
  J[key] = {n: rs.length, pass: Object.fromEntries(arms.map((a) => [a, rs.filter((r) => r[a]).length])), cochran: q, pairs};
}

lines.push('# Thống kê pilot (sinh bởi `stats/stats.mjs`, 2026-11-13)', '',
  'Đơn vị: một lượt file (file lỗi × lần lặp). Mọi nhánh chạy trên cùng các lượt nên so sánh theo cặp. Kết quả = PASS oracle sau ≤ 3 vòng.',
  'Pha 5 + pha 6: 22 lượt (rep1 8 + rep2 14, bỏ geneva_s2). Pha 7: 6 lượt lambda (không có nhánh VLM).',
  '**Lưu ý phụ thuộc**: rep1 và rep2 dùng chung 8 file gốc (rep2 ⊃ rep1), nên các lượt không độc lập hoàn toàn; mục "Độ nhạy" chỉ dùng mỗi file gốc một lần.');

lines.push('\n## RQ3 — sửa lặp: 5 nhánh trên 22 lượt (pha 5–6)');
block('Tất cả lỗi oracle-thấy-được, pha 5–6', runs.filter((r) => r.phase === 5), ARMS5, 'p56_all');
block('Lỗi lắp ráp/ràng buộc (ngoài Jansen)', runs.filter((r) => r.phase === 5 && r.kind === 'assembly'), ARMS5, 'p56_assembly');
block('Jansen (tri thức thiết kế)', runs.filter((r) => r.phase === 5 && r.kind === 'design'), ARMS5, 'p56_jansen');

lines.push('\n## RQ4 — mức cụ thể của phản hồi trên lỗi tri thức thiết kế');
block('Lambda (pha 7)', runs.filter((r) => r.phase === 7), ARMS4, 'p7_lambda');
const dk = runs.filter((r) => r.kind === 'design');
block('Gộp Jansen + lambda, haiku', dk.filter((r) => r.model === 'haiku'), ARMS4, 'design_haiku');
block('Gộp Jansen + lambda, sonnet', dk.filter((r) => r.model === 'sonnet'), ARMS4, 'design_sonnet');
// model x arm interaction for locate (and coarse) on design-knowledge errors
lines.push('\n### Tương tác model × nhánh trên lỗi tri thức thiết kế (Fisher exact, sonnet vs haiku)\n', '| arm | sonnet | haiku | Fisher p |', '|---|---|---|---|');
J.model_interaction = {};
for (const a of ARMS4) {
  const s = dk.filter((r) => r.model === 'sonnet'), h = dk.filter((r) => r.model === 'haiku');
  const sp = s.filter((r) => r[a]).length, hp = h.filter((r) => r[a]).length, p = fisher(sp, s.length - sp, hp, h.length - hp);
  lines.push(`| ${L(a)} | ${pct(sp, s.length)} | ${pct(hp, h.length)} | ${fmtP(p)} |`);
  J.model_interaction[a] = {sonnet: [sp, s.length], haiku: [hp, h.length], p};
}

lines.push('\n## Độ nhạy — mỗi file gốc chỉ một lần (rep2 + lambda; bỏ rep1, abl1)');
const uniq = runs.filter((r) => r.rep === 'rep2' || r.phase === 7);
block('Tất cả, mỗi file một lần (4 nhánh chung)', uniq, ARMS4, 'uniq_all');
block('Tri thức thiết kế, haiku, mỗi file một lần', uniq.filter((r) => r.kind === 'design' && r.model === 'haiku'), ARMS4, 'uniq_design_haiku');

// ---------- RQ1 / RQ2 ----------
lines.push('\n## RQ1 — tỉ lệ lỗi tự nhiên\n', '| tập | lỗi | 95% Wilson CI (%) |', '|---|---|---|');
const nat = {'pha 1, spec chi tiết': [0, 8], 'pha 2, spec-lite': [7, 16], 'pha 5, spec-lite (60 sim)': [14, 60], 'pha 5, ngoài Jansen': [5, 50], 'pha 7, lambda': [6, 10], 'pha 7, peaucellier': [0, 10]};
for (const [k, [x, n]] of Object.entries(nat)) lines.push(`| ${k} | ${pct(x, n)} | ${ci(x, n)} |`);
const fp = fisher(0, 8, 7, 9);
lines.push('', `Spec chi tiết (0/8) vs spec-lite (7/16): Fisher p = ${fmtP(fp)}.`);
const h7 = fisher(5, 0, 1, 4);
lines.push(`Lambda haiku (5/5) vs sonnet (1/5): Fisher p = ${fmtP(h7)}.`);
J.rq1 = {nat, detailed_vs_lite_p: fp, lambda_haiku_vs_sonnet_p: h7};

lines.push('\n## RQ2 — VLM so với oracle trên 24 mutant pha 1 (theo cặp mutant)\n');
const vp = rd('results/vlm_vs_oracle.json'), vn = rd('results/vlm_nopanel_vs_oracle.json');
const mut = (a) => a.filter((r) => r.truth === 'error');
const key = (r) => r.source;
const P = Object.fromEntries(mut(vp).map((r) => [key(r), r])), N = Object.fromEntries(mut(vn).map((r) => [key(r), r]));
const ks = Object.keys(P).filter((k) => N[k]);
const hit = (r) => (r.vlm === 'error' ? 1 : 0), ohit = (r) => (r.oracle === 'error' ? 1 : 0);
const cnt = (f) => ks.filter(f).length;
const oV = [cnt((k) => ohit(P[k]) && !hit(P[k])), cnt((k) => !ohit(P[k]) && hit(P[k]))];
const pn = [cnt((k) => hit(P[k]) && !hit(N[k])), cnt((k) => !hit(P[k]) && hit(N[k]))];
const oN = [cnt((k) => ohit(P[k]) && !hit(N[k])), cnt((k) => !ohit(P[k]) && hit(N[k]))];
lines.push('| so sánh (n = ' + ks.length + ' mutant) | chỉ A bắt | chỉ B bắt | exact McNemar p |', '|---|---|---|---|',
  `| oracle vs VLM có panel | ${oV[0]} | ${oV[1]} | ${fmtP(mcnemar(...oV))} |`,
  `| VLM có panel vs ẩn panel | ${pn[0]} | ${pn[1]} | ${fmtP(mcnemar(...pn))} |`,
  `| oracle vs VLM ẩn panel | ${oN[0]} | ${oN[1]} | ${fmtP(mcnemar(...oN))} |`);
J.rq2 = {n: ks.length, oracle_vs_vlm_panel: oV, panel_vs_nopanel: pn, oracle_vs_vlm_nopanel: oN};

fs.writeFileSync(path.join(ROOT, 'stats/STATS.md'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(ROOT, 'stats/stats.json'), JSON.stringify({runs, ...J}, null, 1));
console.log(lines.join('\n'));
