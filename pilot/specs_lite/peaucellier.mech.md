# Build an interactive 3D simulator of a Peaucellier–Lipkin linkage (exact straight-line mechanism)

The Peaucellier–Lipkin linkage (Peaucellier inversor) driven by an input crank, arranged so that the output point P moves along an exactly straight line. The crank cannot turn a full revolution in this mechanism, so it swings back and forth: crank angle = thetaMid + thetaAmp * sin(omega * t). Choose the swing so that the linkage can be assembled over the whole swing.
Points: O = crank ground pivot, Q = the inversor's fixed centre (second ground pivot), A = crank end (the inversor's input vertex), B and D = the two side vertices of the rhombus, P = output vertex of the rhombus (opposite A). The two long arms run from Q to B and from Q to D; the rhombus is A-B-P-D.

## Parts and their marker points
- frame: O, Q
- crank: O, A
- armB: Q, B
- armD: Q, D
- linkAB: A, B
- linkAD: A, D
- linkBP: B, P
- linkDP: D, P

## SIM.params
{ O: [x, y], Q: [x, y] (mm),
  len: { OA, QB, QD, AB, AD, BP, DP } (mm, the distance between the two named points),
  omega: angular frequency of the crank swing in rad/s,
  thetaMid: mid-swing crank angle (direction O->A from world +X, rad), thetaAmp: swing amplitude (rad) }

## Panel quantities
- data-q="crank_deg": crank angle, direction O->A from world +X, degrees in [0, 360)
- data-q="P_x": x coordinate of the output point P in mm
- data-q="P_y": y coordinate of the output point P in mm
