Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 18.5, tolerance 1
  diagnosis: at t=1.753 s the markers linkVU@U, legTriangle@U are at (62.6, 30.9), (51.3, 16.3) (18.5 mm apart); parts sharing joint U must meet there at every instant
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: best-fit uniform scale = 1.000 x the published Jansen numbers (OZ 15, ZY 50, XY 41.5, ZW 61.9, XW 39.3, XV 40.1, YV 55.8, VU 39.4, WU 36.7, UT 65.7, WT 49; fixed pivot X 38 to the side of O and 7.8 below it). Links that do not match at this scale: len.OZ = 38 mm, expected 15 mm; len.ZY = 41.5 mm, expected 50 mm; len.XY = 39.4 mm, expected 41.5 mm; len.ZW = 39.3 mm, expected 61.9 mm; len.XV = 36.7 mm, expected 40.1 mm; len.VU = 65.7 mm, expected 39.4 mm; len.WU = 49 mm, expected 36.7 mm; len.UT = 50 mm, expected 65.7 mm; len.WT = 61.9 mm, expected 49 mm; X - O = (-35, 0) mm, expected (+/-38, -7.8) mm
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 73.2, tolerance 1
  diagnosis: at t=0.287 s (crank 16.4 deg) marker upperTriangle@V is drawn at (-15.7, -31.2); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V at (-58.7, 28)
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 111, tolerance 1
  diagnosis: at t=4.894 s (crank 280.4 deg) marker linkVU@U is drawn at (30.5, -49.4); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U at (-76.7, -19.3)
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 124, tolerance 1
  diagnosis: at t=2.800 s (crank 160.4 deg) marker legTriangle@T is drawn at (-58.4, 9.2); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T at (65.3, 13.8)
- PANEL (panel number vs the kinematic solution): "foot_x" measured 26700, tolerance 1
  diagnosis: at t=4.842 s the panel foot_x reads -26794.42, the foot T from your SIM.params is at -90.2 mm (and drawn at -70.6 mm)
- PANEL (panel number vs the kinematic solution): "foot_y" measured 36900, tolerance 1
  diagnosis: at t=4.842 s the panel foot_y reads 36871.79, the foot T from your SIM.params is at -66.7 mm (and drawn at 10 mm)
