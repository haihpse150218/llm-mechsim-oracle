// Controlled fault injection into the reference simulators.  node oracle/mutate.mjs  -> mutants/<mech>__<op>.html + mutants/index.json
// Each operator is a literal source patch (find must occur exactly once). Classes:
//   DIR  wrong rotation direction       LEN  wrong link length / ratio in kinematics (mesh unchanged)
//   PHASE constant angular offset on a body   BRANCH wrong assembly branch / topology
//   PANEL panel number inconsistent with motion   STATE state carried between frames (clamped dt integration)
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './serve.mjs';

const stateful = (line, varName, expr) => [
  ['function render(t) {', 'let __last = 0, __acc = 0;\nfunction render(t) {'],
  [line, `__acc += Math.min(t - __last, 0.1); __last = t;\n  const ${varName} = ${expr};`],
];

const OPS = {
  slider_crank: {
    DIR: [['const th = (2 * Math.PI * t) / PERIOD;', 'const th = -(2 * Math.PI * t) / PERIOD;']],
    LEN: [['Math.sqrt(L * L - by * by)', 'Math.sqrt(1.21 * L * L - by * by)']],
    PHASE: [['crank.rotation.z = th;', 'crank.rotation.z = th + 0.26;']],
    BRANCH: [['rod.rotation.z = Math.atan2(-by, cx - bx);', 'rod.rotation.z = Math.atan2(by, cx - bx);']],
    PANEL: [['`${cx.toFixed(2)} mm`', '`${(cx - R).toFixed(2)} mm`']],
    STATE: stateful('const th = (2 * Math.PI * t) / PERIOD;', 'th', '(2 * Math.PI * __acc) / PERIOD'),
  },
  four_bar: {
    DIR: [['const th = (2 * Math.PI * t) / PERIOD;', 'const th = -(2 * Math.PI * t) / PERIOD;']],
    LEN: [['function solve(th) {', 'function solve(th) { const B_ = 132;']],
    PHASE: [['rocker.rotation.z = rk;', 'rocker.rotation.z = rk + 0.26;']],
    BRANCH: [['bx: ax + aa * ux - h * uy, by: ay + aa * uy + h * ux', 'bx: ax + aa * ux + h * uy, by: ay + aa * uy - h * ux']],
    PANEL: [["q('rocker_deg').textContent = `${wrap((rk * 180) / Math.PI).toFixed(1)}°`;", "q('rocker_deg').textContent = `${wrap((rk * 180) / Math.PI + 180).toFixed(1)}°`;"]],
    STATE: stateful('const th = (2 * Math.PI * t) / PERIOD;', 'th', '(2 * Math.PI * __acc) / PERIOD'),
  },
  gear_train: {
    DIR: [['const t2 = (-t1 * Z1) / Z2;', 'const t2 = (t1 * Z1) / Z2;']],
    LEN: [['const t4 = (-t2 * Z3) / Z4;', 'const t4 = (-t2 * Z3) / (Z4 - 1);']],
    PHASE: [['g3.rotation.z = t2;', 'g3.rotation.z = -t2;']],
    BRANCH: [['C4 = [C2[0], rp(Z3) + rp(Z4)]', 'C4 = [C2[0], rp(Z3) + rp(Z4) + 6]']],
    PANEL: [['`${((Z2 * Z4) / (Z1 * Z3)).toFixed(3)}`', '`${((Z1 * Z3) / (Z2 * Z4)).toFixed(3)}`']],
    STATE: stateful('const t1 = (2 * Math.PI * t) / PERIOD;', 't1', '(2 * Math.PI * __acc) / PERIOD'),
  },
  geneva: {
    DIR: [['const psi = wheelAngle(phi);', 'const psi = -wheelAngle(phi);']],
    LEN: [['function wheelAngle(phi) {', 'function wheelAngle(phi) { const A = 0.85 * C * Math.sin(Math.PI / 4);']],
    PHASE: [['wheel.rotation.z = psi;', 'wheel.rotation.z = psi + 0.26;']],
    BRANCH: [['const psi = wheelAngle(phi);', 'const psi = -phi / 4;']],
    PANEL: [["qq('wheel_deg').textContent = `${wrap((psi * 180) / Math.PI).toFixed(1)}°`;", "qq('wheel_deg').textContent = `${wrap((-phi / 4 * 180) / Math.PI).toFixed(1)}°`;"]],
    STATE: stateful('const phi = (2 * Math.PI * t) / PERIOD;', 'phi', '(2 * Math.PI * __acc) / PERIOD'),
  },
};
export const OP_DESC = {
  slider_crank: {DIR: 'crank turns clockwise', LEN: 'rod 10% longer in kinematics than drawn', PHASE: 'crank drawn 15° ahead of kinematics', BRANCH: 'rod angle mirrored', PANEL: 'piston_x offset by -r', STATE: 'time integrated with clamped dt'},
  four_bar: {DIR: 'crank turns clockwise', LEN: 'coupler 10% longer in kinematics than drawn', PHASE: 'rocker drawn 15° off', BRANCH: 'crossed assembly branch', PANEL: 'rocker_deg shifted 180°', STATE: 'time integrated with clamped dt'},
  gear_train: {DIR: 'gear2 turns same way as gear1', LEN: 'gear4 ratio off by one tooth', PHASE: 'gear3 turns opposite to its shaft-mate gear2', BRANCH: 'gear4 centre 6 mm too far (no mesh)', PANEL: 'ratio shown inverted', STATE: 'time integrated with clamped dt'},
  geneva: {DIR: 'wheel indexes the wrong way', LEN: 'pin radius 15% short in kinematics', PHASE: 'wheel drawn 15° off', BRANCH: 'wheel turns continuously (no dwell)', PANEL: 'wheel_deg shows continuous phi/4', STATE: 'time integrated with clamped dt'},
};

if (process.argv[1]?.endsWith('mutate.mjs')) {
  const outdir = path.join(ROOT, 'mutants');
  fs.mkdirSync(outdir, {recursive: true});
  const index = [];
  for (const [mech, ops] of Object.entries(OPS)) {
    const src = fs.readFileSync(path.join(ROOT, 'reference', `${mech}_ref.html`), 'utf8');
    for (const [op, patches] of Object.entries(ops)) {
      let s = src;
      for (const [find, rep] of patches) {
        const n = s.split(find).length - 1;
        if (n !== 1) throw new Error(`${mech}/${op}: pattern occurs ${n}x: ${find}`);
        s = s.replace(find, rep);
      }
      const f = `${mech}__${op}.html`;
      fs.writeFileSync(path.join(outdir, f), s);
      index.push({file: `mutants/${f}`, mech, op, desc: OP_DESC[mech][op]});
    }
  }
  fs.writeFileSync(path.join(outdir, 'index.json'), JSON.stringify(index, null, 2));
  console.log(`${index.length} mutants`);
}
