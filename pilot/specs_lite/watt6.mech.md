# Build an interactive 3D simulator of a Watt II six-bar linkage (two four-bar loops in series)

A Watt II six-bar linkage made of two four-bar loops in series. The input crank O2-A turns continuously at constant speed; coupler 1 (A-B) drives a ternary rocker (ground pivot O4, joints B and C) that oscillates; coupler 2 (C-D) drives the output rocker O6-D, which oscillates. Both loops must assemble and move smoothly over the whole crank revolution, with transmission angles staying between 30 and 150 degrees in both loops.
Points: O2, O4, O6 = ground pivots, A = crank-coupler 1 joint, B = coupler 1-ternary rocker joint, C = ternary rocker-coupler 2 joint, D = coupler 2-output rocker joint.

## Parts and their marker points
- frame: O2, O4, O6
- crank: O2, A
- coupler1: A, B
- rocker1: O4, B, C
- coupler2: C, D
- rocker2: O6, D

## SIM.params
{ O2: [x, y], O4: [x, y], O6: [x, y] (mm),
  len: { O2A, AB, O4B, O4C, BC, CD, O6D } (mm, the distance between the two named points),
  omega: crank angular velocity in rad/s (counter-clockwise positive),
  theta0: crank angle (direction O2->A from world +X, rad) at t = 0 }

## Panel quantities
- data-q="crank_deg": crank angle, direction O2->A from world +X, degrees in [0, 360)
- data-q="rocker1_deg": ternary rocker angle, direction O4->B from world +X, degrees in [0, 360)
- data-q="output_deg": output rocker angle, direction O6->D from world +X, degrees in [0, 360)
