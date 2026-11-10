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
