# Hợp đồng sinh rút gọn (pilot)

Prompt đầy đủ cho từng cơ cấu: `node oracle/make_prompt.mjs <mech_id>`. Phần chung:

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
