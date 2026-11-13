// Phase 4 — iterative repair (RQ3b). Arms:
//   oracle_spec   : oracle-gated, specific feedback (per-check diagnostics: which link/joint, expected vs drawn, when)
//   oracle_coarse : oracle-gated, phase-3 style feedback (check name, measured value, tolerance)
//   vlm           : VLM-in-the-loop (blind contact-sheet review each round; stop when the VLM says "correct")
//   oracle_locate : ablation — oracle_spec diagnostics with the correct values removed (says WHERE, not WHAT)
//   none          : self-refine (generic "re-check" prompt; stop when the repairer replies NO_CHANGE)
// Every round is graded by the oracle for every arm (the grade is shown to the repairer only in oracle arms).
//
//   node oracle/iter_repair.mjs prep                     copy the 7 faulty originals into iter/<arm>/<model>/<file>.html (round 0)
//   node oracle/iter_repair.mjs grade <round>            run oracle on all arms' current files -> iter/results/r<round>.jsonl, snapshot <file>.r<round>.html
//   node oracle/iter_repair.mjs plan <round>             decide who continues; write <file>.fb<round+1>.md and iter/tasks_r<round+1>.json
//        (vlm arm: needs iter/vlm/out for that round, see "vlm-prep"/"vlm-read")
//   node oracle/iter_repair.mjs vlm-prep <round>         contact sheets of active vlm-arm files + blind ids (iter/vlm/r<round>/)
//   node oracle/iter_repair.mjs summary                  table of pass per arm per round
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {ROOT} from './serve.mjs';

const K = 3; // max repair rounds
// ARMS env (comma list) selects arms, e.g. ARMS=oracle_locate for the feedback-specificity ablation
const ARMS = process.env.ARMS ? process.env.ARMS.split(',') : ['oracle_spec', 'oracle_coarse', 'vlm', 'none'];
// phase 5: ITER_DIR=iter5/rep1 (relative to the pilot dir) with <ITER_DIR>/faulty.json = ["model/file", ...]
const IT = process.env.ITER_DIR ? path.resolve(ROOT, process.env.ITER_DIR) : path.join(ROOT, 'iter');
const FAULTY = fs.existsSync(path.join(IT, 'faulty.json')) ? JSON.parse(fs.readFileSync(path.join(IT, 'faulty.json'), 'utf8')) : [
  'sonnet/four_bar_s2', 'sonnet/jansen_s1', 'sonnet/jansen_s2',
  'haiku/jansen_s1', 'haiku/jansen_s2', 'haiku/planetary_s1', 'sonnet/geneva_s2',
];
const statePath = path.join(IT, 'state.json');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const loadState = () => (fs.existsSync(statePath) ? rd(statePath) : {});
const saveState = (s) => fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
const fileOf = (arm, src) => path.join(IT, arm, src + '.html');
const relOf = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

const DESC = {
  LOAD: 'the page failed to load or never set SIM_READY',
  META: 'structural invariant (no ground truth needed)',
  PARAM: 'drawing vs the SIM.params you declared',
  DESIGN: 'engineering design rule for this machine',
  GT: 'position vs the kinematic solution computed from your SIM.params',
  PANEL: 'panel number vs the kinematic solution',
};
const HEAD = 'Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions).';

function coarse(r) {
  if (r.pass) return `${HEAD} All automatic checks passed.\n`;
  const lines = [`${HEAD} Failed checks:`];
  if (r.load?.ok === false) lines.push(`- LOAD (${DESC.LOAD}): ${r.load.reason || r.load.renderErr || 'missing markers ' + (r.load.missing || []).join(', ')}${r.load.errors?.length ? `; console errors: ${r.load.errors.join(' | ')}` : ''}`);
  for (const c of r.checks.filter((c) => !c.pass)) lines.push(`- ${c.family} (${DESC[c.family]}): "${c.name}" measured ${+c.value.toPrecision(3)}, tolerance ${+c.tol.toPrecision(3)}`);
  if (r.checks.some((c) => c.family === 'DESIGN' && c.name.startsWith('holy'))) lines.push('  (holy-number check compares your SIM.params.len to the published Jansen link lengths, allowing uniform scale and mirroring)');
  return lines.join('\n') + '\n';
}
function specific(r) {
  if (r.pass) return `${HEAD} All automatic checks passed.\n`;
  const lines = [`${HEAD} Failed checks, with diagnostics:`];
  if (r.load?.ok === false) {
    lines.push(`- LOAD (${DESC.LOAD}): ${r.load.reason || ''}${r.load.renderErr ? ` render(t) threw: ${r.load.renderErr}` : ''}${r.load.missing?.length ? ` missing named markers: ${r.load.missing.join(', ')}` : ''}`);
    if (r.load.errors?.length) lines.push(`  console errors (first ${r.load.errors.length}): ${r.load.errors.join(' | ')}`);
  }
  for (const c of r.checks.filter((c) => !c.pass)) {
    lines.push(`- ${c.family} (${DESC[c.family]}): "${c.name}" measured ${+c.value.toPrecision(3)}, tolerance ${+c.tol.toPrecision(3)}`);
    if (c.detail) lines.push(`  diagnosis: ${c.detail}`);
  }
  return lines.join('\n') + '\n';
}
// ablation: keep WHERE (which link/joint/marker/panel, drawn values, swapped-pair hints), drop WHAT (published/solved/expected values)
export function locateDetail(d) {
  if (!d) return d;
  if (d.startsWith('best-fit uniform scale')) {
    const items = d.replace(/^.*?Links that do not match at this scale:\s*/, '').split('; ').map((it) => {
      let m;
      if ((m = it.match(/^(len\.\w+) = [^,]*, expected [\d.]+ mm( \(looks swapped with len\.\w+\))?$/))) return m[1] + (m[2] || '');
      if (it.startsWith('X - O')) return 'the fixed pivot X is misplaced relative to the crank centre O';
      return it;
    });
    return `your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: ${items.join('; ')}`;
  }
  return d
    .replace(/; solving (.*?) puts (\w+) at \([^)]*\)$/, '; that is not where solving $1 puts $2')
    .replace(/, the foot T from your SIM\.params is at [^(]*\(and drawn at [^)]*\)$/, ', which does not match the foot T solved from your SIM.params')
    .replace(/, the solution from your params puts (\w+) at \([^)]*\)$/, ', which is not where the solution from your params puts $1')
    .replace(/, expected [-\d.]+ deg$/, ', which is not the required carrier rotation')
    .replace(/must turn at omega\*Zs\/\(Zs\+Zr\) = [\d.]+ rad\/s/, 'must turn at omega*Zs/(Zs+Zr)')
    .replace(/, the law from your params gives [-\d.]+ mm$/, ', which does not follow the lift law from your params');
}
function locate(r) {
  return specific({...r, checks: r.checks.map((c) => ({...c, detail: locateDetail(c.detail)}))});
}
const NONE = 'Review report: a reviewer suspects this simulator may contain errors but gave no details. Re-check it carefully against the specification and real-world knowledge of this machine, and fix anything that is wrong. If after careful checking you are confident nothing is wrong, make no change.\n';
function vlmText(v) {
  if (!v) return 'Visual review report: the page did not render any frames (blank screen), so nothing could be reviewed.\n';
  if (v.verdict !== 'error') return 'Visual review report (an engineer looked at 12 rendered frames over one revolution): no errors found.\n';
  return 'Visual review report (an engineer looked at 12 rendered frames over one revolution). Problems found:\n' + v.errors.map((e) => `- ${e.what} (frames ${e.frames.join(', ')})`).join('\n') + '\n';
}
// round-0 VLM reviews are the phase-2 ones (same originals)
function phase2Vlm(src) {
  for (const set of ['vlm_lite', 'vlm_lite5']) {
    if (!fs.existsSync(path.join(ROOT, set, 'key.json'))) continue;
    const key = rd(path.join(ROOT, set, 'key.json'));
    for (const [id, k] of Object.entries(key)) if (k.source === 'gen_lite/' + src) {
      const p = path.join(ROOT, set, 'out', `${id}.json`);
      return fs.existsSync(p) ? rd(p) : null;
    }
  }
  return null;
}
function vlmReview(round, arm, src) {
  if (round === 0 && !fs.existsSync(path.join(IT, 'vlm', 'r0', 'key.json'))) return phase2Vlm(src);
  const key = rd(path.join(IT, 'vlm', `r${round}`, 'key.json'));
  for (const [id, k] of Object.entries(key)) if (k.source === `${arm}/${src}`) {
    const p = path.join(IT, 'vlm', `r${round}`, 'out', `${id}.json`);
    return fs.existsSync(p) ? rd(p) : null; // null = sheet failed (blank)
  }
  return null;
}
const reply = (arm, src, round) => {
  const p = path.join(IT, arm, `${src}.reply${round}.txt`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() : null;
};

const cmd = process.argv[2];
const round = Number(process.argv[3]);
const st = loadState();

if (cmd === 'prep') {
  for (const arm of ARMS) for (const src of FAULTY) {
    fs.mkdirSync(path.dirname(fileOf(arm, src)), {recursive: true});
    fs.copyFileSync(path.join(ROOT, 'gen_lite', src + '.html'), fileOf(arm, src));
    (st[arm] ||= {})[src] = {active: true, stopRound: null, stopReason: null};
  }
  saveState(st);
  console.log('prepared', ARMS.length * FAULTY.length);
} else if (cmd === 'grade') {
  const files = [];
  for (const arm of ARMS) for (const src of FAULTY) {
    const f = fileOf(arm, src);
    fs.copyFileSync(f, f.replace(/\.html$/, `.r${round}.html`));
    files.push(relOf(f));
  }
  fs.mkdirSync(path.join(IT, 'results'), {recursive: true});
  const out = path.join(IT, 'results', `r${round}.jsonl`);
  if (fs.existsSync(out)) fs.unlinkSync(out);
  execFileSync('node', [path.join(ROOT, 'oracle/run_oracle_lite.mjs'), ...files, '--out', out, '--quiet'], {cwd: ROOT, stdio: 'inherit'});
} else if (cmd === 'plan') {
  const res = Object.fromEntries(fs.readFileSync(path.join(IT, 'results', `r${round}.jsonl`), 'utf8').split('\n').filter(Boolean)
    .map((l) => JSON.parse(l)).map((r) => [r.file, r]));
  const tasks = [];
  for (const arm of ARMS) for (const src of FAULTY) {
    const s = st[arm][src];
    if (!s.active) continue;
    const r = res[relOf(fileOf(arm, src))];
    let stop = null, fb = null;
    if (round >= K) {
      stop = r.pass ? 'oracle pass (final)' : `budget (${K} rounds)`;
    } else if (arm.startsWith('oracle_')) {
      if (r.pass) stop = 'oracle pass';
      else fb = arm === 'oracle_spec' ? specific(r) : arm === 'oracle_locate' ? locate(r) : coarse(r);
    } else if (arm === 'vlm') {
      const v = vlmReview(round, arm, src);
      if (v && v.verdict !== 'error') stop = 'vlm says correct';
      else fb = vlmText(v);
    } else {
      const rp = round > 0 ? reply(arm, src, round) : null;
      if (rp && /^NO_CHANGE/i.test(rp)) stop = 'repairer: no change';
      else fb = NONE;
    }
    if (!stop && round >= K) stop = `budget (${K} rounds)`;
    if (stop) {
      Object.assign(s, {active: false, stopRound: round, stopReason: stop});
      continue;
    }
    const fbPath = path.join(IT, arm, `${src}.fb${round + 1}.md`);
    fs.writeFileSync(fbPath, fb);
    const [model, file] = src.split('/');
    tasks.push({arm, model, mech: file.replace(/_s\d+$/, ''), file: relOf(fileOf(arm, src)),
      history: Array.from({length: round + 1}, (_, i) => relOf(path.join(IT, arm, `${src}.fb${i + 1}.md`))),
      reply: relOf(path.join(IT, arm, `${src}.reply${round + 1}.txt`))});
  }
  saveState(st);
  fs.writeFileSync(path.join(IT, `tasks_r${round + 1}.json`), JSON.stringify(tasks, null, 2));
  console.log(`round ${round + 1}: ${tasks.length} repair tasks`, tasks.reduce((a, t) => ({...a, [t.arm]: (a[t.arm] || 0) + 1}), {}));
} else if (cmd === 'vlm-prep') {
  const dir = path.join(IT, 'vlm', `r${round}`);
  fs.mkdirSync(path.join(dir, 'inputs'), {recursive: true});
  fs.mkdirSync(path.join(dir, 'out'), {recursive: true});
  const act = FAULTY.filter((src) => st.vlm[src].active);
  const sheetDir = path.join(dir, 'sheets');
  execFileSync('node', [path.join(ROOT, 'oracle/sheet.mjs'), ...act.map((s) => relOf(fileOf('vlm', s))), '--outdir', sheetDir], {cwd: ROOT, stdio: 'inherit'});
  const key = {};
  for (const src of act) {
    const sheet = path.join(sheetDir, relOf(fileOf('vlm', src)).replace(/\//g, '__').replace(/\.html$/, '.png'));
    if (!fs.existsSync(sheet)) continue;
    const mech = src.split('/')[1].replace(/_s\d+$/, '');
    const id = `${mech}-${crypto.createHash('sha1').update(`r${round}/${src}`).digest('hex').slice(0, 8)}`;
    fs.copyFileSync(sheet, path.join(dir, 'inputs', `${id}.png`));
    key[id] = {source: `vlm/${src}`, mech};
  }
  fs.writeFileSync(path.join(dir, 'key.json'), JSON.stringify(key, null, 2));
  console.log(JSON.stringify(Object.keys(key)));
} else if (cmd === 'summary') {
  const rows = [];
  for (let r = 0; r <= K; r++) {
    const p = path.join(IT, 'results', `r${r}.jsonl`);
    if (!fs.existsSync(p)) break;
    const res = Object.fromEntries(fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((x) => [x.file, x]));
    for (const arm of ARMS) rows.push({round: r, arm, pass: FAULTY.filter((src) => res[relOf(fileOf(arm, src))]?.pass).length, of: FAULTY.length,
      per: Object.fromEntries(FAULTY.map((src) => [src, res[relOf(fileOf(arm, src))]?.fails.join(',') || 'PASS']))});
  }
  console.log(JSON.stringify({rows, state: st}, null, 1));
} else console.log('usage: prep | grade <r> | plan <r> | vlm-prep <r> | summary');
