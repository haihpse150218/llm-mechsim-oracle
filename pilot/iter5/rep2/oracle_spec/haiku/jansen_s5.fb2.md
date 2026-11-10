Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 83, tolerance 1.1
  diagnosis: at t=5.224 s (crank 313.4 deg) marker rodUpper@Y is drawn at (42.6, -49); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts Y at (33.4, 33.4)
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 42.5, tolerance 1.1
  diagnosis: at t=2.824 s (crank 169.4 deg) marker upperTriangle@V is drawn at (67.2, -35.3); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V at (75.5, 6.4)
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 42.8, tolerance 1.1
  diagnosis: at t=2.824 s (crank 169.4 deg) marker linkVU@U is drawn at (50.5, -71); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U at (57.9, -28.9)
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 57.2, tolerance 1.1
  diagnosis: at t=2.824 s (crank 169.4 deg) marker legTriangle@T is drawn at (-15.1, -73.2); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T at (38.9, -91.8)
- PANEL (panel number vs the kinematic solution): "foot_x" measured 54.5, tolerance 1.1
  diagnosis: at t=2.974 s the panel foot_x reads -12, the foot T from your SIM.params is at 42.5 mm (and drawn at -12 mm)
- PANEL (panel number vs the kinematic solution): "foot_y" measured 28.1, tolerance 1.1
  diagnosis: at t=1.824 s the panel foot_y reads -63.2, the foot T from your SIM.params is at -91.3 mm (and drawn at -63.2 mm)
