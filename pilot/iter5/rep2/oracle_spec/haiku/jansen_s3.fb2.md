Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 83, tolerance 1
  diagnosis: at t=2.516 s (crank 226.4 deg) marker rodUpper@Y is drawn at (-42.6, -49); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts Y at (-33.5, 33.5)
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 80.2, tolerance 1
  diagnosis: at t=2.516 s (crank 226.4 deg) marker upperTriangle@V is drawn at (1.5, -14.9); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V at (-77.5, -0.9)
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 73.4, tolerance 1
  diagnosis: at t=1.749 s (crank 157.4 deg) marker linkVU@U is drawn at (-16.5, -27.2); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U at (-79.9, -64.3)
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 98, tolerance 1
  diagnosis: at t=1.749 s (crank 157.4 deg) marker legTriangle@T is drawn at (-79.3, -8); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T at (-17.1, -83.7)
- PANEL (panel number vs the kinematic solution): "foot_x" measured 64.7, tolerance 1
  diagnosis: at t=1.516 s the panel foot_x reads -71.1, the foot T from your SIM.params is at -6.4 mm (and drawn at -71.1 mm)
- PANEL (panel number vs the kinematic solution): "foot_y" measured 97.9, tolerance 1
  diagnosis: at t=2.583 s the panel foot_y reads 14.3, the foot T from your SIM.params is at -83.6 mm (and drawn at 14.3 mm)
