# Build an interactive 3D simulator of a leg of Theo Jansen's Strandbeest linkage

One leg of Theo Jansen's Strandbeest walking linkage, with the link lengths of Jansen's published "holy numbers", driven by a crank turning at constant speed. The foot should trace the characteristic flat-bottomed walking path.
Points: O = crank axle (fixed), X = the second fixed pivot, Z = crank pin, Y = upper joint (upper crank rod meets the upper triangle), W = lower joint (lower crank rod meets the link from X), V = outer apex of the upper triangle X-Y-V, U = knee (link from V meets the leg triangle), T = foot (tip of the leg triangle W-U-T).

## Parts and their marker points
- frame: O, X
- crank: O, Z
- rodUpper: Z, Y
- rodLower: Z, W
- upperTriangle: X, Y, V
- linkXW: X, W
- linkVU: V, U
- legTriangle: W, U, T

## SIM.params
{ O: [x, y] of the crank axle, X: [x, y] of the second fixed pivot (mm),
  len: { OZ, ZY, XY, ZW, XW, XV, YV, VU, WU, UT, WT } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O->Z from world +X, rad) at t = 0 }

## Panel quantities
- data-q="crank_deg": crank angle, direction O->Z from world +X, degrees in [0, 360)
- data-q="foot_x": x coordinate of the foot T in mm
- data-q="foot_y": y coordinate of the foot T in mm

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
