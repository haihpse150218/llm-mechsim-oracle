Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1.76, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.OZ; len.ZY; len.XY; len.ZW; len.XW; len.YV; len.VU; len.WU; len.UT; len.WT; the fixed pivot X is misplaced relative to the crank centre O
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 68.1, tolerance 1
  diagnosis: at t=3.316 s (crank 298.4 deg) marker linkVU@U is drawn at (25, -23.9); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 124, tolerance 1
  diagnosis: at t=0.916 s (crank 82.4 deg) marker legTriangle@T is drawn at (29.9, 93.5); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T
- PANEL (panel number vs the kinematic solution): "foot_x" measured 124, tolerance 1
  diagnosis: at t=1.383 s the panel foot_x reads -75, which does not match the foot T solved from your SIM.params
- PANEL (panel number vs the kinematic solution): "foot_y" measured 124, tolerance 1
  diagnosis: at t=2.316 s the panel foot_y reads -53.1, which does not match the foot T solved from your SIM.params
