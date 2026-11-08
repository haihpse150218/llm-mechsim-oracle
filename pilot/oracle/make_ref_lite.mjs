// Generates hand-written reference simulators for the spec-lite contract: reference_lite/<mech>_ref.html
// Each mechanism supplies PARAMS and solve(t) -> {part: {point: [x,y]}} plus panel(t, s). A generic builder
// makes one rigid group per part (origin at its first point, +X toward its second) with "<part>@<point>" markers.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from './serve.mjs';

const COMMON = `
const circ=(P,rp,Q,rq,s)=>{const d=Math.hypot(Q[0]-P[0],Q[1]-P[1]);const a=(rp*rp-rq*rq+d*d)/(2*d),h=Math.sqrt(Math.max(0,rp*rp-a*a)),u=[(Q[0]-P[0])/d,(Q[1]-P[1])/d],M=[P[0]+a*u[0],P[1]+a*u[1]];return[M[0]-s*h*u[1],M[1]+s*h*u[0]]};
const pol=(c,r,a)=>[c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];
const wrapDeg=(d)=>((d%360)+360)%360;
`;

const MECHS = {
  four_bar: {
    params: {a: 40, b: 120, c: 80, d: 100, omega: Math.PI / 2, theta0: 0},
    code: `
const O2=[0,0],O4=[P.d,0];
function solve(t){const th=P.theta0+P.omega*t;const A=pol(O2,P.a,th);const B=circ(A,P.b,O4,P.c,1);
 return {frame:{O2,O4},crank:{O2,A},coupler:{A,B},rocker:{B,O4}};}
function panel(t,s){return {crank_deg:wrapDeg((P.theta0+P.omega*t)*180/Math.PI),rocker_deg:wrapDeg(Math.atan2(s.rocker.B[1]-O4[1],s.rocker.B[0]-O4[0])*180/Math.PI)};}`,
  },
  geneva: {
    params: {n: 4, C: 100, a: 100 * Math.sin(Math.PI / 4), omega: Math.PI / 2, phi0: 0},
    code: `
const O=[0,0],W=[P.C,0];
function wheelAngle(phi){const n=P.n,TAU=2*Math.PI,k=Math.round(phi/TAU),dl=phi-TAU*k,q=Math.PI/2-Math.PI/n,step=TAU/n;
 if(dl>Math.PI-q-Math.PI/2+Math.PI/n&&false){}
 const half=Math.PI/2-Math.PI/n; // driver half-angle of engagement = pi/2 - pi/n
 if(dl>half)return -step*k-step/2; if(dl<-half)return -step*k+step/2;
 const p=pol(O,P.a,dl);const dir=Math.atan2(p[1]-W[1],p[0]-W[0]);return -step*k+Math.atan2(Math.sin(dir-Math.PI),Math.cos(dir-Math.PI));}
function solve(t){const phi=P.phi0+P.omega*t;const psi=wheelAngle(phi);const wheel={W};
 for(let j=0;j<P.n;j++)wheel['s'+j]=pol(W,P.C*Math.cos(Math.PI/P.n)*0.9,Math.PI+psi+j*2*Math.PI/P.n);
 return {frame:{O,W},driver:{O,pin:pol(O,P.a,phi)},wheel};}
function panel(t,s){const w=s.wheel;return {driver_deg:wrapDeg((P.phi0+P.omega*t)*180/Math.PI),wheel_deg:wrapDeg(Math.atan2(w.s0[1]-W[1],w.s0[0]-W[0])*180/Math.PI)};}`,
  },
  jansen: {
    params: {O: [0, 0], X: [-38, -7.8], len: {OZ: 15, ZY: 50, XY: 41.5, ZW: 61.9, XW: 39.3, XV: 40.1, YV: 55.8, VU: 39.4, WU: 36.7, UT: 65.7, WT: 49}, omega: Math.PI / 2, theta0: 0},
    code: `
const O=P.O,X=P.X,L=P.len;
// branch signs from the canonical pose: Y up, W down, V left, U left, T lowest (computed once at t=0)
const pick=(Pp,rp,Q,rq,f)=>{const a=circ(Pp,rp,Q,rq,1),b=circ(Pp,rp,Q,rq,-1);return f(a,b)?1:-1};
const Z0=pol(O,L.OZ,P.theta0);
const sY=pick(X,L.XY,Z0,L.ZY,(p,q)=>p[1]>q[1]),Y0=circ(X,L.XY,Z0,L.ZY,sY);
const sW=pick(X,L.XW,Z0,L.ZW,(p,q)=>p[1]<q[1]),W0=circ(X,L.XW,Z0,L.ZW,sW);
const sV=pick(X,L.XV,Y0,L.YV,(p,q)=>p[0]<q[0]),V0=circ(X,L.XV,Y0,L.YV,sV);
const sU=pick(V0,L.VU,W0,L.WU,(p,q)=>p[0]<q[0]),U0=circ(V0,L.VU,W0,L.WU,sU);
const sT=pick(W0,L.WT,U0,L.UT,(p,q)=>p[1]<q[1]);
function solve(t){const th=P.theta0+P.omega*t,Z=pol(O,L.OZ,th),Y=circ(X,L.XY,Z,L.ZY,sY),W=circ(X,L.XW,Z,L.ZW,sW),V=circ(X,L.XV,Y,L.YV,sV),U=circ(V,L.VU,W,L.WU,sU),T=circ(W,L.WT,U,L.UT,sT);
 return {frame:{O,X},crank:{O,Z},rodUpper:{Z,Y},rodLower:{Z,W},upperTriangle:{X,Y,V},linkXW:{X,W},linkVU:{V,U},legTriangle:{W,U,T}};}
function panel(t,s){const T=s.legTriangle.T;return {crank_deg:wrapDeg((P.theta0+P.omega*t)*180/Math.PI),foot_x:T[0],foot_y:T[1]};}`,
  },
  planetary: {
    params: {module: 2, Zs: 24, Zp: 18, Zr: 60, omega: Math.PI / 2, theta0: 0},
    code: `
const C=[0,0],m=P.module,rs=m*P.Zs/2,rp=m*P.Zp/2,rr=m*P.Zr/2,rc=rs+rp;
function solve(t){const ts=P.theta0+P.omega*t, wc=P.omega*P.Zs/(P.Zs+P.Zr), tc=wc*t;
 // planet spin from sun mesh: Zs*(ts-tc) = -Zp*(tp-tc)
 const tp=tc-(P.Zs/P.Zp)*(ts-P.theta0-tc);
 const out={frame:{C},sun:{C,sunRef:pol(C,rs,ts)},ring:{C,ringRef:pol(C,rr,0)},carrier:{C}};
 for(let j=0;j<3;j++){const Pj=pol(C,rc,tc+j*2*Math.PI/3);out.carrier['P'+j]=Pj;out['planet'+j]={['P'+j]:Pj,['planet'+j+'Ref']:pol(Pj,rp,tp)};}
 return out;}
function panel(t,s){return {sun_deg:wrapDeg((P.theta0+P.omega*t)*180/Math.PI),carrier_deg:wrapDeg(Math.atan2(s.carrier.P0[1],s.carrier.P0[0])*180/Math.PI),ratio:(P.Zs+P.Zr)/P.Zs};}`,
  },
};

const page = (id, m) => `<!doctype html>
<html><head><meta charset="utf-8"><title>${id} (lite reference)</title>
<style>html,body{margin:0;height:100%;overflow:hidden;background:#15181d;font-family:system-ui,sans-serif}
#panel{position:fixed;top:12px;left:12px;color:#e8e8e8;background:rgba(0,0,0,.55);padding:10px 14px;border-radius:8px;font-size:14px;line-height:1.6}</style>
<script type="importmap">{"imports":{"three":"/vendor/three.module.js"}}</script>
</head><body><div id="panel"><b>${id}</b><div id="rows"></div></div>
<script type="module">
import * as THREE from 'three';
const P = ${JSON.stringify(m.params)};
${COMMON}
${m.code}
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x15181d);
scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.2));
const sun = new THREE.DirectionalLight(0xffffff, 2); sun.position.set(100, 200, 300); scene.add(sun);
const s0 = solve(0);
let bb = [1e9, 1e9, -1e9, -1e9];
for (const pts of Object.values(s0)) for (const p of Object.values(pts)) bb = [Math.min(bb[0], p[0]), Math.min(bb[1], p[1]), Math.max(bb[2], p[0]), Math.max(bb[3], p[1])];
const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, span = Math.max(bb[2] - bb[0], bb[3] - bb[1], 50);
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 1e5);
camera.position.set(cx, cy - span * 0.15, span * 2.6); camera.lookAt(cx, cy, 0);
const palette = [0x9aa3ad, 0xd9822b, 0x4f8fd6, 0x5cbf73, 0xb06bd6, 0xe0c341, 0x46c2c2, 0xd65c5c];
const parts = {};
let pi = 0;
for (const [name, pts] of Object.entries(s0)) {
  const keys = Object.keys(pts), p0 = pts[keys[0]], p1 = pts[keys[1]] || [p0[0] + 1, p0[1]];
  const a0 = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  const g = new THREE.Group(); g.name = name; g.position.z = (pi % 4) * 8;
  const mat = new THREE.MeshStandardMaterial({color: palette[pi % palette.length], metalness: 0.4, roughness: 0.45});
  const local = {};
  for (const k of keys) {
    const dx = pts[k][0] - p0[0], dy = pts[k][1] - p0[1];
    local[k] = [Math.cos(-a0) * dx - Math.sin(-a0) * dy, Math.sin(-a0) * dx + Math.cos(-a0) * dy];
    const mk = new THREE.Object3D(); mk.name = name + '@' + k; mk.position.set(local[k][0], local[k][1], 0); g.add(mk);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(span * 0.012, span * 0.012, 10, 16), mat); pin.rotation.x = Math.PI / 2; pin.position.copy(mk.position); g.add(pin);
  }
  for (let i = 1; i < keys.length; i++) {
    const A = local[keys[i - 1]], B = local[keys[i]], len = Math.hypot(B[0] - A[0], B[1] - A[1]);
    if (len < 1e-6) continue;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(len, span * 0.02, 5), mat);
    bar.position.set((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0); bar.rotation.z = Math.atan2(B[1] - A[1], B[0] - A[0]); g.add(bar);
  }
  scene.add(g); parts[name] = {g, keys};
  pi++;
}
const rows = document.getElementById('rows');
const pnl0 = panel(0, s0);
for (const q of Object.keys(pnl0)) { const d = document.createElement('div'); d.innerHTML = q + ': <span data-q="' + q + '"></span>'; rows.appendChild(d); }
function render(t) {
  const s = solve(t);
  for (const [name, {g, keys}] of Object.entries(parts)) {
    const p0 = s[name][keys[0]], p1 = s[name][keys[1]];
    g.position.x = p0[0]; g.position.y = p0[1];
    if (p1) g.rotation.z = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  }
  for (const [q, v] of Object.entries(panel(t, s))) document.querySelector('[data-q="' + q + '"]').textContent = v.toFixed(2);
  renderer.render(scene, camera);
  return {};
}
window.SIM = {scene, camera, renderer, period: 2 * Math.PI / Math.abs(P.omega), params: P, render};
window.SIM_READY = true;
if (!location.search.includes('capture')) { const t0 = performance.now(); const loop = () => { render((performance.now() - t0) / 1000); requestAnimationFrame(loop); }; loop(); }
</script></body></html>
`;

const dir = path.join(ROOT, 'reference_lite');
fs.mkdirSync(dir, {recursive: true});
for (const [id, m] of Object.entries(MECHS)) fs.writeFileSync(path.join(dir, `${id}_ref.html`), page(id, m));
console.log('written', Object.keys(MECHS).join(', '));
