// Deterministic baseline (no LLM): take the correct values that the oracle's full ("spec") feedback reports for a
// faulty simulator and write them into SIM.params at the moment the page publishes window.SIM. Nothing else in the
// page changes. This is the "obvious" repair a reviewer may ask about: if the oracle already knows the right numbers,
// why not patch them in?
//
//   node oracle/param_patch.mjs        -> baseline_patch/<model>/<mech>_s<k>.html (+ .patch.json), then grade with
//   node oracle/run_oracle_lite.mjs baseline_patch/*/*.html --out results/baseline_patch.jsonl
//
// Inputs: the round-1 spec feedback on the ORIGINAL generated file (iter5/rep2 covers all phase-5/6 files, iter7/rep1
// the lambda files). Values that a diagnosis states as "expected" are applied; diagnoses without a value (tooth-count
// rule, loop cannot close, runtime error, drawing inconsistent with params) cannot be patched.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCES = [
  {dir: 'iter5/rep2', skip: ['sonnet/geneva_s2']},
  {dir: 'iter7/rep1', skip: []},
];

function patchFromFeedback(text) {
  const p = {len: {}, sub: null, O4dist: null};
  for (const m of text.matchAll(/len\.(\w+) = (-?[\d.]+) mm, expected (-?[\d.]+) mm/g)) p.len[m[1]] = +m[3];
  const x = text.match(/X - O = \((-?[\d.]+), (-?[\d.]+)\) mm, expected \(\+\/-([\d.]+), (-?[\d.]+)\) mm/);
  if (x) p.sub = {cur: [+x[1], +x[2]], absx: +x[3], y: +x[4]};
  const g = text.match(/ground distance \|O2O4\| = (-?[\d.]+) mm, expected (-?[\d.]+) mm/);
  if (g) p.O4dist = +g[2];
  return p;
}

const INJECT = (patch) => `<script>
// deterministic param patch (baseline, no LLM)
(() => {
  const P = ${JSON.stringify(patch)};
  const apply = (sim) => {
    try {
      const prm = sim && sim.params; if (!prm) return;
      if (prm.len) for (const k in P.len) prm.len[k] = P.len[k];
      if (P.sub && prm.O && prm.X) {
        const sx = Math.sign(prm.X[0] - prm.O[0]) || -1;
        prm.X[0] = prm.O[0] + sx * P.sub.absx; prm.X[1] = prm.O[1] + P.sub.y;
      }
      if (P.O4dist != null && prm.O2 && prm.O4) {
        const d = Math.hypot(prm.O4[0] - prm.O2[0], prm.O4[1] - prm.O2[1]) || 1;
        prm.O4[0] = prm.O2[0] + (prm.O4[0] - prm.O2[0]) * P.O4dist / d;
        prm.O4[1] = prm.O2[1] + (prm.O4[1] - prm.O2[1]) * P.O4dist / d;
      }
    } catch (e) { console.error('param patch failed', e); }
  };
  let v;
  Object.defineProperty(window, 'SIM', {configurable: true, enumerable: true,
    get: () => v, set: (s) => { v = s; apply(s); }});
})();
</script>`;

// Variant "source": rewrite the numeric literal of each patched value in the page source (first `KEY: number`, and
// `X: [a, b]` / `O4: [a, b]` arrays), so that geometry built at load time also uses the corrected values.
function patchSource(src, patch) {
  let s = src, hits = 0, miss = [];
  const num = '-?\\d+(?:\\.\\d+)?';
  for (const [k, v] of Object.entries(patch.len)) {
    const re = new RegExp(`(\\b${k}\\s*:\\s*)(${num})`);
    if (re.test(s)) { s = s.replace(re, `$1${v}`); hits++; } else miss.push(k);
  }
  // a point may be written `KEY: [x, y]`, `KEY = [x, y]` or `KEY = {x: .., y: ..}`
  const pointRes = (key) => [
    new RegExp(`(\\b${key}\\s*[:=]\\s*\\[\\s*)(${num})(\\s*,\\s*)(${num})`),
    new RegExp(`(\\b${key}\\s*[:=]\\s*\\{\\s*x\\s*:\\s*)(${num})(\\s*,\\s*y\\s*:\\s*)(${num})`),
  ];
  const arr = (key0, f) => {
    // follow one alias such as `X: XP` to the identifier's own declaration
    const alias = s.match(new RegExp(`\\b${key0}\\s*:\\s*([A-Za-z_]\\w*)\\b(?!\\s*[:(])`));
    const keys = alias && alias[1] !== key0 ? [key0, alias[1]] : [key0];
    for (const key of keys) for (const re of pointRes(key)) {
      const m = s.match(re);
      if (!m) continue;
      const [x, y] = f(+m[2], +m[4]);
      s = s.replace(re, `$1${+x.toFixed(3)}$3${+y.toFixed(3)}`); hits++;
      return;
    }
    miss.push(key0);
  };
  const getArr = (key) => { for (const re of pointRes(key)) { const m = s.match(re); if (m) return [+m[2], +m[4]]; } return null; };
  if (patch.sub) { const O = getArr('O') || [0, 0]; arr('X', (x) => [O[0] + (Math.sign(x - O[0]) || -1) * patch.sub.absx, O[1] + patch.sub.y]); }
  if (patch.O4dist != null) {
    const O2 = getArr('O2') || [0, 0];
    arr('O4', (x, y) => { const d = Math.hypot(x - O2[0], y - O2[1]) || 1; return [O2[0] + (x - O2[0]) * patch.O4dist / d, O2[1] + (y - O2[1]) * patch.O4dist / d]; });
  }
  return {html: s, hits, miss};
}

const outSrc = path.join(ROOT, 'baseline_patch_src');
const out = path.join(ROOT, 'baseline_patch');
const rows = [];
for (const {dir, skip} of SOURCES) {
  for (const id of JSON.parse(fs.readFileSync(path.join(ROOT, dir, 'faulty.json'), 'utf8'))) {
    if (skip.includes(id)) continue;
    const [model, name] = id.split('/');
    const fb = fs.readFileSync(path.join(ROOT, dir, 'oracle_spec', model, `${name}.fb1.md`), 'utf8');
    const patch = patchFromFeedback(fb);
    const n = Object.keys(patch.len).length + (patch.sub ? 1 : 0) + (patch.O4dist != null ? 1 : 0);
    const src = fs.readFileSync(path.join(ROOT, 'gen_lite', model, `${name}.html`), 'utf8');
    const html = /<head[^>]*>/i.test(src) ? src.replace(/<head[^>]*>/i, (h) => h + '\n' + INJECT(patch)) : INJECT(patch) + '\n' + src;
    fs.mkdirSync(path.join(out, model), {recursive: true});
    fs.writeFileSync(path.join(out, model, `${name}.html`), html);
    fs.writeFileSync(path.join(out, model, `${name}.patch.json`), JSON.stringify({source: `${dir}/oracle_spec/${model}/${name}.fb1.md`, values: n, patch}, null, 1));
    const ps = patchSource(src, patch);
    fs.mkdirSync(path.join(outSrc, model), {recursive: true});
    fs.writeFileSync(path.join(outSrc, model, `${name}.html`), ps.html);
    rows.push(`${id}: ${n} value(s) to patch; source literals replaced ${ps.hits}${ps.miss.length ? ', not found: ' + ps.miss.join(' ') : ''}`);
  }
}
console.log(rows.join('\n'));
