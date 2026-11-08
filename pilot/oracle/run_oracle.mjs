// Oracle v0 for LLM-generated mechanism simulators.
//   node oracle/run_oracle.mjs <file.html ...> [--mech <id>] [--out results/x.jsonl] [--quiet]
// Mechanism id is taken from --mech or from the file name prefix (slider_crank_*, four_bar_*, gear_train_*, geneva_*).
// One JSON line per file is appended to --out (if given) and a summary is printed.
import fs from 'node:fs';
import path from 'node:path';
import {MECHS, TOL, wrapPi, deg} from './mechs.mjs';
import {startServer, launch, ROOT} from './serve.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  if (i < 0) return d;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const flag = (n) => {
  const i = argv.indexOf(`--${n}`);
  if (i < 0) return false;
  argv.splice(i, 1);
  return true;
};
const forcedMech = opt('mech', null);
const outFile = opt('out', null);
const quiet = flag('quiet');
const files = argv;

export function mechOf(file) {
  const b = path.basename(file);
  return Object.keys(MECHS).find((k) => b.startsWith(k));
}

const angDiff = (a, b) => Math.abs(wrapPi(a - b));
const angDiffSym = (a, b, sym) => {
  if (!sym) return angDiff(a, b);
  const d = ((((a - b) % sym) + sym) % sym);
  return Math.min(d, sym - d);
};
const num = (txt) => {
  if (txt == null) return NaN;
  const m = String(txt).match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/i);
  return m ? Number(m[0]) : NaN;
};

// in-page probe: render(t) then read matrices + panel text
const PROBE = `window.__probe = (ts, names, qs) => ts.map((t) => {
  const out = {t, err: null, bodies: {}, panel: {}};
  try { SIM.render(t); } catch (e) { out.err = String(e && e.message || e); return out; }
  SIM.scene.updateMatrixWorld(true);
  for (const n of names) {
    const o = SIM.scene.getObjectByName(n);
    out.bodies[n] = o ? Array.from(o.matrixWorld.elements) : null;
  }
  for (const q of qs) {
    const el = document.querySelector('[data-q="' + q + '"]');
    out.panel[q] = el ? el.textContent : null;
  }
  return out;
});`;

function pose(e) {
  if (!e) return null;
  return {p: [e[12], e[13]], ang: Math.atan2(e[1], e[0]), tilt: Math.hypot(e[2], e[6]) / Math.hypot(e[0], e[1], e[2])};
}

function seededShuffle(a, seed = 12345) {
  const r = a.slice();
  let s = seed;
  for (let i = r.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export async function checkFile(page, url, mech) {
  const res = {load: {}, checks: {}, fails: []};
  const errors = [];
  const onErr = (e) => errors.push(String(e.message || e));
  const onCon = (m) => {
    if (m.type() === 'error') errors.push(m.text());
  };
  page.on('pageerror', onErr);
  page.on('console', onCon);
  try {
    await page.goto(url + '?capture', {waitUntil: 'load', timeout: 20000});
    await page.waitForFunction(() => window.SIM_READY === true && window.SIM && typeof window.SIM.render === 'function', null, {timeout: 15000});
  } catch (e) {
    res.load = {ok: false, reason: String(e.message).split('\n')[0], errors: errors.slice(0, 5)};
    res.fails.push('load');
    page.off('pageerror', onErr);
    page.off('console', onCon);
    return res;
  }
  await page.evaluate(PROBE);
  const names = mech.bodies.map((b) => b.name);
  const qs = mech.panel.map((p) => p.q);
  const probe = (ts) => page.evaluate(([ts, n, q]) => window.__probe(ts, n, q), [ts, names, qs]);

  const T = mech.systemPeriod;
  const N = 96;
  const grid = Array.from({length: N}, (_, k) => (k * T) / N + 0.0137);
  const fwd = await probe(grid);
  const missing = names.filter((n) => fwd[0].bodies[n] == null);
  const missingPanel = qs.filter((q) => fwd[0].panel[q] == null);
  const renderErr = fwd.find((s) => s.err)?.err || null;
  res.load = {ok: !renderErr && missing.length === 0, missingBodies: missing, missingPanel, renderErr, errors: errors.slice(0, 5)};
  if (!res.load.ok) {
    res.fails.push('load');
    page.off('pageerror', onErr);
    page.off('console', onCon);
    return res;
  }

  // --- metamorphic: determinism (order independence + repeat) ---
  const shuffled = seededShuffle(grid);
  const sh = await probe(shuffled);
  const rev = await probe(grid.slice().reverse());
  const byT = (arr) => new Map(arr.map((s) => [s.t, s]));
  const mS = byT(sh), mR = byT(rev);
  let detMax = 0, detPanel = 0;
  for (const s of fwd) {
    for (const other of [mS.get(s.t), mR.get(s.t)]) {
      for (const n of names) {
        const a = s.bodies[n], b = other.bodies[n];
        for (let i = 0; i < 16; i++) detMax = Math.max(detMax, Math.abs(a[i] - b[i]));
      }
      for (const q of qs) if (s.panel[q] !== other.panel[q]) detPanel++;
    }
  }
  res.checks.determinism = {maxMatrixDiff: detMax, panelMismatches: detPanel};
  if (detMax > 1e-3 || detPanel > 0) res.fails.push('determinism');

  // --- metamorphic: periodicity ---
  const pts = grid.filter((_, k) => k % 8 === 0);
  const later = await probe(pts.map((t) => t + T));
  let perPos = 0, perAng = 0, perPanel = 0;
  pts.forEach((t, k) => {
    const a = fwd[grid.indexOf(t)], b = later[k];
    for (const n of names) {
      const pa = pose(a.bodies[n]), pb = pose(b.bodies[n]);
      perPos = Math.max(perPos, Math.hypot(pa.p[0] - pb.p[0], pa.p[1] - pb.p[1]));
      perAng = Math.max(perAng, deg(angDiff(pa.ang, pb.ang)));
    }
    for (const p of mech.panel) {
      const x = num(a.panel[p.q]), y = num(b.panel[p.q]);
      const d = p.kind === 'angle' ? Math.abs(((x - y + 540) % 360) - 180) : Math.abs(x - y);
      perPanel = Math.max(perPanel, d);
    }
  });
  res.checks.periodicity = {maxPos: perPos, maxAngDeg: perAng, maxPanel: perPanel};
  if (perPos > TOL.pos || perAng > TOL.angDeg || perPanel > TOL.panelAngDeg) res.fails.push('periodicity');

  // --- analytic: body poses ---
  const poseErr = {};
  let tiltMax = 0;
  for (const s of fwd) {
    const g = mech.gt(s.t);
    for (const n of names) {
      const p = pose(s.bodies[n]);
      const gb = g.bodies[n];
      const e = (poseErr[n] ||= {pos: 0, angDeg: 0, worstT: null});
      const dp = Math.hypot(p.p[0] - gb.p[0], p.p[1] - gb.p[1]);
      const da = deg(angDiffSym(p.ang, gb.ang, gb.sym));
      if (dp > e.pos) e.pos = dp;
      if (da > e.angDeg) { e.angDeg = da; e.worstT = s.t; }
      tiltMax = Math.max(tiltMax, p.tilt);
    }
  }
  res.checks.pose = poseErr;
  res.checks.tilt = tiltMax;
  if (Object.values(poseErr).some((e) => e.pos > TOL.pos || e.angDeg > TOL.angDeg)) res.fails.push('pose');

  // --- analytic-free structural: joint closure / mesh ---
  const struct = {};
  for (const s of fwd) {
    const get = (n, local) => {
      const e = s.bodies[n];
      return [e[0] * local[0] + e[4] * local[1] + e[12], e[1] * local[0] + e[5] * local[1] + e[13]];
    };
    const ang = (n) => pose(s.bodies[n]).ang;
    const r = mech.structural(get, ang, s.t);
    for (const [k, v] of Object.entries(r)) struct[k] = Math.max(struct[k] || 0, v);
  }
  if (mech.meshPairs) {
    for (const [a, b, za, zb] of mech.meshPairs) {
      let ua = 0, ub = 0, worst = 0;
      for (let i = 1; i < fwd.length; i++) {
        ua += wrapPi(pose(fwd[i].bodies[a]).ang - pose(fwd[i - 1].bodies[a]).ang);
        ub += wrapPi(pose(fwd[i].bodies[b]).ang - pose(fwd[i - 1].bodies[b]).ang);
        worst = Math.max(worst, Math.abs(deg(za * ua + zb * ub)) / za); // in input-gear degrees
      }
      struct[`mesh ${a}-${b} (deg)`] = worst;
    }
  }
  res.checks.structural = struct;
  const structFail = Object.entries(struct).some(([k, v]) => v > (k.includes('deg') ? TOL.structDeg : TOL.struct));
  if (structFail) res.fails.push('structural');

  // --- panel vs analytic ---
  const pErr = {};
  for (const s of fwd) {
    const g = mech.gt(s.t);
    for (const p of mech.panel) {
      const x = num(s.panel[p.q]);
      const y = g.panel[p.q];
      let d = p.kind === 'angle' ? Math.abs(((x - y + 540) % 360) - 180) : Math.abs(x - y);
      if (p.kind === 'scalar') d = Math.abs(x - y) / Math.abs(y);
      if (Number.isNaN(d)) d = Infinity;
      pErr[p.q] = Math.max(pErr[p.q] || 0, d);
    }
  }
  res.checks.panel = pErr;
  const panelFail = mech.panel.some((p) => pErr[p.q] > (p.kind === 'angle' ? TOL.panelAngDeg : p.kind === 'scalar' ? TOL.panelScalar : TOL.panelLen));
  if (panelFail) res.fails.push('panel');

  res.load.errors = errors.slice(0, 5);
  page.off('pageerror', onErr);
  page.off('console', onCon);
  return res;
}

const fmt = (x) => (typeof x === 'number' ? (Math.abs(x) >= 100 || x === 0 ? x.toFixed(0) : x.toPrecision(3)) : x);

async function main() {
  if (!files.length) {
    console.error('usage: node oracle/run_oracle.mjs <file.html ...> [--mech id] [--out f.jsonl]');
    process.exit(1);
  }
  const srv = await startServer();
  const browser = await launch();
  const ctx = await browser.newContext({viewport: {width: 960, height: 600}});
  for (const f of files) {
    const abs = path.resolve(f);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    const id = forcedMech || mechOf(abs);
    if (!id) {
      console.error(`skip ${f}: unknown mechanism`);
      continue;
    }
    const page = await ctx.newPage();
    const t0 = Date.now();
    let r;
    try {
      r = await checkFile(page, `${srv.url}/${rel}`, MECHS[id]);
    } catch (e) {
      r = {load: {ok: false, reason: 'oracle crash: ' + String(e.message).split('\n')[0]}, checks: {}, fails: ['load']};
    }
    await page.close();
    const rec = {file: rel, mech: id, pass: r.fails.length === 0, fails: r.fails, ...r, secs: (Date.now() - t0) / 1000};
    if (outFile) fs.appendFileSync(outFile, JSON.stringify(rec) + '\n');
    const pe = r.checks.pose ? Object.entries(r.checks.pose).map(([n, e]) => `${n}:${fmt(e.pos)}mm/${fmt(e.angDeg)}°`).join(' ') : '';
    console.log(`${rec.pass ? 'PASS' : 'FAIL'} ${rel} [${r.fails.join(',')}]${quiet ? '' : ` ${pe}`}`);
    if (!quiet && !rec.pass) {
      if (r.fails.includes('load')) console.log('   load:', JSON.stringify(r.load));
      if (r.checks.structural) console.log('   structural:', JSON.stringify(r.checks.structural, (k, v) => (typeof v === 'number' ? +fmt(v) : v)));
      if (r.checks.panel) console.log('   panel:', JSON.stringify(r.checks.panel, (k, v) => (typeof v === 'number' ? +fmt(v) : v)));
      if (r.checks.determinism) console.log('   det:', JSON.stringify(r.checks.determinism), 'per:', JSON.stringify(r.checks.periodicity, (k, v) => (typeof v === 'number' ? +fmt(v) : v)));
    }
  }
  await browser.close();
  srv.close();
}

if (process.argv[1] && process.argv[1].endsWith('run_oracle.mjs')) main();
