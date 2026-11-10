// Oracle for phase-2 "spec-lite" simulators (marker contract "<part>@<point>", SIM.params).
//   node oracle/run_oracle_lite.mjs <file.html ...> [--out results/x.jsonl] [--quiet]
// Check families:
//   META  (no ground truth): determinism (order), periodicity, rigidity of each part, shared-joint coincidence, frame static
//   PARAM (params vs drawing): marker distances equal the reported params, input angle = theta0 + omega t, SIM.period consistent
//   DESIGN (params vs engineering knowledge): Grashof crank-rocker, Geneva tangential entry, Jansen holy numbers, planetary Zr = Zs + 2Zp
//   GT    (analytic solution from params): outputs vs closed-form / constraint solution
//   PANEL: panel numbers vs GT
import fs from 'node:fs';
import path from 'node:path';
import {startServer, launch, ROOT} from './serve.mjs';
import {LITE_SPECS} from './lite_specs.mjs';

const TAU = 2 * Math.PI;
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const deg = (r) => (r * 180) / Math.PI;
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);
const angDiffDeg = (a, b) => Math.abs(deg(wrapPi(a - b)));
const panelAngDiff = (x, yDeg) => Math.abs((((x - yDeg) % 360) + 540) % 360 - 180);
const num = (txt) => {
  const m = String(txt ?? '').match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/i);
  return m ? Number(m[0]) : NaN;
};
// circle-circle intersection; side = sign of cross(Q-P, R-P)
function circ(P, rp, Q, rq, side) {
  const d = dist(P, Q);
  if (d > rp + rq || d < Math.abs(rp - rq) || d === 0) return null;
  const a = (rp * rp - rq * rq + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, rp * rp - a * a));
  const u = [(Q[0] - P[0]) / d, (Q[1] - P[1]) / d];
  const M = [P[0] + a * u[0], P[1] + a * u[1]];
  return [M[0] - side * h * u[1], M[1] + side * h * u[0]];
}
const f1 = (x) => (Number.isFinite(x) ? +x.toFixed(1) : x);
const fp = (p) => (p ? `(${f1(p[0])}, ${f1(p[1])})` : 'n/a');
const crossSide = (P, Q, R) => Math.sign((Q[0] - P[0]) * (R[1] - P[1]) - (Q[1] - P[1]) * (R[0] - P[0])) || 1;

export function mechOfLite(file) {
  const b = path.basename(file);
  return Object.keys(LITE_SPECS).find((k) => b.startsWith(k));
}

// ---------------- per-mechanism checks ----------------
// S: {times, P(name) -> [[x,y]...], params, panel(q) -> [num...], scale}
const MECH = {
  four_bar: {
    revs: () => 1,
    check(S, R) {
      const {a, b, c, d, omega, theta0} = S.params;
      const O2 = S.P('frame@O2')[0], O4 = S.P('frame@O4')[0];
      R.param('len a', S.P('crank@O2').map((p, k) => Math.abs(dist(p, S.P('crank@A')[k]) - a)));
      R.param('len b', S.P('coupler@A').map((p, k) => Math.abs(dist(p, S.P('coupler@B')[k]) - b)));
      R.param('len c', S.P('rocker@O4').map((p, k) => Math.abs(dist(p, S.P('rocker@B')[k]) - c)));
      R.param('len d', [Math.abs(dist(O2, O4) - d)]);
      const s = [a, b, c, d].sort((x, y) => x - y);
      R.design('Grashof crank-rocker (crank shortest, s+l<=p+q)', s[0] + s[3] <= s[1] + s[2] + 1e-9 && a === s[0] && d !== s[0] ? 0 : 1, 0.5,
        `a=${a}, b=${b}, c=${c}, d=${d}: shortest+longest = ${f1(s[0] + s[3])} vs sum of other two = ${f1(s[1] + s[2])}; crank a must be the shortest link and s+l <= p+q`);
      const th = S.times.map((t) => theta0 + omega * t);
      R.param('input angle (deg)', S.times.map((t, k) => angDiffDeg(ang(S.P('crank@O2')[k], S.P('crank@A')[k]), th[k])), 'deg');
      // GT: branch taken from the simulator at the first sample, then held
      const A0 = [O2[0] + a * Math.cos(th[0]), O2[1] + a * Math.sin(th[0])];
      const side = crossSide(A0, O4, S.P('coupler@B')[0]);
      const gtB = th.map((x) => circ([O2[0] + a * Math.cos(x), O2[1] + a * Math.sin(x)], b, O4, c, side));
      if (gtB.some((p) => !p)) R.design('linkage assembles for all crank angles', 1, 0.5);
      else {
        R.gt('B vs solution', gtB.map((p, k) => dist(p, S.P('rocker@B')[k])), 'mm', undefined,
          (k) => `at t=${S.times[k].toFixed(3)} s (crank ${f1(deg(th[k]))} deg) rocker@B is drawn at ${fp(S.P('rocker@B')[k])}, the solution from your params puts B at ${fp(gtB[k])}`);
        R.panel('crank_deg', S.panel('crank_deg').map((x, k) => panelAngDiff(x, deg(th[k]))), 'deg');
        R.panel('rocker_deg', S.panel('rocker_deg').map((x, k) => panelAngDiff(x, deg(ang(O4, gtB[k])))), 'deg');
      }
    },
  },
  geneva: {
    revs: () => 2,
    check(S, R) {
      const {n, C, a, omega, phi0} = S.params;
      const O = S.P('frame@O')[0], W = S.P('frame@W')[0];
      R.param('len C', [Math.abs(dist(O, W) - C)]);
      R.param('len a (pin radius)', S.P('driver@O').map((p, k) => Math.abs(dist(p, S.P('driver@pin')[k]) - a)));
      R.design('tangential entry a = C sin(pi/n) (mm)', Math.abs(a - C * Math.sin(Math.PI / n)), 1,
        `n=${n}, C=${C}: pin radius a=${a} but tangential (shock-free) entry needs a = C*sin(pi/n) = ${f1(C * Math.sin(Math.PI / n))}`);
      const phi = S.times.map((t) => phi0 + omega * t);
      R.param('input angle (deg)', S.times.map((t, k) => angDiffDeg(ang(S.P('driver@O')[k], S.P('driver@pin')[k]), phi[k])), 'deg');
      const slots = Array.from({length: n}, (_, j) => S.P(`wheel@s${j}`));
      const Wm = S.P('wheel@W');
      const rEng = Math.sqrt(Math.max(0, C * C - a * a));
      const pinGT = phi.map((x) => [O[0] + a * Math.cos(x), O[1] + a * Math.sin(x)]);
      const engaged = pinGT.map((p) => dist(p, W) < rEng - 0.02 * C);
      const dwell = pinGT.map((p) => dist(p, W) > rEng + 0.02 * C);
      // pin on a slot axis while engaged
      const onSlot = [];
      S.times.forEach((_, k) => {
        if (!engaged[k]) return;
        const pin = S.P('driver@pin')[k];
        let best = Infinity;
        for (const s of slots) {
          const v = [s[k][0] - Wm[k][0], s[k][1] - Wm[k][1]], L = Math.hypot(...v);
          const w = [pin[0] - Wm[k][0], pin[1] - Wm[k][1]];
          if (w[0] * v[0] + w[1] * v[1] <= 0) continue;
          best = Math.min(best, Math.abs(v[0] * w[1] - v[1] * w[0]) / L);
        }
        onSlot.push(best);
      });
      R.gt('pin on slot axis while engaged', onSlot.length ? onSlot : [Infinity]);
      // wheel locked during dwell
      const wa = Wm.map((w, k) => ang(w, slots[0][k]));
      const still = [];
      for (let k = 1; k < S.times.length; k++) if (dwell[k] && dwell[k - 1] && dist(pinGT[k], pinGT[k - 1]) < rEng) still.push(angDiffDeg(wa[k], wa[k - 1]));
      R.gt('wheel locked during dwell (deg)', still.length ? still : [0], 'deg');
      // index per driver revolution
      const perRev = Math.round(S.times.length / S.revs);
      let u = 0;
      for (let k = 1; k <= perRev && k < wa.length; k++) u += wrapPi(wa[k] - wa[k - 1]);
      R.gt('index per revolution = 360/n (deg)', [Math.abs(Math.abs(deg(u)) - 360 / n)], 'deg');
      R.panel('driver_deg', S.panel('driver_deg').map((x, k) => panelAngDiff(x, deg(phi[k]))), 'deg');
      R.panel('wheel_deg', S.panel('wheel_deg').map((x, k) => panelAngDiff(x, deg(wa[k]))), 'deg');
    },
  },
  jansen: {
    revs: () => 1,
    HOLY: {OZ: 15, ZY: 50, XY: 41.5, ZW: 61.9, XW: 39.3, XV: 40.1, YV: 55.8, VU: 39.4, WU: 36.7, UT: 65.7, WT: 49},
    check(S, R) {
      const {O, X, len, omega, theta0} = S.params;
      const Os = S.P('frame@O')[0], Xs = S.P('frame@X')[0];
      R.param('O, X positions vs params', [dist(Os, O), dist(Xs, X)]);
      const pairs = {OZ: ['crank@O', 'crank@Z'], ZY: ['rodUpper@Z', 'rodUpper@Y'], XY: ['upperTriangle@X', 'upperTriangle@Y'], ZW: ['rodLower@Z', 'rodLower@W'], XW: ['linkXW@X', 'linkXW@W'], XV: ['upperTriangle@X', 'upperTriangle@V'], YV: ['upperTriangle@Y', 'upperTriangle@V'], VU: ['linkVU@V', 'linkVU@U'], WU: ['legTriangle@W', 'legTriangle@U'], UT: ['legTriangle@U', 'legTriangle@T'], WT: ['legTriangle@W', 'legTriangle@T']};
      for (const [k, [p, q]] of Object.entries(pairs)) R.param(`len ${k}`, [Math.abs(dist(S.P(p)[0], S.P(q)[0]) - len[k])]);
      // holy numbers (uniform scale allowed, mirror allowed); fixed pivot offset a=38, l=7.8
      const sc = len.OZ / 15;
      const holyErr = Object.entries(this.HOLY).map(([k, v]) => Math.abs(len[k] / sc - v) / v);
      const dx = (X[0] - O[0]) / sc, dy = (X[1] - O[1]) / sc;
      holyErr.push(Math.abs(Math.abs(dx) - 38) / 38, Math.abs(dy + 7.8) / 7.8);
      R.design('holy numbers (max rel. error)', Math.max(...holyErr), 0.03, () => holyDetail(len, O, X, this.HOLY));
      const th = S.times.map((t) => theta0 + omega * t);
      R.param('input angle (deg)', S.times.map((t, k) => angDiffDeg(ang(S.P('crank@O')[k], S.P('crank@Z')[k]), th[k])), 'deg');
      // canonical branches (standard orientation: X left of O): Y up, W down, V outer-left, U outer-left, T lowest
      const mir = X[0] > O[0] ? -1 : 1;
      const sides = canonicalSides();
      const gt = th.map((x) => {
        const Z = [O[0] + len.OZ * Math.cos(x), O[1] + len.OZ * Math.sin(x)];
        const Y = circ(X, len.XY, Z, len.ZY, mir * sides.Y);
        const W = circ(X, len.XW, Z, len.ZW, mir * sides.W);
        if (!Y || !W) return null;
        const V = circ(X, len.XV, Y, len.YV, mir * sides.V);
        if (!V) return null;
        const U = circ(V, len.VU, W, len.WU, mir * sides.U);
        if (!U) return null;
        const T = circ(W, len.WT, U, len.UT, mir * sides.T);
        return T ? {Z, Y, W, V, U, T} : null;
      });
      if (gt.some((g) => !g)) {
        R.design('linkage assembles for all crank angles', 1, 0.5, () => {
          const k = gt.findIndex((g) => !g);
          return `with your SIM.params the loops cannot close at t=${S.times[k].toFixed(3)} s (crank ${f1(deg(th[k]))} deg): some pair of links is too short to reach`;
        });
        return;
      }
      for (const j of ['Y', 'W', 'V', 'U', 'T']) {
        const mk = {Y: 'rodUpper@Y', W: 'rodLower@W', V: 'upperTriangle@V', U: 'linkVU@U', T: 'legTriangle@T'}[j];
        R.gt(`${j} vs canonical solution`, gt.map((g, k) => dist(g[j], S.P(mk)[k])), 'mm', undefined,
          (k) => `at t=${S.times[k].toFixed(3)} s (crank ${f1(deg(th[k]))} deg) marker ${mk} is drawn at ${fp(S.P(mk)[k])}; solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts ${j} at ${fp(gt[k][j])}`);
      }
      R.panel('crank_deg', S.panel('crank_deg').map((x, k) => panelAngDiff(x, deg(th[k]))), 'deg');
      const fd = (q, i) => (k) => `at t=${S.times[k].toFixed(3)} s the panel ${q} reads ${S.panel(q)[k]}, the foot T from your SIM.params is at ${f1(gt[k].T[i])} mm (and drawn at ${f1(S.P('legTriangle@T')[k][i])} mm)`;
      R.panel('foot_x', S.panel('foot_x').map((x, k) => Math.abs(x - gt[k].T[0])), 'mm', undefined, fd('foot_x', 0));
      R.panel('foot_y', S.panel('foot_y').map((x, k) => Math.abs(x - gt[k].T[1])), 'mm', undefined, fd('foot_y', 1));
    },
  },
  planetary: {
    revs: () => 1,
    check(S, R) {
      const {module: m, Zs, Zp, Zr, omega, theta0} = S.params;
      R.design('Zr = Zs + 2 Zp', Math.abs(Zr - Zs - 2 * Zp), 0.5, `Zs=${Zs}, Zp=${Zp}, Zr=${Zr}: concentric meshing needs Zr = Zs + 2*Zp = ${Zs + 2 * Zp}`);
      R.design('equal spacing (Zs+Zr) divisible by 3', (Zs + Zr) % 3 === 0 ? 0 : 1, 0.5,
        `Zs + Zr = ${Zs} + ${Zr} = ${Zs + Zr} is not divisible by 3, so three planets spaced 120 deg apart cannot all mesh with sun and ring at once`);
      const C = S.P('frame@C')[0];
      R.param('sun pitch radius', [Math.abs(dist(C, S.P('sun@sunRef')[0]) - (m * Zs) / 2)]);
      R.param('ring pitch radius', [Math.abs(dist(C, S.P('ring@ringRef')[0]) - (m * Zr) / 2)]);
      for (let j = 0; j < 3; j++) {
        R.param(`planet${j} centre distance`, [Math.abs(dist(C, S.P(`carrier@P${j}`)[0]) - (m * (Zs + Zp)) / 2)]);
        R.param(`planet${j} pitch radius`, [Math.abs(dist(S.P(`planet${j}@P${j}`)[0], S.P(`planet${j}@planet${j}Ref`)[0]) - (m * Zp) / 2)]);
      }
      const unwrap = (arr) => {
        const out = [0];
        for (let k = 1; k < arr.length; k++) out.push(out[k - 1] + wrapPi(arr[k] - arr[k - 1]));
        return out;
      };
      const th = S.times.map((t) => theta0 + omega * t);
      const as = S.P('sun@sunRef').map((p, k) => ang(S.P('sun@C')[k], p));
      const ar = S.P('ring@ringRef').map((p, k) => ang(S.P('ring@C')[k], p));
      const ac = S.P('carrier@P0').map((p, k) => ang(S.P('carrier@C')[k], p));
      R.param('input angle (deg)', as.map((x, k) => angDiffDeg(x, th[k])), 'deg');
      const us = unwrap(as), ur = unwrap(ar), uc = unwrap(ac);
      R.gt('ring fixed (deg)', ur.map(Math.abs).map(deg), 'deg');
      const wc = (omega * Zs) / (Zs + Zr);
      R.gt('carrier vs Willis (deg)', S.times.map((t, k) => Math.abs(deg(uc[k] - wc * (t - S.times[0])))), 'deg', undefined,
        (k) => `with the ring fixed the carrier must turn at omega*Zs/(Zs+Zr) = ${wc.toFixed(4)} rad/s; at t=${S.times[k].toFixed(3)} s it has turned ${f1(deg(uc[k]))} deg, expected ${f1(deg(wc * (S.times[k] - S.times[0])))} deg`);
      for (let j = 0; j < 3; j++) {
        const ap = S.P(`planet${j}@planet${j}Ref`).map((p, k) => ang(S.P(`planet${j}@P${j}`)[k], p));
        const up = unwrap(ap);
        // rolling without slip: Zs*(ds - dc) = -Zp*(dp - dc), and Zp*(dp - dc) = Zr*(dr - dc); error expressed in sun degrees
        const relSpin = (k) => `at t=${S.times[k].toFixed(3)} s: sun turned ${f1(deg(us[k]))} deg, carrier ${f1(deg(uc[k]))} deg, planet${j} ${f1(deg(up[k]))} deg; rolling without slip requires planet spin relative to carrier = -(Zs/Zp)*(sun - carrier) = ${f1(deg(-(Zs / Zp) * (us[k] - uc[k])))} deg, drawn ${f1(deg(up[k] - uc[k]))} deg`;
        R.gt(`planet${j} sun mesh (deg)`, us.map((_, k) => Math.abs(deg(Zs * (us[k] - uc[k]) + Zp * (up[k] - uc[k])) / Zs)), 'deg', undefined, relSpin);
        R.gt(`planet${j} ring mesh (deg)`, us.map((_, k) => Math.abs(deg(Zp * (up[k] - uc[k]) - Zr * (ur[k] - uc[k])) / Zs)), 'deg', undefined, relSpin);
      }
      R.panel('sun_deg', S.panel('sun_deg').map((x, k) => panelAngDiff(x, deg(th[k]))), 'deg');
      R.panel('carrier_deg', S.panel('carrier_deg').map((x, k) => panelAngDiff(x, deg(ac[0] + wc * (S.times[k] - S.times[0])))), 'deg');
      R.panel('ratio', S.panel('ratio').map((x) => Math.abs(x - (Zs + Zr) / Zs) / ((Zs + Zr) / Zs)), 'rel');
    },
  },
  // ---- phase 5 ----
  cam: {
    revs: () => 1,
    near: [['cam', 'follower@C']], // XY distance from the roller centre to the nearest vertex of the cam's meshes
    check(S, R) {
      const {Rb, Rr, e, h, axisAngle, betaRise: b1, betaDwellTop: b2, betaReturn: b3, betaDwellBottom: b4, omega, theta0} = S.params;
      R.design('phase angles sum to 360 deg', Math.abs(deg(b1 + b2 + b3 + b4) - 360), 0.5,
        `betaRise + betaDwellTop + betaReturn + betaDwellBottom = ${f1(deg(b1 + b2 + b3 + b4))} deg, must be 360`);
      const law = camLaw(h, b1, b2, b3);
      const O = S.P('frame@O')[0];
      const u = [Math.cos(axisAngle), Math.sin(axisAngle)], nv = [-u[1], u[0]];
      const Cs = S.P('follower@C');
      const along = Cs.map((c) => (c[0] - O[0]) * u[0] + (c[1] - O[1]) * u[1]);
      const perp = Cs.map((c) => (c[0] - O[0]) * nv[0] + (c[1] - O[1]) * nv[1]);
      R.gt('follower moves along axisAngle (no sideways motion)', perp.map((w) => Math.abs(w - perp[0])), 'mm', undefined,
        (k) => `the roller centre must move only along the direction axisAngle = ${f1(deg(axisAngle))} deg; its sideways coordinate is ${f1(perp[0])} mm at t=${S.times[0].toFixed(3)} s but ${f1(perp[k])} mm at t=${S.times[k].toFixed(3)} s`);
      R.param('offset |e| = distance from O to the line of motion', [Math.abs(Math.abs(perp[0]) - Math.abs(e))], 'mm', undefined,
        () => `the roller centre's line of motion passes ${f1(Math.abs(perp[0]))} mm from O, but SIM.params.e = ${e}`);
      const G = S.P('frame@G')[0];
      R.param('G on the line of motion', [Math.abs((G[0] - O[0]) * nv[0] + (G[1] - O[1]) * nv[1] - perp[0])]);
      const fa = S.P('follower@F').map((f, k) => ang(Cs[k], f));
      R.gt('follower translates without rotating (deg)', fa.map((a) => angDiffDeg(a, fa[0])), 'deg');
      const th = S.times.map((t) => theta0 + omega * t);
      R.param('input angle (deg)', S.times.map((t, k) => angDiffDeg(ang(S.P('cam@O')[k], S.P('cam@camRef')[k]), th[k])), 'deg');
      const psi = S.times.map((t) => Math.abs(omega) * t);
      const s0 = Math.sqrt(Math.max(0, (Rb + Rr) ** 2 - e * e));
      const lift = along.map((a) => a - s0);
      const errs = lift.map((x, k) => Math.abs(x - law.s(psi[k])));
      const tolLift = Math.min(TOL.mm * S.scale, 0.02 * Math.abs(h)); // marker positions are computed, so cycloidal vs harmonic (max diff 0.058 h) must be separable
      R.gt('lift vs cycloidal rise-dwell-return-dwell law', errs, 'mm', tolLift, (k) => {
        let msg = `at t=${S.times[k].toFixed(3)} s the cam has turned ${f1(deg(psi[k] % TAU))} deg since the start of the rise (${law.phase(psi[k])}); the roller centre is ${f1(along[k])} mm along the line of motion from O's projection, i.e. lift ${f1(lift[k])} mm (lowest roller-centre position = sqrt((Rb+Rr)^2 - e^2) = ${f1(s0)} mm), but the cycloidal law from your params gives lift ${f1(law.s(psi[k]))} mm`;
        const tol = tolLift;
        const fits = (g) => Math.max(...lift.map((x, i) => Math.abs(x - g(psi[i])))) < Math.min(tol, Math.max(...errs) / 3);
        const off = lift.reduce((a, x, i) => a + x - law.s(psi[i]), 0) / lift.length;
        if (fits(law.harm)) msg += '. The drawn lift matches SIMPLE-HARMONIC rise/return, not cycloidal';
        else if (fits((p) => law.s(-p))) msg += '. The drawn lift matches the law run BACKWARDS in cam angle (the phase order is reversed relative to the rotation direction)';
        else if (fits((p) => law.s(p) + off)) msg += `. The drawn lift is the right shape but offset by a constant ${f1(off)} mm (check where the lowest roller-centre position is)`;
        else {
          let best = null;
          for (let d = 1; d < 360; d++) {
            const sh = (d * Math.PI) / 180;
            const m = Math.max(...lift.map((x, i) => Math.abs(x - law.s(psi[i] - sh))));
            if (!best || m < best.m) best = {d, m};
          }
          if (best.m < Math.max(...errs) / 3) msg += `. The drawn lift matches the law shifted by ${best.d} deg of cam rotation (the rise must start at t = 0)`;
        }
        return msg;
      });
      const nd = S.near(0);
      const contact = nd.map((d) => (d == null || d < 0 ? Infinity : Math.abs(d - Rr)));
      R.gt('roller touches the cam surface (no gap / penetration)', contact, 'mm', undefined, (k) => {
        if (nd[k] == null || nd[k] < 0) return 'no meshes were found under the object named "cam" (the cam outline must be a mesh inside the cam part)';
        const tol = TOL.mm * S.scale;
        const gaps = nd.filter((d) => d - Rr > tol).length, pens = nd.filter((d) => Rr - d > tol).length;
        return `at t=${S.times[k].toFixed(3)} s (cam turned ${f1(deg(psi[k] % TAU))} deg, ${law.phase(psi[k])}) the nearest point of the cam meshes is ${f1(nd[k])} mm from the roller centre, but the roller radius Rr = ${Rr} mm: ${nd[k] > Rr ? 'a GAP' : 'PENETRATION'} of ${f1(Math.abs(nd[k] - Rr))} mm. Over the revolution: gap at ${gaps} of ${nd.length} samples, penetration at ${pens}`;
      });
      // pressure angle and undercut from params + drawn offset side (dense)
      const N = 1440, w0 = perp[0];
      let pmax = 0, pAt = 0, rhoMin = Infinity, rAt = 0;
      const q = [];
      for (let i = 0; i < N; i++) {
        const p = (i * TAU) / N, s = law.s(p), ds = law.ds(p);
        const C = [O[0] + w0 * nv[0] + (s0 + s) * u[0], O[1] + w0 * nv[1] + (s0 + s) * u[1]];
        const v = [ds * Math.abs(omega) * u[0], ds * Math.abs(omega) * u[1]];
        const I = [O[0] + v[1] / omega, O[1] - v[0] / omega];
        const Nn = [C[0] - I[0], C[1] - I[1]];
        const phi = deg(Math.acos(Math.min(1, Math.abs(Nn[0] * u[0] + Nn[1] * u[1]) / Math.hypot(...Nn))));
        if (phi > pmax) { pmax = phi; pAt = p; }
        const rot = -Math.sign(omega) * p; // cam-fixed frame
        const d = [C[0] - O[0], C[1] - O[1]];
        q.push([Math.cos(rot) * d[0] - Math.sin(rot) * d[1], Math.sin(rot) * d[0] + Math.cos(rot) * d[1]]);
      }
      let area = 0;
      for (let i = 0; i < N; i++) area += q[i][0] * q[(i + 1) % N][1] - q[i][1] * q[(i + 1) % N][0];
      for (let i = 0; i < N; i++) {
        const a = q[(i - 1 + N) % N], b = q[i], c = q[(i + 1) % N];
        const d1 = [(c[0] - a[0]) / 2, (c[1] - a[1]) / 2], d2 = [c[0] - 2 * b[0] + a[0], c[1] - 2 * b[1] + a[1]];
        const cr = d1[0] * d2[1] - d1[1] * d2[0];
        if (Math.sign(cr) !== Math.sign(area) || cr === 0) continue; // concave part: no undercut from a convex roller
        const rho = Math.hypot(...d1) ** 3 / Math.abs(cr);
        if (rho < rhoMin) { rhoMin = rho; rAt = (i * TAU) / N; }
      }
      R.design('pressure angle <= 30 deg', Math.max(0, pmax - 30), 0.5,
        `with Rb=${Rb}, Rr=${Rr}, e=${e} (drawn on the ${w0 >= 0 ? 'left' : 'right'} of the rise direction), h=${h}, betaRise=${f1(deg(b1))} deg, betaReturn=${f1(deg(b3))} deg the pressure angle reaches ${f1(pmax)} deg at ${f1(deg(pAt))} deg of cam rotation (${law.phase(pAt)}); it must stay <= 30 deg`);
      R.design('no undercut (pitch-curve radius > Rr)', Math.max(0, Rr - rhoMin), 0.01,
        `the roller-centre (pitch) curve has a convex radius of curvature of only ${f1(rhoMin)} mm at ${f1(deg(rAt))} deg of cam rotation, smaller than Rr = ${Rr} mm, so the cam profile would be undercut`);
      R.panel('cam_deg', S.panel('cam_deg').map((x, k) => panelAngDiff(x, deg(th[k]))), 'deg');
      R.panel('lift', S.panel('lift').map((x, k) => Math.abs(x - law.s(psi[k]))), 'mm', tolLift,
        (k) => `at t=${S.times[k].toFixed(3)} s the panel lift reads ${S.panel('lift')[k]}, the law from your params gives ${f1(law.s(psi[k]))} mm`);
    },
  },
  watt6: {
    revs: () => 1,
    check(S, R) {
      const {O2, O4, O6, len: L, omega, theta0} = S.params;
      const pairs = {O2A: ['crank@O2', 'crank@A'], AB: ['coupler1@A', 'coupler1@B'], O4B: ['rocker1@O4', 'rocker1@B'], O4C: ['rocker1@O4', 'rocker1@C'],
        BC: ['rocker1@B', 'rocker1@C'], CD: ['coupler2@C', 'coupler2@D'], O6D: ['rocker2@O6', 'rocker2@D']};
      for (const [k, [p, q]] of Object.entries(pairs))
        R.param(`len ${k}`, S.P(p).map((x, i) => Math.abs(dist(x, S.P(q)[i]) - L[k])), 'mm', undefined,
          (i) => `${p} - ${q} is drawn ${f1(dist(S.P(p)[i], S.P(q)[i]))} mm apart, SIM.params.len.${k} = ${L[k]}`);
      R.param('ground pivots vs params', [dist(S.P('frame@O2')[0], O2), dist(S.P('frame@O4')[0], O4), dist(S.P('frame@O6')[0], O6)], 'mm', undefined,
        () => `frame markers O2, O4, O6 are at ${fp(S.P('frame@O2')[0])}, ${fp(S.P('frame@O4')[0])}, ${fp(S.P('frame@O6')[0])}; SIM.params says ${fp(O2)}, ${fp(O4)}, ${fp(O6)}`);
      const th = S.times.map((t) => theta0 + omega * t);
      R.param('input angle (deg)', S.times.map((t, k) => angDiffDeg(ang(S.P('crank@O2')[k], S.P('crank@A')[k]), th[k])), 'deg');
      const Aof = (x) => [O2[0] + L.O2A * Math.cos(x), O2[1] + L.O2A * Math.sin(x)];
      // branches taken from the drawing at the first sample, then held
      const sB = crossSide(Aof(th[0]), O4, S.P('rocker1@B')[0]);
      const B0 = circ(Aof(th[0]), L.AB, O4, L.O4B, sB);
      const sC = B0 ? crossSide(O4, B0, S.P('rocker1@C')[0]) : 1;
      const C0 = B0 ? circ(O4, L.O4C, B0, L.BC, sC) : null;
      const sD = C0 ? crossSide(C0, O6, S.P('rocker2@D')[0]) : 1;
      const solve = (x) => {
        const A = Aof(x), B = circ(A, L.AB, O4, L.O4B, sB);
        if (!B) return {fail: 1, A};
        const C = circ(O4, L.O4C, B, L.BC, sC);
        if (!C) return {fail: 0, A, B};
        const D = circ(C, L.CD, O6, L.O6D, sD);
        return D ? {A, B, C, D} : {fail: 2, A, B, C};
      };
      const Nd = 720, dense = Array.from({length: Nd}, (_, i) => th[0] + (i * TAU) / Nd).map((x) => ({x, s: solve(x)}));
      const bad = dense.find((d) => d.s.fail != null);
      if (bad) {
        const {x, s} = bad, cr = f1(deg(((x % TAU) + TAU) % TAU));
        const why = s.fail === 0 ? `the ternary rocker triangle O4-B-C cannot be formed (O4B=${L.O4B}, O4C=${L.O4C}, BC=${L.BC})`
          : s.fail === 1 ? `loop 1 cannot close: |A - O4| = ${f1(dist(s.A, O4))} mm but coupler AB=${L.AB} and rocker O4B=${L.O4B} can only span ${f1(Math.abs(L.AB - L.O4B))}..${f1(L.AB + L.O4B)} mm`
          : `loop 2 cannot close: |C - O6| = ${f1(dist(s.C, O6))} mm but coupler CD=${L.CD} and output rocker O6D=${L.O6D} can only span ${f1(Math.abs(L.CD - L.O6D))}..${f1(L.CD + L.O6D)} mm`;
        R.design('linkage assembles for all crank angles', 1, 0.5, `with your SIM.params, at crank angle ${cr} deg ${why}`);
        return;
      }
      const tr = (p, q, r) => { const m = deg(Math.acos(Math.max(-1, Math.min(1, ((p[0] - q[0]) * (r[0] - q[0]) + (p[1] - q[1]) * (r[1] - q[1])) / (dist(p, q) * dist(r, q)))))); return Math.min(m, 180 - m); };
      for (const [loop, f, desc] of [[1, (s) => tr(s.A, s.B, O4), 'coupler 1 (B->A) and ternary rocker (B->O4)'], [2, (s) => tr(s.C, s.D, O6), 'coupler 2 (D->C) and output rocker (D->O6)']]) {
        let mn = 180, at = 0;
        for (const d of dense) { const m = f(d.s); if (m < mn) { mn = m; at = d.x; } }
        R.design(`transmission angle loop ${loop} within [30, 150] deg`, Math.max(0, 30 - mn), 0.5,
          `the transmission angle between ${desc} comes within ${f1(mn)} deg of 0 or 180 at crank angle ${f1(deg(((at % TAU) + TAU) % TAU))} deg; it must stay between 30 and 150 deg`);
      }
      const gt = th.map(solve);
      for (const [j, mk] of [['B', 'rocker1@B'], ['C', 'rocker1@C'], ['D', 'rocker2@D']])
        R.gt(`${j} vs solution`, gt.map((g, k) => dist(g[j], S.P(mk)[k])), 'mm', undefined,
          (k) => `at t=${S.times[k].toFixed(3)} s (crank ${f1(deg(th[k]))} deg) ${mk} is drawn at ${fp(S.P(mk)[k])}; solving the loops from your SIM.params (keeping the assembly branch drawn at t=${S.times[0].toFixed(3)} s) puts ${j} at ${fp(gt[k][j])}`);
      R.panel('crank_deg', S.panel('crank_deg').map((x, k) => panelAngDiff(x, deg(th[k]))), 'deg');
      R.panel('rocker1_deg', S.panel('rocker1_deg').map((x, k) => panelAngDiff(x, deg(ang(O4, gt[k].B)))), 'deg');
      R.panel('output_deg', S.panel('output_deg').map((x, k) => panelAngDiff(x, deg(ang(O6, gt[k].D)))), 'deg');
    },
  },
};

// cycloidal rise-dwell-return-dwell law (and simple-harmonic variant for diagnosis); psi = cam rotation since start of rise
function camLaw(h, b1, b2, b3) {
  const cyc = (x) => x - Math.sin(TAU * x) / TAU, dcyc = (x) => 1 - Math.cos(TAU * x);
  const har = (x) => (1 - Math.cos(Math.PI * x)) / 2;
  const w = (p) => ((p % TAU) + TAU) % TAU;
  const gen = (f, df) => ({
    s: (p0) => { const p = w(p0); return p < b1 ? h * f(p / b1) : p < b1 + b2 ? h : p < b1 + b2 + b3 ? h * (1 - f((p - b1 - b2) / b3)) : 0; },
    ds: df ? (p0) => { const p = w(p0); return p < b1 ? (h / b1) * df(p / b1) : p < b1 + b2 ? 0 : p < b1 + b2 + b3 ? (-h / b3) * df((p - b1 - b2) / b3) : 0; } : null,
  });
  const c = gen(cyc, dcyc), hm = gen(har);
  return {s: c.s, ds: c.ds, harm: hm.s,
    phase: (p0) => { const p = w(p0); return p < b1 ? 'rise' : p < b1 + b2 ? 'top dwell' : p < b1 + b2 + b3 ? 'return' : 'bottom dwell'; }};
}

// per-link holy-number diagnosis: robust scale = median(len/H), list off links, flag swapped pairs
function holyDetail(len, O, X, H) {
  const ks = Object.keys(H);
  const r = ks.map((k) => len[k] / H[k]).filter(Number.isFinite).sort((a, b) => a - b);
  const s = r[Math.floor(r.length / 2)];
  const bad = ks.filter((k) => !(Math.abs(len[k] / s - H[k]) / H[k] <= 0.03));
  const out = [`best-fit uniform scale = ${s.toFixed(3)} x the published Jansen numbers (OZ 15, ZY 50, XY 41.5, ZW 61.9, XW 39.3, XV 40.1, YV 55.8, VU 39.4, WU 36.7, UT 65.7, WT 49; fixed pivot X 38 to the side of O and 7.8 below it). Links that do not match at this scale:`];
  for (const k of bad) {
    const sw = ks.find((j) => j !== k && Math.abs(len[k] / s - H[j]) / H[j] <= 0.03 && Math.abs(len[j] / s - H[k]) / H[k] <= 0.03);
    out.push(`len.${k} = ${f1(len[k])} mm, expected ${f1(H[k] * s)} mm${sw ? ` (looks swapped with len.${sw})` : ''}`);
  }
  const dx = (X[0] - O[0]) / s, dy = (X[1] - O[1]) / s;
  if (Math.abs(Math.abs(dx) - 38) / 38 > 0.03 || Math.abs(dy + 7.8) / 7.8 > 0.03)
    out.push(`X - O = (${f1(X[0] - O[0])}, ${f1(X[1] - O[1])}) mm, expected (+/-${f1(38 * s)}, ${f1(-7.8 * s)}) mm`);
  if (out.length === 1) out.push('(none individually at this scale)');
  return out[0] + ' ' + out.slice(1).join('; ');
}

let _sides = null;
function canonicalSides() {
  if (_sides) return _sides;
  const H = MECH.jansen.HOLY, O = [0, 0], X = [-38, -7.8];
  const Z = [H.OZ, 0];
  const pick = (P, rp, Q, rq, better) => {
    const c1 = circ(P, rp, Q, rq, 1), c2 = circ(P, rp, Q, rq, -1);
    return better(c1, c2) ? {pt: c1, side: 1} : {pt: c2, side: -1};
  };
  const Y = pick(X, H.XY, Z, H.ZY, (p, q) => p[1] > q[1]);
  const W = pick(X, H.XW, Z, H.ZW, (p, q) => p[1] < q[1]);
  const V = pick(X, H.XV, Y.pt, H.YV, (p, q) => p[0] < q[0]);
  const U = pick(V.pt, H.VU, W.pt, H.WU, (p, q) => p[0] < q[0]);
  const T = pick(W.pt, H.WT, U.pt, H.UT, (p, q) => p[1] < q[1]);
  _sides = {Y: Y.side, W: W.side, V: V.side, U: U.side, T: T.side};
  return _sides;
}

const TOL = {mm: 1.0, deg: 1.0, rel: 0.01};

function makeRecorder(scaleMM) {
  const checks = [];
  // detail(k) -> string: specific diagnostic at the worst sample k (only evaluated on failure)
  const add = (family) => (name, vals, unit = 'mm', tolOverride, detail) => {
    const xs = vals.map((x) => (Number.isFinite(x) ? x : Infinity));
    const v = Math.max(...xs);
    const k = xs.indexOf(v);
    const tol = tolOverride ?? (unit === 'deg' ? TOL.deg : unit === 'rel' ? TOL.rel : TOL.mm * scaleMM);
    const c = {family, name, value: v, tol, pass: v <= tol, k, unit};
    if (!c.pass && detail) {
      try { c.detail = detail(k); } catch (e) { c.detail = null; }
    }
    checks.push(c);
  };
  return {
    checks,
    meta: add('META'), param: add('PARAM'), gt: add('GT'), panel: add('PANEL'),
    design: (name, v, tol, detail) => checks.push({family: 'DESIGN', name, value: v, tol, pass: v <= tol, ...(v > tol && detail ? {detail: typeof detail === 'function' ? detail() : detail} : {})}),
  };
}

const PROBE = `window.__probeL = (ts, names, qs, near) => ts.map((t) => {
  const out = {t, err: null, m: {}, panel: {}, near: []};
  try { SIM.render(t); } catch (e) { out.err = String(e && e.message || e); return out; }
  SIM.scene.updateMatrixWorld(true);
  const v = new SIM.scene.position.constructor();
  for (const n of names) {
    const o = SIM.scene.getObjectByName(n);
    if (!o) { out.m[n] = null; continue; }
    o.getWorldPosition(v);
    out.m[n] = [v.x, v.y, v.z];
  }
  for (const q of qs) { const el = document.querySelector('[data-q="' + q + '"]'); out.panel[q] = el ? el.textContent : null; }
  out.near = (near || []).map(([part, mk]) => {
    const o = SIM.scene.getObjectByName(part), m = SIM.scene.getObjectByName(mk);
    if (!o || !m) return -1;
    m.getWorldPosition(v);
    const px = v.x, py = v.y, w = new v.constructor();
    let best = Infinity;
    o.traverse((ch) => {
      const pa = ch.isMesh && ch.geometry && ch.geometry.attributes && ch.geometry.attributes.position;
      if (!pa) return;
      for (let i = 0; i < pa.count; i++) {
        w.fromBufferAttribute(pa, i).applyMatrix4(ch.matrixWorld);
        const d = Math.hypot(w.x - px, w.y - py);
        if (d < best) best = d;
      }
    });
    return best === Infinity ? -1 : best;
  });
  return out;
});`;

export async function checkLite(page, url, id) {
  const spec = LITE_SPECS[id], mech = MECH[id];
  const res = {load: {}, checks: [], fails: []};
  const errors = [];
  const onErr = (e) => errors.push(String(e.message || e));
  const onCon = (m) => m.type() === 'error' && errors.push(m.text());
  page.on('pageerror', onErr);
  page.on('console', onCon);
  const done = () => {
    page.off('pageerror', onErr);
    page.off('console', onCon);
    res.load.errors = errors.slice(0, 5);
    res.fails = [...new Set(res.checks.filter((c) => !c.pass).map((c) => c.family))];
    if (res.load.ok === false) res.fails.unshift('LOAD');
    return res;
  };
  try {
    await page.goto(url + '?capture', {waitUntil: 'load', timeout: 20000});
    await page.waitForFunction(() => window.SIM_READY === true && window.SIM && typeof window.SIM.render === 'function', null, {timeout: 15000});
  } catch (e) {
    res.load = {ok: false, reason: String(e.message).split('\n')[0]};
    return done();
  }
  const meta = await page.evaluate(() => ({params: JSON.parse(JSON.stringify(window.SIM.params ?? null)), period: Number(window.SIM.period)}));
  const params = meta.params;
  if (!params || !Number.isFinite(params.omega) || params.omega === 0) {
    res.load = {ok: false, reason: 'SIM.params missing or omega invalid', params};
    return done();
  }
  res.params = params;
  const parts = spec.parts(params);
  const names = Object.entries(parts).flatMap(([p, pts]) => pts.map((x) => `${p}@${x}`));
  const qs = spec.panel.map((p) => p.q);
  await page.evaluate(PROBE);
  const near = mech.near || [];
  const probe = (ts) => page.evaluate(([ts, n, q, nr]) => window.__probeL(ts, n, q, nr), [ts, names, qs, near]);
  const Tin = TAU / Math.abs(params.omega);
  const revs = mech.revs(params);
  const N = 120 * revs;
  const times = Array.from({length: N}, (_, k) => (k * Tin * revs) / N + 0.0123 * Tin);
  const fwd = await probe(times);
  const missing = names.filter((n) => fwd[0].m[n] == null);
  const renderErr = fwd.find((s) => s.err)?.err || null;
  res.load = {ok: !renderErr && missing.length === 0, missing, renderErr};
  if (!res.load.ok) return done();

  // characteristic size -> mm tolerance scale (1 mm per 100 mm of machine, at least 1)
  let span = 0;
  for (const n of names) span = Math.max(span, Math.hypot(fwd[0].m[n][0] - fwd[0].m[names[0]][0], fwd[0].m[n][1] - fwd[0].m[names[0]][1]));
  const scale = Math.max(1, span / 100);
  const R = makeRecorder(scale);
  const P = (n) => fwd.map((s) => s.m[n]);
  const panel = (q) => fwd.map((s) => num(s.panel[q]));
  R.param('SIM.period = 2pi/|omega| (rel)', [Math.abs(meta.period - Tin) / Tin], 'rel');

  // META: determinism
  const sh = await probe(times.slice().reverse());
  const byT = new Map(sh.map((s) => [s.t, s]));
  let det = 0;
  for (const s of fwd) for (const n of names) det = Math.max(det, dist(s.m[n], byT.get(s.t).m[n]));
  R.meta('determinism (order independence)', [det]);
  // META: periodicity over system period
  const pts = times.filter((_, k) => k % 10 === 0);
  const later = await probe(pts.map((t) => t + Tin * revs));
  let per = 0;
  pts.forEach((t, i) => {
    const a = fwd[times.indexOf(t)];
    for (const n of names) {
      if (id === 'geneva' && n.startsWith('wheel@s')) continue; // slots are permuted after indexing; wheel checked by GT
      per = Math.max(per, dist(a.m[n], later[i].m[n]));
    }
  });
  if (id !== 'planetary') R.meta('periodicity', [per]);
  // META: rigidity per part, coincidence per point, frame static
  for (const [p, ptsOf] of Object.entries(parts)) {
    const mk = ptsOf.map((x) => `${p}@${x}`);
    let rig = 0;
    for (let i = 0; i < mk.length; i++) for (let j = i + 1; j < mk.length; j++) {
      const ds = fwd.map((s) => dist(s.m[mk[i]], s.m[mk[j]]));
      rig = Math.max(rig, Math.max(...ds) - Math.min(...ds));
    }
    if (mk.length > 1) {
      let worst = null, wv = -1;
      for (let i = 0; i < mk.length; i++) for (let j = i + 1; j < mk.length; j++) {
        const ds = fwd.map((s) => dist(s.m[mk[i]], s.m[mk[j]]));
        const r = Math.max(...ds) - Math.min(...ds);
        if (r > wv) { wv = r; worst = [mk[i], mk[j], Math.min(...ds), Math.max(...ds)]; }
      }
      R.meta(`rigid ${p}`, [rig], 'mm', undefined, () => `distance ${worst[0]} - ${worst[1]} varies between ${f1(worst[2])} and ${f1(worst[3])} mm over the cycle; markers of one part must move rigidly together`);
    }
  }
  const byPoint = {};
  for (const [p, ptsOf] of Object.entries(parts)) for (const x of ptsOf) (byPoint[x] ||= []).push(`${p}@${x}`);
  for (const [x, mks] of Object.entries(byPoint)) {
    if (mks.length < 2) continue;
    let c = 0;
    for (const s of fwd) for (let i = 1; i < mks.length; i++) c = Math.max(c, dist(s.m[mks[0]], s.m[mks[i]]));
    const cs = fwd.map((s) => Math.max(...mks.slice(1).map((m) => dist(s.m[mks[0]], s.m[m]))));
    R.meta(`joint ${x} coincident`, cs, 'mm', undefined,
      (k) => `at t=${times[k].toFixed(3)} s the markers ${mks.join(', ')} are at ${mks.map((m) => fp(fwd[k].m[m])).join(', ')} (${f1(cs[k])} mm apart); parts sharing joint ${x} must meet there at every instant`);
  }
  const fr = names.filter((n) => n.startsWith('frame@'));
  R.meta('frame static', fr.map((n) => Math.max(...fwd.map((s) => dist(s.m[n], fwd[0].m[n])))));

  try {
    mech.check({times, P, params, panel, revs, scale, near: (i) => fwd.map((s) => s.near?.[i])}, R);
  } catch (e) {
    R.design('params usable by oracle: ' + String(e.message).slice(0, 60), 1, 0.5);
  }
  res.checks = R.checks;
  return done();
}

async function main() {
  const argv = process.argv.slice(2);
  const oi = argv.indexOf('--out');
  const outFile = oi >= 0 ? argv.splice(oi, 2)[1] : null;
  const qi = argv.indexOf('--quiet');
  const quiet = qi >= 0 && argv.splice(qi, 1);
  const srv = await startServer();
  const browser = await launch();
  const ctx = await browser.newContext({viewport: {width: 960, height: 600}});
  for (const f of argv) {
    const abs = path.resolve(f);
    const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
    const id = mechOfLite(abs);
    const page = await ctx.newPage();
    const t0 = Date.now();
    let r;
    try {
      r = await checkLite(page, `${srv.url}/${rel}`, id);
    } catch (e) {
      r = {load: {ok: false, reason: 'oracle crash: ' + String(e.message).split('\n')[0]}, checks: [], fails: ['LOAD']};
    }
    await page.close();
    const rec = {file: rel, mech: id, pass: r.fails.length === 0, ...r, secs: (Date.now() - t0) / 1000};
    if (outFile) fs.appendFileSync(outFile, JSON.stringify(rec) + '\n');
    console.log(`${rec.pass ? 'PASS' : 'FAIL'} ${rel} [${r.fails.join(',')}]`);
    if (!quiet) {
      if (r.load.ok === false) console.log('   load:', JSON.stringify(r.load).slice(0, 300));
      for (const c of r.checks.filter((c) => !c.pass)) console.log(`   ${c.family.padEnd(6)} ${c.name}: ${+c.value.toPrecision(3)} (tol ${+c.tol.toPrecision(3)})${c.detail ? '\n          ' + c.detail : ''}`);
    }
  }
  await browser.close();
  srv.close();
}
if (process.argv[1]?.endsWith('run_oracle_lite.mjs')) main();
