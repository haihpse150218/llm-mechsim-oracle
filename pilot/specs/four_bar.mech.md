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
