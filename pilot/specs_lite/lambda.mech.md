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
