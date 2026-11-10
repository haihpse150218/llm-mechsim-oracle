# Build an interactive 3D simulator of a Watt II six-bar linkage (two four-bar loops in series)

A Watt II six-bar linkage made of two four-bar loops in series. The input crank O2-A turns continuously at constant speed; coupler 1 (A-B) drives a ternary rocker (ground pivot O4, joints B and C) that oscillates; coupler 2 (C-D) drives the output rocker O6-D, which oscillates. Both loops must assemble and move smoothly over the whole crank revolution, with transmission angles staying between 30 and 150 degrees in both loops.
Points: O2, O4, O6 = ground pivots, A = crank-coupler 1 joint, B = coupler 1-ternary rocker joint, C = ternary rocker-coupler 2 joint, D = coupler 2-output rocker joint.

## Parts and their marker points
- frame: O2, O4, O6
- crank: O2, A
- coupler1: A, B
- rocker1: O4, B, C
- coupler2: C, D
- rocker2: O6, D

## SIM.params
{ O2: [x, y], O4: [x, y], O6: [x, y] (mm),
  len: { O2A, AB, O4B, O4C, BC, CD, O6D } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A from world +X, rad) at t = 0 }

## Panel quantities
- data-q="crank_deg": crank angle, direction O2->A from world +X, degrees in [0, 360)
- data-q="rocker1_deg": ternary rocker angle, direction O4->B from world +X, degrees in [0, 360)
- data-q="output_deg": output rocker angle, direction O6->D from world +X, degrees in [0, 360)

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
