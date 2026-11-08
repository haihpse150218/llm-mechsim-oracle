# Mechanism: External Geneva drive, 4 slots

An external Geneva drive with 4 slots (intermittent motion).
- Driver (crank with a drive pin) pivots at the world origin (0,0,0). Wheel centre W at (100, 0, 0): centre distance C = 100 mm.
- Pin radius on the driver a = C*sin(pi/4) = 70.711 mm, so the pin enters and leaves the slots tangentially. The 4 slots are radial, 90 degrees apart.
- The driver turns counter-clockwise at constant speed, one revolution every 4 s: phi(t) = 2*pi*t/4, phi(0) = 0, i.e. at t = 0 the pin is on the +X axis, exactly halfway through an engagement, deep inside the slot that points from W toward the driver.
- While the pin is in a slot (|phi wrapped to (-pi, pi]| <= 45 deg) the wheel turns; otherwise the wheel is locked (dwell). Each driver revolution indexes the wheel by 90 degrees, clockwise.
- Wheel angle psi(t): 0 at t = 0, cumulative, counter-clockwise positive (so it decreases over time).

## Named bodies
- "driver": origin at driver pivot (world origin); local +X toward the drive pin
- "wheel": origin at W (wheel centre); local +X toward the axis of one slot; at t = 0 the wheel's local +X axis points along world +X (local -X slot points at the driver and holds the pin)

## Panel quantities
- data-q="driver_deg": driver angle phi in degrees, wrapped to [0, 360)
- data-q="wheel_deg": wheel angle psi in degrees, wrapped to [0, 360)

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
