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
