# Mechanism: Two-stage compound spur gear train

A two-stage compound spur gear train, module m = 2 mm (pitch radius = m*z/2).
- gear1: z1 = 20 teeth (pitch radius 20 mm), input, centre at (0,0,0).
- gear2: z2 = 40 teeth (pitch radius 40 mm), meshes with gear1, centre at (60, 0, 0).
- gear3: z3 = 15 teeth (pitch radius 15 mm), fixed on the SAME shaft as gear2 (same centre, turns with gear2), placed in front of gear2 (larger z).
- gear4: z4 = 45 teeth (pitch radius 45 mm), output, meshes with gear3, centre at (60, 60, 0) (z offset like gear3 so it meshes with gear3).
- gear1 turns counter-clockwise at constant speed, one revolution every 4 s: theta1(t) = 2*pi*t/4, theta1(0) = 0. All other gears follow by meshing.
- Each gear body's rotation angle about its own axis must be exactly its kinematic angle (0 at t = 0). Put any tooth phase offset needed for a clean mesh on the child mesh, not on the named body.

## Named bodies
- "gear1": origin at centre of gear1; local +X toward a reference direction fixed on gear1 (world +X at t = 0)
- "gear2": origin at centre of gear2; local +X toward reference direction fixed on gear2 (world +X at t = 0)
- "gear3": origin at centre of gear3; local +X toward reference direction fixed on gear3 (world +X at t = 0)
- "gear4": origin at centre of gear4; local +X toward reference direction fixed on gear4 (world +X at t = 0)

## Panel quantities
- data-q="input_deg": gear1 angle in degrees, wrapped to [0, 360)
- data-q="output_deg": gear4 angle in degrees (counter-clockwise positive), wrapped to [0, 360)
- data-q="ratio": overall speed ratio |omega_in / omega_out| (dimensionless)

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
