# Mechanism: Four-bar linkage (Grashof crank-rocker)

A planar four-bar linkage, Grashof crank-rocker.
- Ground pivots: O2 at the world origin (0,0,0), O4 at (100, 0, 0). Ground link length d = 100 mm.
- Crank O2-A length a = 40 mm, coupler A-B length b = 120 mm, rocker O4-B length c = 80 mm.
- The crank turns counter-clockwise at constant speed, one revolution every 4 s: theta(t) = 2*pi*t/4, theta(0) = 0 (A on the +X axis at t = 0).
- Assembly branch: B is always on the LEFT of the directed line from A to O4 (at t = 0, B is above the X axis, y > 0).

## Named bodies
- "crank": origin at O2; local +X toward A
- "coupler": origin at A; local +X toward B
- "rocker": origin at O4; local +X toward B

## Panel quantities
- data-q="crank_deg": crank angle theta in degrees, wrapped to [0, 360)
- data-q="rocker_deg": angle of the rocker O4->B measured from world +X, degrees, wrapped to [0, 360)

## Output contract (follow exactly — the page is checked automatically)

Write ONE self-contained HTML file: an interactive 3D simulator that shows how this machine moves, for an engineering student.

1. three.js only, loaded with exactly this import map (no other network resources, no CDN):
   <script type="importmap">{"imports":{"three":"/vendor/three.module.js"}}</script>
   then <script type="module"> import * as THREE from 'three'; ... </script>
2. Scene: full-window WebGL canvas, lit, shaded 3D parts with real thickness, a ground/frame for fixed pivots, a camera that shows the whole mechanism face-on or at a slight angle. Units: 1 scene unit = 1 mm. The mechanism lies in the world XY plane, +Z points toward the viewer, positive angles are counter-clockwise about +Z.
3. Named bodies: every moving body listed below is a THREE.Object3D (Group or Mesh) whose .name is exactly the given name, whose local origin is the given point, and whose local +X axis points toward the given point/direction. Visual meshes may be children with any offset. Do not scale these named objects.
4. Panel: an HTML overlay showing each listed quantity in its own element with attribute data-q="<name>". Its text starts with the number (units may follow, e.g. "123.4 mm").
5. Expose, before the first frame:
     window.SIM = { scene, camera, renderer, period: <seconds for one input revolution>, render(t) }
   render(t) poses every part, updates the panel, and draws the frame for time t (seconds). render(t) must be a PURE function of t: no Math.random, no Date/performance.now, no state carried between calls — it may be called at arbitrary times in any order.
   Then set window.SIM_READY = true.
6. Live viewing: unless the URL contains "?capture", run a requestAnimationFrame loop that calls SIM.render(elapsed seconds).
7. Return only after writing the file. No explanations needed in the page beyond a short title.
