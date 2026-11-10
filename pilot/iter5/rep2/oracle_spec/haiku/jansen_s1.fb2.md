Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint X coincident" measured 7.84, tolerance 1.17
  diagnosis: at t=0.049 s the markers frame@X, upperTriangle@X, linkXW@X are at (38.8, 0), (38, -7.8), (38, -7.8) (7.8 mm apart); parts sharing joint X must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint Y coincident" measured 38.5, tolerance 1.17
  diagnosis: at t=1.883 s the markers rodUpper@Y, upperTriangle@Y are at (35.2, 1.6), (69.3, 19.5) (38.5 mm apart); parts sharing joint Y must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint W coincident" measured 37.9, tolerance 1.17
  diagnosis: at t=0.283 s the markers rodLower@W, linkXW@W, legTriangle@W are at (70.6, -17.5), (71.2, -28.8), (46, -46.3) (37.9 mm apart); parts sharing joint W must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint V coincident" measured 43.6, tolerance 1.17
  diagnosis: at t=2.516 s the markers upperTriangle@V, linkVU@V are at (70.6, -31.1), (72.6, 12.4) (43.6 mm apart); parts sharing joint V must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 52.6, tolerance 1.17
  diagnosis: at t=1.883 s the markers linkVU@U, legTriangle@U are at (95.8, -27.4), (44.9, -14.1) (52.6 mm apart); parts sharing joint U must meet there at every instant
- PARAM (drawing vs the SIM.params you declared): "O, X positions vs params" measured 7.84, tolerance 1.17
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 31.7, tolerance 1.17
  diagnosis: at t=0.083 s (crank 7.4 deg) marker rodUpper@Y is drawn at (64.8, -1.5); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts Y at (56.8, 29.2)
- GT (position vs the kinematic solution computed from your SIM.params): "W vs canonical solution" measured 37.9, tolerance 1.17
  diagnosis: at t=3.916 s (crank 352.4 deg) marker rodLower@W is drawn at (76.3, 5.3); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts W at (69.1, -31.8)
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 43.6, tolerance 1.17
  diagnosis: at t=0.083 s (crank 7.4 deg) marker upperTriangle@V is drawn at (38.6, -47.9); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts V at (74.9, -23.6)
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 37.9, tolerance 1.17
  diagnosis: at t=1.783 s (crank 160.4 deg) marker linkVU@U is drawn at (95, -29.9); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts U at (57.1, -29.8)
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 26.2, tolerance 1.17
  diagnosis: at t=3.849 s (crank 346.4 deg) marker legTriangle@T is drawn at (67.1, -78.4); solving the linkage from your SIM.params (standard assembly: Y above, W below, V/U on the outer side, T lowest) puts T at (42.4, -69.5)
