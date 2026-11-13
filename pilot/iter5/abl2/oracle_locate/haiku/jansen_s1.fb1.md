Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint Y coincident" measured 48.5, tolerance 1.15
  diagnosis: at t=2.016 s the markers rodUpper@Y, upperTriangle@Y are at (-71.6, -25.3), (-34.6, 6) (48.5 mm apart); parts sharing joint Y must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint W coincident" measured 36.2, tolerance 1.15
  diagnosis: at t=1.749 s the markers rodLower@W, linkXW@W, legTriangle@W are at (-50, 50.9), (-36.1, 22.3), (-13.9, 47.7) (36.2 mm apart); parts sharing joint W must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint V coincident" measured 37.3, tolerance 1.15
  diagnosis: at t=2.649 s the markers upperTriangle@V, linkVU@V are at (-24.1, 8.8), (-14.5, -27.2) (37.3 mm apart); parts sharing joint V must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 52.1, tolerance 1.15
  diagnosis: at t=3.283 s the markers linkVU@U, legTriangle@U are at (20.9, -76.5), (-29.4, -90) (52.1 mm apart); parts sharing joint U must meet there at every instant
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.OZ; len.ZY (looks swapped with len.XY); len.XY (looks swapped with len.ZY); len.ZW; len.XW (looks swapped with len.YV); len.YV (looks swapped with len.XW); len.VU; len.WU; len.UT; len.WT; the fixed pivot X is misplaced relative to the crank centre O
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params the loops cannot close at t=0.049 s (crank 4.4 deg): some pair of links is too short to reach
