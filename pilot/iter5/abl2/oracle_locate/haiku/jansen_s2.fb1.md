Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 18.5, tolerance 1
  diagnosis: at t=1.753 s the markers linkVU@U, legTriangle@U are at (62.6, 30.9), (51.3, 16.3) (18.5 mm apart); parts sharing joint U must meet there at every instant
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.OZ; len.ZY; len.XY; len.ZW; len.XV; len.VU; len.WU; len.UT; len.WT; the fixed pivot X is misplaced relative to the crank centre O
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 73.2, tolerance 1
  diagnosis: at t=0.287 s (crank 16.4 deg) marker upperTriangle@V is drawn at (-15.7, -31.2); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 111, tolerance 1
  diagnosis: at t=4.894 s (crank 280.4 deg) marker linkVU@U is drawn at (30.5, -49.4); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 124, tolerance 1
  diagnosis: at t=2.800 s (crank 160.4 deg) marker legTriangle@T is drawn at (-58.4, 9.2); that is not where solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T
- PANEL (panel number vs the kinematic solution): "foot_x" measured 26700, tolerance 1
  diagnosis: at t=4.842 s the panel foot_x reads -26794.42, which does not match the foot T solved from your SIM.params
- PANEL (panel number vs the kinematic solution): "foot_y" measured 36900, tolerance 1
  diagnosis: at t=4.842 s the panel foot_y reads 36871.79, which does not match the foot T solved from your SIM.params
