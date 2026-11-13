Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint X coincident" measured 77.2, tolerance 1
  diagnosis: at t=0.039 s the markers frame@X, upperTriangle@X, linkXW@X are at (38.8, 0), (-38, -7.8), (-38, -7.8) (77.2 mm apart); parts sharing joint X must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint Y coincident" measured 62.2, tolerance 1
  diagnosis: at t=0.091 s the markers rodUpper@Y, upperTriangle@Y are at (64.7, 5.4), (3.5, -5.9) (62.2 mm apart); parts sharing joint Y must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint W coincident" measured 113, tolerance 1
  diagnosis: at t=0.039 s the markers rodLower@W, linkXW@W, legTriangle@W are at (76.8, 2.5), (2.1, -6.8), (-25.3, -45.8) (113 mm apart); parts sharing joint W must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint V coincident" measured 64.3, tolerance 1
  diagnosis: at t=1.217 s the markers upperTriangle@V, linkVU@V are at (-40.6, 47.9), (-91.4, 8.6) (64.3 mm apart); parts sharing joint V must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 94.9, tolerance 1
  diagnosis: at t=0.091 s the markers linkVU@U, legTriangle@U are at (-15.1, 44.1), (22.6, -43.1) (94.9 mm apart); parts sharing joint U must meet there at every instant
- PARAM (drawing vs the SIM.params you declared): "O, X positions vs params" measured 77.2, tolerance 1
- PARAM (drawing vs the SIM.params you declared): "len VU" measured 9.51, tolerance 1
- PARAM (drawing vs the SIM.params you declared): "len WU" measured 10.1, tolerance 1
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 0.392, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.XV (looks swapped with len.YV); len.YV (looks swapped with len.XV); len.UT (looks swapped with len.WT); len.WT (looks swapped with len.UT)
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params the loops cannot close at t=0.039 s (crank 4.4 deg): some pair of links is too short to reach
