Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint W coincident" measured 12.4, tolerance 1
  diagnosis: at t=2.816 s the markers rodLower@W, linkXW@W, legTriangle@W are at (-20.4, -75.4), (-21.1, -78.2), (-23.3, -87.4) (12.4 mm apart); parts sharing joint W must meet there at every instant
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 0.919, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.OZ; len.ZY; len.XY; len.ZW; len.XW; len.YV; len.VU; len.WU; len.UT; len.WT; the fixed pivot X is misplaced relative to the crank centre O
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params the loops cannot close at t=2.616 s (crank 235.4 deg): some pair of links is too short to reach
