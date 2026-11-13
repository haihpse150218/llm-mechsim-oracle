Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.OZ; len.ZY; len.XY; len.ZW; len.XW; len.YV; len.VU; len.WU; len.UT; len.WT; the fixed pivot X is misplaced relative to the crank centre O
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 78.2, tolerance 1
  diagnosis: at t=2.016 s (crank 181.4 deg) marker rodUpper@Y is drawn at (-26.1, 38.8); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts Y
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 78.4, tolerance 1
  diagnosis: at t=2.016 s (crank 181.4 deg) marker upperTriangle@V is drawn at (-55.6, 16.9); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 98, tolerance 1
  diagnosis: at t=1.083 s (crank 97.4 deg) marker linkVU@U is drawn at (58.6, 62.1); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 124, tolerance 1
  diagnosis: at t=1.083 s (crank 97.4 deg) marker legTriangle@T is drawn at (11.9, 79.8); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T
- PANEL (panel number vs the kinematic solution): "foot_x" measured 123, tolerance 1
  diagnosis: at t=3.283 s the panel foot_x reads 44.1, which does not match the foot T solved from your SIM.params
- PANEL (panel number vs the kinematic solution): "foot_y" measured 124, tolerance 1
  diagnosis: at t=0.749 s the panel foot_y reads 62.9, which does not match the foot T solved from your SIM.params
