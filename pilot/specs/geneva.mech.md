# Mechanism: External Geneva drive, 4 slots

An external Geneva drive with 4 slots (intermittent motion).
- Driver (crank with a drive pin) pivots at the world origin (0,0,0). Wheel centre W at (100, 0, 0): centre distance C = 100 mm.
- Pin radius on the driver a = C*sin(pi/4) = 70.711 mm, so the pin enters and leaves the slots tangentially. The 4 slots are radial, 90 degrees apart.
- The driver turns counter-clockwise at constant speed, one revolution every 4 s: phi(t) = 2*pi*t/4, phi(0) = 0, i.e. at t = 0 the pin is on the +X axis, exactly halfway through an engagement, deep inside the slot that points from W toward the driver.
- While the pin is in a slot (|phi wrapped to (-pi, pi]| <= 45 deg) the wheel turns; otherwise the wheel is locked (dwell). Each driver revolution indexes the wheel by 90 degrees, clockwise.
- Wheel angle psi(t): 0 at t = 0, cumulative, counter-clockwise positive (so it decreases over time).

## Named bodies
- "driver": origin at driver pivot (world origin); local +X toward the drive pin
- "wheel": origin at W (wheel centre); local +X toward the axis of one slot; at t = 0 the wheel's local +X axis points along world +X (local -X slot points at the driver and holds the pin)

## Panel quantities
- data-q="driver_deg": driver angle phi in degrees, wrapped to [0, 360)
- data-q="wheel_deg": wheel angle psi in degrees, wrapped to [0, 360)
