// Phase-2 "spec-lite" mechanisms: plain-language description, the generator chooses dimensions/placement/speed/direction
// and reports them in SIM.params. The only structural convention is marker objects "<part>@<point>".
//   node oracle/lite_specs.mjs   -> writes specs_lite/<id>.prompt.md and specs_lite/<id>.mech.md
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const LITE_SPECS = {
  four_bar: {
    title: 'four-bar crank-rocker linkage',
    prose: `A planar four-bar linkage of the crank-rocker type: the input crank turns continuously at constant speed and drives an oscillating rocker through a coupler.
Points: O2 = crank ground pivot, O4 = rocker ground pivot, A = crank-coupler joint, B = coupler-rocker joint.`,
    parts: () => ({frame: ['O2', 'O4'], crank: ['O2', 'A'], coupler: ['A', 'B'], rocker: ['B', 'O4']}),
    partsDoc: `- frame: O2, O4
- crank: O2, A
- coupler: A, B
- rocker: B, O4`,
    params: `{ a: crank length O2-A, b: coupler length A-B, c: rocker length O4-B, d: ground length O2-O4 (all mm),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A measured from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'crank_deg', desc: 'crank angle, direction O2->A from world +X, degrees in [0, 360)'},
      {q: 'rocker_deg', desc: 'rocker angle, direction O4->B from world +X, degrees in [0, 360)'},
    ],
  },
  geneva: {
    title: 'external Geneva drive (Maltese-cross indexing mechanism)',
    prose: `An external Geneva drive: a continuously rotating driver carrying a drive pin indexes a slotted wheel in equal steps and holds it locked between steps. Choose the number of slots n between 4 and 6.
Points: O = driver pivot, W = wheel pivot, pin = centre of the drive pin, s0 ... s(n-1) = one point on the centre line of each slot near the wheel rim, numbered counter-clockwise.`,
    parts: (p) => ({frame: ['O', 'W'], driver: ['O', 'pin'], wheel: ['W', ...Array.from({length: Math.max(0, p?.n | 0)}, (_, k) => `s${k}`)]}),
    partsDoc: `- frame: O, W
- driver: O, pin
- wheel: W, s0, s1, ..., s(n-1)`,
    params: `{ n: number of slots, C: centre distance O-W, a: pin radius O-pin (mm),
  omega: driver angular velocity in rad/s (counter-clockwise positive),
  phi0: driver angle (direction O->pin from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'driver_deg', desc: 'driver angle, direction O->pin from world +X, degrees in [0, 360)'},
      {q: 'wheel_deg', desc: 'wheel angle, direction W->s0 from world +X, degrees in [0, 360)'},
    ],
  },
  jansen: {
    title: "leg of Theo Jansen's Strandbeest linkage",
    prose: `One leg of Theo Jansen's Strandbeest walking linkage, with the link lengths of Jansen's published "holy numbers", driven by a crank turning at constant speed. The foot should trace the characteristic flat-bottomed walking path.
Points: O = crank axle (fixed), X = the second fixed pivot, Z = crank pin, Y = upper joint (upper crank rod meets the upper triangle), W = lower joint (lower crank rod meets the link from X), V = outer apex of the upper triangle X-Y-V, U = knee (link from V meets the leg triangle), T = foot (tip of the leg triangle W-U-T).`,
    parts: () => ({
      frame: ['O', 'X'], crank: ['O', 'Z'], rodUpper: ['Z', 'Y'], rodLower: ['Z', 'W'], upperTriangle: ['X', 'Y', 'V'],
      linkXW: ['X', 'W'], linkVU: ['V', 'U'], legTriangle: ['W', 'U', 'T'],
    }),
    partsDoc: `- frame: O, X
- crank: O, Z
- rodUpper: Z, Y
- rodLower: Z, W
- upperTriangle: X, Y, V
- linkXW: X, W
- linkVU: V, U
- legTriangle: W, U, T`,
    params: `{ O: [x, y] of the crank axle, X: [x, y] of the second fixed pivot (mm),
  len: { OZ, ZY, XY, ZW, XW, XV, YV, VU, WU, UT, WT } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O->Z from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'crank_deg', desc: 'crank angle, direction O->Z from world +X, degrees in [0, 360)'},
      {q: 'foot_x', desc: 'x coordinate of the foot T in mm'},
      {q: 'foot_y', desc: 'y coordinate of the foot T in mm'},
    ],
  },
  planetary: {
    title: 'planetary (epicyclic) gear set',
    prose: `A simple planetary gear set with three equally spaced planets: the ring gear is held fixed, the sun gear is the input turning at constant speed, and the planet carrier is the output. Spur gears with one common module.
Points: C = central axis, P0, P1, P2 = planet axles (on the carrier), sunRef / ringRef / planet0Ref / planet1Ref / planet2Ref = a point on that gear's pitch circle, fixed to that gear.`,
    parts: () => ({
      frame: ['C'], sun: ['C', 'sunRef'], ring: ['C', 'ringRef'], carrier: ['C', 'P0', 'P1', 'P2'],
      planet0: ['P0', 'planet0Ref'], planet1: ['P1', 'planet1Ref'], planet2: ['P2', 'planet2Ref'],
    }),
    partsDoc: `- frame: C
- sun: C, sunRef
- ring: C, ringRef
- carrier: C, P0, P1, P2
- planet0: P0, planet0Ref
- planet1: P1, planet1Ref
- planet2: P2, planet2Ref`,
    params: `{ module: gear module in mm, Zs: sun teeth, Zp: planet teeth, Zr: ring teeth,
  omega: sun angular velocity in rad/s (counter-clockwise positive),
  theta0: sun angle (direction C->sunRef from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'sun_deg', desc: 'sun angle, direction C->sunRef from world +X, degrees in [0, 360)'},
      {q: 'carrier_deg', desc: 'carrier angle, direction C->P0 from world +X, degrees in [0, 360)'},
      {q: 'ratio', desc: 'speed ratio |omega_sun / omega_carrier| (dimensionless)'},
    ],
  },
  // ---- phase 5 additions ----
  cam: {
    title: 'disk cam with a translating roller follower (rise-dwell-return-dwell)',
    prose: `A plate (disk) cam turning at constant speed drives a translating roller follower; the follower's line of motion may be offset from the cam axis. During each cam revolution the follower rises by h with cycloidal motion, dwells at the top, returns with cycloidal motion, and dwells at the bottom. The cam outline must be the exact profile that produces this motion, so the roller touches the cam surface at every instant (no gap, no penetration). Design it so that the pressure angle never exceeds 30 degrees and the profile is not undercut. At t = 0 the follower is at the start of its rise.
Points: O = cam axis, G = a fixed point on the follower's line of motion, camRef = a point fixed on the cam, C = roller centre, F = top end of the follower stem.`,
    parts: () => ({frame: ['O', 'G'], cam: ['O', 'camRef'], follower: ['C', 'F']}),
    partsDoc: `- frame: O, G
- cam: O, camRef
- follower: C, F (the roller is part of the follower; its spin is not checked)`,
    params: `{ Rb: base-circle radius of the cam surface, Rr: roller radius, e: follower offset = distance from O to the follower's line of motion, h: total lift (all mm),
  axisAngle: direction in which the follower rises, measured from world +X (rad),
  betaRise, betaDwellTop, betaReturn, betaDwellBottom: cam rotation angle spent in each of the four phases (rad, they sum to 2*pi),
  omega: cam angular velocity in rad/s (counter-clockwise positive),
  theta0: cam angle (direction O->camRef from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'cam_deg', desc: 'cam angle, direction O->camRef from world +X, degrees in [0, 360)'},
      {q: 'lift', desc: 'follower displacement above its lowest position, mm'},
    ],
  },
  watt6: {
    title: 'Watt II six-bar linkage (two four-bar loops in series)',
    prose: `A Watt II six-bar linkage made of two four-bar loops in series. The input crank O2-A turns continuously at constant speed; coupler 1 (A-B) drives a ternary rocker (ground pivot O4, joints B and C) that oscillates; coupler 2 (C-D) drives the output rocker O6-D, which oscillates. Both loops must assemble and move smoothly over the whole crank revolution, with transmission angles staying between 30 and 150 degrees in both loops.
Points: O2, O4, O6 = ground pivots, A = crank-coupler 1 joint, B = coupler 1-ternary rocker joint, C = ternary rocker-coupler 2 joint, D = coupler 2-output rocker joint.`,
    parts: () => ({frame: ['O2', 'O4', 'O6'], crank: ['O2', 'A'], coupler1: ['A', 'B'], rocker1: ['O4', 'B', 'C'], coupler2: ['C', 'D'], rocker2: ['O6', 'D']}),
    partsDoc: `- frame: O2, O4, O6
- crank: O2, A
- coupler1: A, B
- rocker1: O4, B, C
- coupler2: C, D
- rocker2: O6, D`,
    params: `{ O2: [x, y], O4: [x, y], O6: [x, y] (mm),
  len: { O2A, AB, O4B, O4C, BC, CD, O6D } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'crank_deg', desc: 'crank angle, direction O2->A from world +X, degrees in [0, 360)'},
      {q: 'rocker1_deg', desc: 'ternary rocker angle, direction O4->B from world +X, degrees in [0, 360)'},
      {q: 'output_deg', desc: 'output rocker angle, direction O6->D from world +X, degrees in [0, 360)'},
    ],
  },
  // ---- phase 7 additions (published design knowledge other than Jansen) ----
  lambda: {
    title: "Chebyshev lambda linkage (straight-line mechanism)",
    prose: `Chebyshev's lambda linkage: a four-bar linkage with Chebyshev's classical link proportions, whose coupler is extended to a tracing point P that moves along an approximately straight line for a large part of each crank revolution. The input crank turns continuously at constant speed.
Points: O2 = crank ground pivot, O4 = rocker ground pivot, A = crank-coupler joint, B = coupler-rocker joint, P = tracing point on the coupler.`,
    parts: () => ({frame: ['O2', 'O4'], crank: ['O2', 'A'], coupler: ['A', 'B', 'P'], rocker: ['O4', 'B']}),
    partsDoc: `- frame: O2, O4
- crank: O2, A
- coupler: A, B, P
- rocker: O4, B`,
    params: `{ O2: [x, y], O4: [x, y] (mm),
  len: { O2A, O4B, AB, AP } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A from world +X, rad) at t = 0 }`,
    panel: [
      {q: 'crank_deg', desc: 'crank angle, direction O2->A from world +X, degrees in [0, 360)'},
      {q: 'P_x', desc: 'x coordinate of the tracing point P in mm'},
      {q: 'P_y', desc: 'y coordinate of the tracing point P in mm'},
    ],
  },
  peaucellier: {
    title: 'Peaucellier–Lipkin linkage (exact straight-line mechanism)',
    prose: `The Peaucellier–Lipkin linkage (Peaucellier inversor) driven by an input crank, arranged so that the output point P moves along an exactly straight line. The crank cannot turn a full revolution in this mechanism, so it swings back and forth: crank angle = thetaMid + thetaAmp * sin(omega * t). Choose the swing so that the linkage can be assembled over the whole swing.
Points: O = crank ground pivot, Q = the inversor's fixed centre (second ground pivot), A = crank end (the inversor's input vertex), B and D = the two side vertices of the rhombus, P = output vertex of the rhombus (opposite A). The two long arms run from Q to B and from Q to D; the rhombus is A-B-P-D.`,
    parts: () => ({frame: ['O', 'Q'], crank: ['O', 'A'], armB: ['Q', 'B'], armD: ['Q', 'D'], linkAB: ['A', 'B'], linkAD: ['A', 'D'], linkBP: ['B', 'P'], linkDP: ['D', 'P']}),
    partsDoc: `- frame: O, Q
- crank: O, A
- armB: Q, B
- armD: Q, D
- linkAB: A, B
- linkAD: A, D
- linkBP: B, P
- linkDP: D, P`,
    params: `{ O: [x, y], Q: [x, y] (mm),
  len: { OA, QB, QD, AB, AD, BP, DP } (mm, the distance between the two named points),
  omega: angular frequency of the crank swing in rad/s,
  thetaMid: mid-swing crank angle (direction O->A from world +X, rad), thetaAmp: swing amplitude (rad) }`,
    panel: [
      {q: 'crank_deg', desc: 'crank angle, direction O->A from world +X, degrees in [0, 360)'},
      {q: 'P_x', desc: 'x coordinate of the output point P in mm'},
      {q: 'P_y', desc: 'y coordinate of the output point P in mm'},
    ],
  },
};

export const LITE_CONTRACT = `## Output contract (follow exactly — the page is checked automatically)

1. ONE self-contained HTML file. three.js only, loaded with exactly this import map (no other network resources):
   <script type="importmap">{"imports":{"three":"/vendor/three.module.js"}}</script>
   then <script type="module"> import * as THREE from 'three'; ... </script>
2. Scene: full-window WebGL canvas, lit, shaded 3D parts with real thickness, a camera that shows the whole machine. The mechanism moves in the world XY plane, +Z toward the viewer, 1 scene unit = 1 mm, angles counter-clockwise about +Z are positive. Placement, dimensions, speed and direction are your choice unless stated above.
3. Parts and markers: each part listed above is one THREE.Object3D named exactly as the part, holding all of that part's meshes so they move rigidly with it (the fixed frame is the part "frame"). For every point listed for a part, add a child THREE.Object3D (may be empty) named "<part>@<point>" (e.g. "crank@A") placed exactly at that point, so it moves with the part. A point shared by several parts gets one marker on each of them. Do not scale the named objects.
4. Panel: an HTML overlay showing each panel quantity in its own element with attribute data-q="<name>"; its text starts with the number.
5. Expose, before the first frame:
     window.SIM = { scene, camera, renderer, period: <seconds per input revolution>, params: { ...as listed above, the values your simulator actually uses... }, render(t) }
   render(t) poses every part, updates the panel and draws the frame for time t (seconds). It must be a PURE function of t: no Math.random, no Date/performance.now, no state carried between calls; it may be called at arbitrary times in any order. Then set window.SIM_READY = true.
6. Live viewing: unless the URL contains "?capture", run a requestAnimationFrame loop calling SIM.render(elapsed seconds).`;

export function buildLitePrompt(id) {
  const m = LITE_SPECS[id];
  return `# Build an interactive 3D simulator of a ${m.title}

${m.prose}

## Parts and their marker points
${m.partsDoc}

## SIM.params
${m.params}

## Panel quantities
${m.panel.map((p) => `- data-q="${p.q}": ${p.desc}`).join('\n')}

${LITE_CONTRACT}
`;
}

if (process.argv[1]?.endsWith('lite_specs.mjs')) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dir = path.join(root, 'specs_lite');
  fs.mkdirSync(dir, {recursive: true});
  for (const id of Object.keys(LITE_SPECS)) {
    const full = buildLitePrompt(id);
    fs.writeFileSync(path.join(dir, `${id}.prompt.md`), full);
    fs.writeFileSync(path.join(dir, `${id}.mech.md`), full.split('## Output contract')[0].trim() + '\n');
  }
  console.log('written', Object.keys(LITE_SPECS).join(', '));
}
