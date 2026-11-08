# Build an interactive 3D simulator of a planetary (epicyclic) gear set

A simple planetary gear set with three equally spaced planets: the ring gear is held fixed, the sun gear is the input turning at constant speed, and the planet carrier is the output. Spur gears with one common module.
Points: C = central axis, P0, P1, P2 = planet axles (on the carrier), sunRef / ringRef / planet0Ref / planet1Ref / planet2Ref = a point on that gear's pitch circle, fixed to that gear.

## Parts and their marker points
- frame: C
- sun: C, sunRef
- ring: C, ringRef
- carrier: C, P0, P1, P2
- planet0: P0, planet0Ref
- planet1: P1, planet1Ref
- planet2: P2, planet2Ref

## SIM.params
{ module: gear module in mm, Zs: sun teeth, Zp: planet teeth, Zr: ring teeth,
  omega: sun angular velocity in rad/s (counter-clockwise positive),
  theta0: sun angle (direction C->sunRef from world +X, rad) at t = 0 }

## Panel quantities
- data-q="sun_deg": sun angle, direction C->sunRef from world +X, degrees in [0, 360)
- data-q="carrier_deg": carrier angle, direction C->P0 from world +X, degrees in [0, 360)
- data-q="ratio": speed ratio |omega_sun / omega_carrier| (dimensionless)
