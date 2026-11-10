# Build an interactive 3D simulator of a disk cam with a translating roller follower (rise-dwell-return-dwell)

A plate (disk) cam turning at constant speed drives a translating roller follower; the follower's line of motion may be offset from the cam axis. During each cam revolution the follower rises by h with cycloidal motion, dwells at the top, returns with cycloidal motion, and dwells at the bottom. The cam outline must be the exact profile that produces this motion, so the roller touches the cam surface at every instant (no gap, no penetration). Design it so that the pressure angle never exceeds 30 degrees and the profile is not undercut. At t = 0 the follower is at the start of its rise.
Points: O = cam axis, G = a fixed point on the follower's line of motion, camRef = a point fixed on the cam, C = roller centre, F = top end of the follower stem.

## Parts and their marker points
- frame: O, G
- cam: O, camRef
- follower: C, F (the roller is part of the follower; its spin is not checked)

## SIM.params
{ Rb: base-circle radius of the cam surface, Rr: roller radius, e: follower offset = distance from O to the follower's line of motion, h: total lift (all mm),
  axisAngle: direction in which the follower rises, measured from world +X (rad),
  betaRise, betaDwellTop, betaReturn, betaDwellBottom: cam rotation angle spent in each of the four phases (rad, they sum to 2*pi),
  omega: cam angular velocity in rad/s (counter-clockwise positive),
  theta0: cam angle (direction O->camRef from world +X, rad) at t = 0 }

## Panel quantities
- data-q="cam_deg": cam angle, direction O->camRef from world +X, degrees in [0, 360)
- data-q="lift": follower displacement above its lowest position, mm

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
