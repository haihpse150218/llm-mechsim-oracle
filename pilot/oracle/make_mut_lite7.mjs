// Phase-7 mutants: edit the reference pages (params or code) -> mutants/lite7/<mech>_m_<kind>.html
//   node oracle/make_mut_lite7.mjs
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './serve.mjs';

const ref = (id) => fs.readFileSync(path.join(ROOT, 'reference_lite', `${id}_ref.html`), 'utf8');
const setParams = (html, f) => html.replace(/const P = (\{.*?\});/, (_, j) => `const P = ${JSON.stringify(f(JSON.parse(j)))};`);
const must = (html, a, b) => { if (!html.includes(a)) throw new Error('pattern not found: ' + a); return html.replace(a, b); };

const M = {
  // lambda: design-knowledge errors (proportions), plus drawing/panel errors
  lambda_m_swapAP: (h) => setParams(h, (P) => ({...P, len: {...P.len, AB: 200, AP: 100, O4B: 200}})), // rocker on the end, P mid-coupler (assembles, wrong cognate)
  lambda_m_rocker2: (h) => setParams(h, (P) => ({...P, len: {...P.len, O4B: 80}})), // rocker 2a instead of 2.5a
  lambda_m_drawP: (h) => must(h, 'Pt=[A[0]+L.AP*u[0],A[1]+L.AP*u[1]]', 'Pt=[A[0]+0.9*L.AP*u[0],A[1]+0.9*L.AP*u[1]]'), // P drawn short of AP
  lambda_m_panel: (h) => must(h, 'P_y:p[1]', 'P_y:-p[1]'),
  // Peaucellier: violated relations, plus a drawing error
  peaucellier_m_crank: (h) => setParams(h, (P) => ({...P, len: {...P.len, OA: 45}})), // OA != |OQ| -> P traces a circle arc
  peaucellier_m_rhombus: (h) => must(setParams(h, (P) => ({...P, len: {...P.len, BP: 66, DP: 66}})),
    'Pt=[B[0]+D[0]-A[0],B[1]+D[1]-A[1]]', 'Pt=circ(B,L.BP,D,L.DP,(function(){const c=circ(B,L.BP,D,L.DP,1),e=circ(B,L.BP,D,L.DP,-1);return Math.hypot(c[0]-A[0],c[1]-A[1])>Math.hypot(e[0]-A[0],e[1]-A[1])?1:-1})())'),
  peaucellier_m_arms: (h) => setParams(h, (P) => ({...P, len: {...P.len, QD: 140}})), // unequal long arms (drawn with QD=140)
  peaucellier_m_drawP: (h) => must(h, 'Pt=[B[0]+D[0]-A[0],B[1]+D[1]-A[1]]', 'Pt=[(B[0]+D[0])-A[0]+3,B[1]+D[1]-A[1]]'),
};
const dir = path.join(ROOT, 'mutants', 'lite7');
fs.mkdirSync(dir, {recursive: true});
for (const [name, f] of Object.entries(M)) fs.writeFileSync(path.join(dir, name + '.html'), f(ref(name.split('_m_')[0])));
console.log('written', Object.keys(M).length);
