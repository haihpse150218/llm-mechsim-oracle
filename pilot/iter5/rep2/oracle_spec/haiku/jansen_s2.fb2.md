Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint Y coincident" measured 38.5, tolerance 1
  diagnosis: at t=2.067 s the markers rodUpper@Y, upperTriangle@Y are at (-35.8, 71), (-19.4, 36.2) (38.5 mm apart); parts sharing joint Y must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint W coincident" measured 5.32, tolerance 1
  diagnosis: at t=2.381 s the markers rodLower@W, linkXW@W, legTriangle@W are at (1, -0.9), (4.8, -4.5), (4.8, -4.5) (5.3 mm apart); parts sharing joint W must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 2.23, tolerance 1
  diagnosis: at t=3.690 s the markers linkVU@U, legTriangle@U are at (30.7, 39.7), (29.6, 37.8) (2.2 mm apart); parts sharing joint U must meet there at every instant
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: best-fit uniform scale = 1.000 x the published Jansen numbers (OZ 15, ZY 50, XY 41.5, ZW 61.9, XW 39.3, XV 40.1, YV 55.8, VU 39.4, WU 36.7, UT 65.7, WT 49; fixed pivot X 38 to the side of O and 7.8 below it). Links that do not match at this scale: len.OZ = 38 mm, expected 15 mm; len.ZY = 41.5 mm, expected 50 mm; len.XY = 39.4 mm, expected 41.5 mm; len.ZW = 39.3 mm, expected 61.9 mm; len.XV = 36.7 mm, expected 40.1 mm; len.VU = 65.7 mm, expected 39.4 mm; len.WU = 49 mm, expected 36.7 mm; len.UT = 50 mm, expected 65.7 mm; len.WT = 61.9 mm, expected 49 mm; X - O = (-35, 0) mm, expected (+/-38, -7.8) mm
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 82.9, tolerance 1
  diagnosis: at t=3.009 s (crank 172.4 deg) marker rodUpper@Y is drawn at (-16.7, 40.8); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts Y at (-62.4, -28.3)
- GT (position vs the kinematic solution computed from your SIM.params): "W vs canonical solution" measured 78.2, tolerance 1
  diagnosis: at t=3.481 s (crank 199.4 deg) marker rodLower@W is drawn at (3.4, -11.4); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts W at (-74.6, -6.2)
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 73.2, tolerance 1
  diagnosis: at t=0.234 s (crank 13.4 deg) marker upperTriangle@V is drawn at (-16.7, -31.8); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V at (-57.8, 28.8)
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 148, tolerance 1
  diagnosis: at t=3.638 s (crank 208.4 deg) marker linkVU@U is drawn at (25.3, -51.8); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U at (-101.5, 25.3)
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 203, tolerance 1
  diagnosis: at t=3.376 s (crank 193.4 deg) marker legTriangle@T is drawn at (66.2, 3.7); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T at (-136.4, 9.2)
- PANEL (panel number vs the kinematic solution): "foot_x" measured 215, tolerance 1
  diagnosis: at t=3.376 s the panel foot_x reads 78.65, the foot T from your SIM.params is at -136.4 mm (and drawn at 66.2 mm)
- PANEL (panel number vs the kinematic solution): "foot_y" measured 147, tolerance 1
  diagnosis: at t=5.994 s the panel foot_y reads 69.9, the foot T from your SIM.params is at -77.4 mm (and drawn at 69.9 mm)
