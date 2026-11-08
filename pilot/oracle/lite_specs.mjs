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
