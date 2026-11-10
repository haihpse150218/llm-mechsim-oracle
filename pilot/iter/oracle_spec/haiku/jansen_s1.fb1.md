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
  diagnosis: best-fit uniform scale = 1.000 x the published Jansen numbers (OZ 15, ZY 50, XY 41.5, ZW 61.9, XW 39.3, XV 40.1, YV 55.8, VU 39.4, WU 36.7, UT 65.7, WT 49; fixed pivot X 38 to the side of O and 7.8 below it). Links that do not match at this scale: len.OZ = 38 mm, expected 15 mm; len.ZY = 41.5 mm, expected 50 mm (looks swapped with len.XY); len.XY = 50 mm, expected 41.5 mm (looks swapped with len.ZY); len.ZW = 39.3 mm, expected 61.9 mm; len.XW = 55.8 mm, expected 39.3 mm (looks swapped with len.YV); len.YV = 39.4 mm, expected 55.8 mm (looks swapped with len.XW); len.VU = 36.7 mm, expected 39.4 mm; len.WU = 49 mm, expected 36.7 mm; len.UT = 61.9 mm, expected 65.7 mm; len.WT = 65.7 mm, expected 49 mm; X - O = (15, 0) mm, expected (+/-38, -7.8) mm
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params the loops cannot close at t=0.049 s (crank 4.4 deg): some pair of links is too short to reach
