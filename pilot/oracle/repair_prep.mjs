// RQ3 setup: for each faulty lite simulator, make repair/<arm>/<model>/<file>.html (copy of the original, to be edited)
// and <file>.feedback.md for arms: oracle | vlm | none.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './serve.mjs';

const FAULTY = [
  'gen_lite/sonnet/four_bar_s2', 'gen_lite/sonnet/jansen_s1', 'gen_lite/sonnet/jansen_s2',
  'gen_lite/haiku/jansen_s1', 'gen_lite/haiku/jansen_s2', 'gen_lite/haiku/planetary_s1', 'gen_lite/sonnet/geneva_s2',
];
const DESC = {
  LOAD: 'the page failed to load or never set SIM_READY',
  META: 'structural invariant (no ground truth needed)',
  PARAM: 'drawing vs the SIM.params you declared',
  DESIGN: 'engineering design rule for this machine',
  GT: 'position vs the kinematic solution computed from your SIM.params',
  PANEL: 'panel number vs the kinematic solution',
};
const oracle = Object.fromEntries(fs.readFileSync(path.join(ROOT, 'results/gen_lite.jsonl'), 'utf8').split('\n').filter(Boolean)
  .map((l) => JSON.parse(l)).map((r) => [r.file.replace(/\.html$/, ''), r]));
const key = JSON.parse(fs.readFileSync(path.join(ROOT, 'vlm_lite/key.json'), 'utf8'));
const vlmBySource = {};
for (const [id, k] of Object.entries(key)) {
  const p = path.join(ROOT, 'vlm_lite/out', `${id}.json`);
  if (fs.existsSync(p)) vlmBySource[k.source] = JSON.parse(fs.readFileSync(p, 'utf8'));
}

function oracleFeedback(src) {
  const r = oracle[src];
  if (r.pass) return 'Automated kinematic test report: all automatic checks passed.\n';
  const lines = ['Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks:'];
  if (r.load?.ok === false) lines.push(`- LOAD (${DESC.LOAD}): ${r.load.reason}${r.load.errors?.length ? `; console errors: ${r.load.errors.join(' | ')}` : ''}`);
  for (const c of r.checks.filter((c) => !c.pass)) lines.push(`- ${c.family} (${DESC[c.family]}): "${c.name}" measured ${+c.value.toPrecision(3)}, tolerance ${+c.tol.toPrecision(3)}`);
  if (r.checks.some((c) => c.family === 'DESIGN' && c.name.startsWith('holy'))) lines.push('  (holy-number check compares your SIM.params.len to the published Jansen link lengths, allowing uniform scale and mirroring)');
  return lines.join('\n') + '\n';
}
function vlmFeedback(src) {
  const v = vlmBySource[src.replace(/\//g, '/')];
  if (!v) return 'Visual review report: the page did not render any frames (blank screen), so nothing could be reviewed.\n';
  if (v.verdict !== 'error') return 'Visual review report (an engineer looked at 12 rendered frames over one revolution): no errors found.\n';
  return 'Visual review report (an engineer looked at 12 rendered frames over one revolution). Problems found:\n' + v.errors.map((e) => `- ${e.what} (frames ${e.frames.join(', ')})`).join('\n') + '\n';
}
const NONE = 'Review report: a reviewer suspects this simulator may contain errors but gave no details. Re-check it carefully against the specification and real-world knowledge of this machine, and fix anything that is wrong.\n';

for (const src of FAULTY) {
  const [, model, file] = src.split('/');
  for (const [arm, fb] of [['oracle', oracleFeedback(src)], ['vlm', vlmFeedback(src)], ['none', NONE]]) {
    const dir = path.join(ROOT, 'repair', arm, model);
    fs.mkdirSync(dir, {recursive: true});
    fs.copyFileSync(path.join(ROOT, src + '.html'), path.join(dir, file + '.html'));
    fs.writeFileSync(path.join(dir, file + '.feedback.md'), fb);
  }
}
console.log('prepared', FAULTY.length * 3, 'repair tasks');
