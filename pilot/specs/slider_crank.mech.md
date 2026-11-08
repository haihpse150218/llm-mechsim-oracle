# Mechanism: Slider-crank (inline, zero offset)

An inline slider-crank (piston engine kinematics, zero offset).
- Crank radius r = 40 mm, connecting rod length l = 120 mm.
- Crank pivot O is fixed at the world origin (0,0,0). The piston slides along the world +X axis (its pin C always has y = 0, x > 0).
- The crank turns counter-clockwise (about +Z) at constant speed, one revolution every 4 s. Crank angle theta(t) = 2*pi*t/4, theta(0) = 0 (crank pin B on the +X axis at t = 0).
- B = crank pin (end of crank, start of rod); C = piston pin (end of rod).

## Named bodies
- "crank": origin at O (crank pivot); local +X toward B (crank pin)
- "rod": origin at B (crank pin); local +X toward C (piston pin)
- "piston": origin at C (piston pin); local +X toward world +X (the piston never rotates)

## Panel quantities
- data-q="crank_deg": crank angle theta in degrees, wrapped to [0, 360)
- data-q="piston_x": x coordinate of the piston pin C in mm
