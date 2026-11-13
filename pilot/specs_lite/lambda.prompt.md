# Build an interactive 3D simulator of a Chebyshev lambda linkage (straight-line mechanism)

Chebyshev's lambda linkage: a four-bar linkage with Chebyshev's classical link proportions, whose coupler is extended to a tracing point P that moves along an approximately straight line for a large part of each crank revolution. The input crank turns continuously at constant speed.
Points: O2 = crank ground pivot, O4 = rocker ground pivot, A = crank-coupler joint, B = coupler-rocker joint, P = tracing point on the coupler.

## Parts and their marker points
- frame: O2, O4
- crank: O2, A
- coupler: A, B, P
- rocker: O4, B

## SIM.params
{ O2: [x, y], O4: [x, y] (mm),
  len: { O2A, O4B, AB, AP } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A from world +X, rad) at t = 0 }

## Panel quantities
- data-q="crank_deg": crank angle, direction O2->A from world +X, degrees in [0, 360)
- data-q="P_x": x coordinate of the tracing point P in mm
- data-q="P_y": y coordinate of the tracing point P in mm

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
