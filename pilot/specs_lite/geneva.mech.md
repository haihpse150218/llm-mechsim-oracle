# Build an interactive 3D simulator of a external Geneva drive (Maltese-cross indexing mechanism)

An external Geneva drive: a continuously rotating driver carrying a drive pin indexes a slotted wheel in equal steps and holds it locked between steps. Choose the number of slots n between 4 and 6.
Points: O = driver pivot, W = wheel pivot, pin = centre of the drive pin, s0 ... s(n-1) = one point on the centre line of each slot near the wheel rim, numbered counter-clockwise.

## Parts and their marker points
- frame: O, W
- driver: O, pin
- wheel: W, s0, s1, ..., s(n-1)

## SIM.params
{ n: number of slots, C: centre distance O-W, a: pin radius O-pin (mm),
  omega: driver angular velocity in rad/s (counter-clockwise positive),
  phi0: driver angle (direction O->pin from world +X, rad) at t = 0 }

## Panel quantities
- data-q="driver_deg": driver angle, direction O->pin from world +X, degrees in [0, 360)
- data-q="wheel_deg": wheel angle, direction W->s0 from world +X, degrees in [0, 360)
