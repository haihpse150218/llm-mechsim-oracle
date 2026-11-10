Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: best-fit uniform scale = 0.983 x the published Jansen numbers (OZ 15, ZY 50, XY 41.5, ZW 61.9, XW 39.3, XV 40.1, YV 55.8, VU 39.4, WU 36.7, UT 65.7, WT 49; fixed pivot X 38 to the side of O and 7.8 below it). Links that do not match at this scale: len.OZ = 38 mm, expected 14.7 mm; len.ZY = 41.5 mm, expected 49.1 mm; len.XY = 39.3 mm, expected 40.8 mm; len.ZW = 40.1 mm, expected 60.8 mm; len.XW = 55.8 mm, expected 38.6 mm; len.YV = 36.7 mm, expected 54.8 mm; len.VU = 65.7 mm, expected 38.7 mm; len.WU = 49 mm, expected 36.1 mm; len.UT = 50 mm, expected 64.6 mm; len.WT = 61.9 mm, expected 48.1 mm; X - O = (-20, 0) mm, expected (+/-37.3, -7.7) mm
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 78.2, tolerance 1
  diagnosis: at t=2.016 s (crank 181.4 deg) marker rodUpper@Y is drawn at (-26.1, 38.8); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts Y at (-22, -39.2)
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 78.4, tolerance 1
  diagnosis: at t=2.016 s (crank 181.4 deg) marker upperTriangle@V is drawn at (-55.6, 16.9); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V at (11.3, -23.9)
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 98, tolerance 1
  diagnosis: at t=1.083 s (crank 97.4 deg) marker linkVU@U is drawn at (58.6, 62.1); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U at (4.7, -19.8)
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 124, tolerance 1
  diagnosis: at t=1.083 s (crank 97.4 deg) marker legTriangle@T is drawn at (11.9, 79.8); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T at (51.5, -37.5)
- PANEL (panel number vs the kinematic solution): "foot_x" measured 123, tolerance 1
  diagnosis: at t=3.283 s the panel foot_x reads 44.1, the foot T from your SIM.params is at -79.3 mm (and drawn at 44.1 mm)
- PANEL (panel number vs the kinematic solution): "foot_y" measured 124, tolerance 1
  diagnosis: at t=0.749 s the panel foot_y reads 62.9, the foot T from your SIM.params is at -60.6 mm (and drawn at 62.9 mm)
