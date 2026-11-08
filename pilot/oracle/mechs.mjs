// Specs + analytic ground truth for the pilot mechanisms.
// Units: mm, seconds, radians internally. Mechanism plane = world XY, +Z toward viewer, CCW about +Z positive.
// Each body: a THREE.Object3D named `name`, local origin at `origin`, local +X toward `xAxis`.
// gt(t) -> {bodies: {name: {p:[x,y], ang}}, panel: {q: value}}

const TAU = 2 * Math.PI;
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const deg = (r) => (r * 180) / Math.PI;
const mod360 = (d) => ((d % 360) + 360) % 360;

// ---------- slider-crank ----------
const SC = {r: 40, l: 120, T: 4};
const sliderCrank = {
  id: 'slider_crank',
  title: 'Slider-crank (inline, zero offset)',
  period: 4,
  systemPeriod: 4,
  prose: `An inline slider-crank (piston engine kinematics, zero offset).
- Crank radius r = ${SC.r} mm, connecting rod length l = ${SC.l} mm.
- Crank pivot O is fixed at the world origin (0,0,0). The piston slides along the world +X axis (its pin C always has y = 0, x > 0).
- The crank turns counter-clockwise (about +Z) at constant speed, one revolution every ${SC.T} s. Crank angle theta(t) = 2*pi*t/${SC.T}, theta(0) = 0 (crank pin B on the +X axis at t = 0).
- B = crank pin (end of crank, start of rod); C = piston pin (end of rod).`,
  bodies: [
    {name: 'crank', origin: 'O (crank pivot)', xAxis: 'B (crank pin)'},
    {name: 'rod', origin: 'B (crank pin)', xAxis: 'C (piston pin)'},
    {name: 'piston', origin: 'C (piston pin)', xAxis: 'world +X (the piston never rotates)'},
  ],
  panel: [
    {q: 'crank_deg', desc: 'crank angle theta in degrees, wrapped to [0, 360)', kind: 'angle'},
    {q: 'piston_x', desc: 'x coordinate of the piston pin C in mm', kind: 'len'},
  ],
  gt(t) {
    const th = (TAU * t) / SC.T;
    const B = [SC.r * Math.cos(th), SC.r * Math.sin(th)];
    const C = [B[0] + Math.sqrt(SC.l ** 2 - B[1] ** 2), 0];
    return {
      bodies: {
        crank: {p: [0, 0], ang: th},
        rod: {p: B, ang: Math.atan2(C[1] - B[1], C[0] - B[0])},
        piston: {p: C, ang: 0},
      },
      panel: {crank_deg: mod360(deg(th)), piston_x: C[0]},
    };
  },
  structural(get) {
    // joint closure + slider line, from link lengths only
    return {
      'crank.B==rod.origin': dist(get('crank', [SC.r, 0]), get('rod', [0, 0])),
      'rod.C==piston.origin': dist(get('rod', [SC.l, 0]), get('piston', [0, 0])),
      'piston on y=0': Math.abs(get('piston', [0, 0])[1]),
    };
  },
};

// ---------- four-bar crank-rocker ----------
const FB = {a: 40, b: 120, c: 80, d: 100, T: 4};
function fourBarB(th) {
  const A = [FB.a * Math.cos(th), FB.a * Math.sin(th)];
  const O4 = [FB.d, 0];
  const D = [O4[0] - A[0], O4[1] - A[1]];
  const L = Math.hypot(D[0], D[1]);
  const u = [D[0] / L, D[1] / L];
  const aa = (FB.b ** 2 - FB.c ** 2 + L ** 2) / (2 * L);
  const h = Math.sqrt(Math.max(0, FB.b ** 2 - aa ** 2));
  const B = [A[0] + aa * u[0] - h * u[1], A[1] + aa * u[1] + h * u[0]]; // left of A->O4
  return {A, B, O4};
}
const fourBar = {
  id: 'four_bar',
  title: 'Four-bar linkage (Grashof crank-rocker)',
  period: 4,
  systemPeriod: 4,
  prose: `A planar four-bar linkage, Grashof crank-rocker.
- Ground pivots: O2 at the world origin (0,0,0), O4 at (${FB.d}, 0, 0). Ground link length d = ${FB.d} mm.
- Crank O2-A length a = ${FB.a} mm, coupler A-B length b = ${FB.b} mm, rocker O4-B length c = ${FB.c} mm.
- The crank turns counter-clockwise at constant speed, one revolution every ${FB.T} s: theta(t) = 2*pi*t/${FB.T}, theta(0) = 0 (A on the +X axis at t = 0).
- Assembly branch: B is always on the LEFT of the directed line from A to O4 (at t = 0, B is above the X axis, y > 0).`,
  bodies: [
    {name: 'crank', origin: 'O2', xAxis: 'A'},
    {name: 'coupler', origin: 'A', xAxis: 'B'},
    {name: 'rocker', origin: 'O4', xAxis: 'B'},
  ],
  panel: [
    {q: 'crank_deg', desc: 'crank angle theta in degrees, wrapped to [0, 360)', kind: 'angle'},
    {q: 'rocker_deg', desc: 'angle of the rocker O4->B measured from world +X, degrees, wrapped to [0, 360)', kind: 'angle'},
  ],
  gt(t) {
    const th = (TAU * t) / FB.T;
    const {A, B, O4} = fourBarB(th);
    const rk = Math.atan2(B[1] - O4[1], B[0] - O4[0]);
    return {
      bodies: {
        crank: {p: [0, 0], ang: th},
        coupler: {p: A, ang: Math.atan2(B[1] - A[1], B[0] - A[0])},
        rocker: {p: O4, ang: rk},
      },
      panel: {crank_deg: mod360(deg(th)), rocker_deg: mod360(deg(rk))},
    };
  },
  structural(get) {
    return {
      'crank.A==coupler.origin': dist(get('crank', [FB.a, 0]), get('coupler', [0, 0])),
      'coupler.B==rocker.B': dist(get('coupler', [FB.b, 0]), get('rocker', [FB.c, 0])),
      'crank at O2': dist(get('crank', [0, 0]), [0, 0]),
      'rocker at O4': dist(get('rocker', [0, 0]), [FB.d, 0]),
    };
  },
};

// ---------- compound gear train ----------
const GT = {m: 2, z1: 20, z2: 40, z3: 15, z4: 45, T: 4};
const r = (z) => (GT.m * z) / 2;
const gearTrain = {
  id: 'gear_train',
  title: 'Two-stage compound spur gear train',
  period: 4,
  systemPeriod: 24,
  prose: `A two-stage compound spur gear train, module m = ${GT.m} mm (pitch radius = m*z/2).
- gear1: z1 = ${GT.z1} teeth (pitch radius ${r(GT.z1)} mm), input, centre at (0,0,0).
- gear2: z2 = ${GT.z2} teeth (pitch radius ${r(GT.z2)} mm), meshes with gear1, centre at (${r(GT.z1) + r(GT.z2)}, 0, 0).
- gear3: z3 = ${GT.z3} teeth (pitch radius ${r(GT.z3)} mm), fixed on the SAME shaft as gear2 (same centre, turns with gear2), placed in front of gear2 (larger z).
- gear4: z4 = ${GT.z4} teeth (pitch radius ${r(GT.z4)} mm), output, meshes with gear3, centre at (${r(GT.z1) + r(GT.z2)}, ${r(GT.z3) + r(GT.z4)}, 0) (z offset like gear3 so it meshes with gear3).
- gear1 turns counter-clockwise at constant speed, one revolution every ${GT.T} s: theta1(t) = 2*pi*t/${GT.T}, theta1(0) = 0. All other gears follow by meshing.
- Each gear body's rotation angle about its own axis must be exactly its kinematic angle (0 at t = 0). Put any tooth phase offset needed for a clean mesh on the child mesh, not on the named body.`,
  bodies: [
    {name: 'gear1', origin: 'centre of gear1', xAxis: 'a reference direction fixed on gear1 (world +X at t = 0)'},
    {name: 'gear2', origin: 'centre of gear2', xAxis: 'reference direction fixed on gear2 (world +X at t = 0)'},
    {name: 'gear3', origin: 'centre of gear3', xAxis: 'reference direction fixed on gear3 (world +X at t = 0)'},
    {name: 'gear4', origin: 'centre of gear4', xAxis: 'reference direction fixed on gear4 (world +X at t = 0)'},
  ],
  panel: [
    {q: 'input_deg', desc: 'gear1 angle in degrees, wrapped to [0, 360)', kind: 'angle'},
    {q: 'output_deg', desc: 'gear4 angle in degrees (counter-clockwise positive), wrapped to [0, 360)', kind: 'angle'},
    {q: 'ratio', desc: 'overall speed ratio |omega_in / omega_out| (dimensionless)', kind: 'scalar'},
  ],
  gt(t) {
    const t1 = (TAU * t) / GT.T;
    const t2 = (-t1 * GT.z1) / GT.z2;
    const t4 = (-t2 * GT.z3) / GT.z4;
    const c2 = [r(GT.z1) + r(GT.z2), 0];
    const c4 = [c2[0], r(GT.z3) + r(GT.z4)];
    return {
      bodies: {
        gear1: {p: [0, 0], ang: t1},
        gear2: {p: c2, ang: t2},
        gear3: {p: c2, ang: t2},
        gear4: {p: c4, ang: t4},
      },
      panel: {input_deg: mod360(deg(t1)), output_deg: mod360(deg(t4)), ratio: (GT.z2 * GT.z4) / (GT.z1 * GT.z3)},
    };
  },
  structural(get, ang) {
    // pitch-line rolling without slip, written as angle relations between meshing gears (no absolute time)
    return {
      'gear2 coaxial gear3 (deg)': Math.abs(deg(wrapPi(ang('gear2') - ang('gear3')))),
      'centre distance 1-2': Math.abs(dist(get('gear1', [0, 0]), get('gear2', [0, 0])) - (r(GT.z1) + r(GT.z2))),
      'centre distance 3-4': Math.abs(dist(get('gear3', [0, 0]), get('gear4', [0, 0])) - (r(GT.z3) + r(GT.z4))),
    };
  },
  // mesh constraint across time: z1*dθ1 = -z2*dθ2 ; checked in run_oracle via unwrapped angles
  meshPairs: [['gear1', 'gear2', GT.z1, GT.z2], ['gear3', 'gear4', GT.z3, GT.z4]],
};

// ---------- Geneva drive ----------
const GV = {n: 4, C: 100, T: 4};
GV.a = GV.C * Math.sin(Math.PI / GV.n);
function genevaR(phi) {
  const n = Math.round(phi / TAU);
  const dl = phi - TAU * n;
  const q = Math.PI / 4;
  if (dl > q) return -(Math.PI / 2) * n - q;
  if (dl < -q) return -(Math.PI / 2) * n + q;
  const dir = Math.atan2(GV.a * Math.sin(dl), GV.a * Math.cos(dl) - GV.C);
  return -(Math.PI / 2) * n + wrapPi(dir - Math.PI);
}
const geneva = {
  id: 'geneva',
  title: 'External Geneva drive, 4 slots',
  period: 4,
  systemPeriod: 16,
  prose: `An external Geneva drive with 4 slots (intermittent motion).
- Driver (crank with a drive pin) pivots at the world origin (0,0,0). Wheel centre W at (${GV.C}, 0, 0): centre distance C = ${GV.C} mm.
- Pin radius on the driver a = C*sin(pi/4) = ${GV.a.toFixed(3)} mm, so the pin enters and leaves the slots tangentially. The 4 slots are radial, 90 degrees apart.
- The driver turns counter-clockwise at constant speed, one revolution every ${GV.T} s: phi(t) = 2*pi*t/${GV.T}, phi(0) = 0, i.e. at t = 0 the pin is on the +X axis, exactly halfway through an engagement, deep inside the slot that points from W toward the driver.
- While the pin is in a slot (|phi wrapped to (-pi, pi]| <= 45 deg) the wheel turns; otherwise the wheel is locked (dwell). Each driver revolution indexes the wheel by 90 degrees, clockwise.
- Wheel angle psi(t): 0 at t = 0, cumulative, counter-clockwise positive (so it decreases over time).`,
  bodies: [
    {name: 'driver', origin: 'driver pivot (world origin)', xAxis: 'the drive pin'},
    {name: 'wheel', origin: 'W (wheel centre)', xAxis: 'the axis of one slot; at t = 0 the wheel\'s local +X axis points along world +X (local -X slot points at the driver and holds the pin)'},
  ],
  panel: [
    {q: 'driver_deg', desc: 'driver angle phi in degrees, wrapped to [0, 360)', kind: 'angle'},
    {q: 'wheel_deg', desc: 'wheel angle psi in degrees, wrapped to [0, 360)', kind: 'angle'},
  ],
  gt(t) {
    const phi = (TAU * t) / GV.T;
    const R = genevaR(phi);
    return {
      bodies: {
        driver: {p: [0, 0], ang: phi},
        wheel: {p: [GV.C, 0], ang: R, sym: Math.PI / 2},
      },
      panel: {driver_deg: mod360(deg(phi)), wheel_deg: mod360(deg(R))},
    };
  },
  structural(get, ang, t) {
    // while engaged, the pin must lie on a slot axis of the wheel (local x or y axis)
    const phi = (TAU * t) / GV.T;
    const dl = wrapPi(phi);
    if (Math.abs(dl) > Math.PI / 4 - 0.02) return {};
    const pin = get('driver', [GV.a, 0]);
    const W = get('wheel', [0, 0]);
    const a = ang('wheel');
    const v = [pin[0] - W[0], pin[1] - W[1]];
    const lx = Math.cos(-a) * v[0] - Math.sin(-a) * v[1];
    const ly = Math.sin(-a) * v[0] + Math.cos(-a) * v[1];
    return {'pin on slot axis (mm)': Math.min(Math.abs(lx), Math.abs(ly))};
  },
};

function dist(p, q) {
  return Math.hypot(p[0] - q[0], p[1] - q[1]);
}

export const MECHS = {slider_crank: sliderCrank, four_bar: fourBar, gear_train: gearTrain, geneva};
export const TOL = {pos: 1.0, angDeg: 1.0, panelLen: 1.0, panelAngDeg: 1.0, panelScalar: 0.02, det: 1e-6, struct: 1.0, structDeg: 1.0};
export {wrapPi, deg, mod360};
