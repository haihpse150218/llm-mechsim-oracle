# Build an interactive 3D simulator of a planetary (epicyclic) gear set

A simple planetary gear set with three equally spaced planets: the ring gear is held fixed, the sun gear is the input turning at constant speed, and the planet carrier is the output. Spur gears with one common module.
Points: C = central axis, P0, P1, P2 = planet axles (on the carrier), sunRef / ringRef / planet0Ref / planet1Ref / planet2Ref = a point on that gear's pitch circle, fixed to that gear.

## Parts and their marker points
- frame: C
- sun: C, sunRef
- ring: C, ringRef
- carrier: C, P0, P1, P2
- planet0: P0, planet0Ref
- planet1: P1, planet1Ref
- planet2: P2, planet2Ref

## SIM.params
{ module: gear module in mm, Zs: sun teeth, Zp: planet teeth, Zr: ring teeth,
  omega: sun angular velocity in rad/s (counter-clockwise positive),
  theta0: sun angle (direction C->sunRef from world +X, rad) at t = 0 }

## Panel quantities
- data-q="sun_deg": sun angle, direction C->sunRef from world +X, degrees in [0, 360)
- data-q="carrier_deg": carrier angle, direction C->P0 from world +X, degrees in [0, 360)
- data-q="ratio": speed ratio |omega_sun / omega_carrier| (dimensionless)

## Output contract (follow exactly — the page is checked automatically)

1. ONE self-contained HTML file. three.js only, loaded with exactly this import map (no other network resources):
   <script type="importmap">{"imports":{"three":"/vendor/three.module.js"}}</script>
   then <script type="module"> import * as THREE from 'three'; ... </script>
2. Scene: full-window WebGL canvas, lit, shaded 3D parts with real thickness, a camera that shows the whole machine. The mechanism moves in the world XY plane, +Z toward the viewer, 1 scene unit = 1 mm, angles counter-clockwise about +Z are positive. Placement, dimensions, speed and direction are your choice unless stated above.
3. Parts and markers: each part listed above is one THREE.Object3D named exactly as the part, holding all of that part's meshes so they move rigidly with it (the fixed frame is the part "frame"). For every point listed for a part, add a child THREE.Object3D (may be empty) named "<part>@<point>" (e.g. "crank@A") placed exactly at that point, so it moves with the part. A point shared by several parts gets one marker on each of them. Do not scale the named objects.
4. Panel: an HTML overlay showing each panel quantity in its own element with attribute data-q="<name>"; its text starts with the number.
5. Expose, before the first frame:
     window.SIM = { scene, camera, renderer, period: <seconds per input revolution>, params: { ...as listed above, the values your simulator actually uses... }, render(t) }
   render(t) poses every part, updates the panel and draws the frame for time t (seconds). It must be a PURE function of t: no Math.random, no Date/performance.now, no state carried between calls; it may be called at arbitrary times in any order. Then set window.SIM_READY = true.
6. Live viewing: unless the URL contains "?capture", run a requestAnimationFrame loop calling SIM.render(elapsed seconds).
