# Build an interactive 3D simulator of a four-bar crank-rocker linkage

A planar four-bar linkage of the crank-rocker type: the input crank turns continuously at constant speed and drives an oscillating rocker through a coupler.
Points: O2 = crank ground pivot, O4 = rocker ground pivot, A = crank-coupler joint, B = coupler-rocker joint.

## Parts and their marker points
- frame: O2, O4
- crank: O2, A
- coupler: A, B
- rocker: B, O4

## SIM.params
{ a: crank length O2-A, b: coupler length A-B, c: rocker length O4-B, d: ground length O2-O4 (all mm),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A measured from world +X, rad) at t = 0 }

## Panel quantities
- data-q="crank_deg": crank angle, direction O2->A from world +X, degrees in [0, 360)
- data-q="rocker_deg": rocker angle, direction O4->B from world +X, degrees in [0, 360)
