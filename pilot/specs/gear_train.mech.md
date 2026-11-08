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
