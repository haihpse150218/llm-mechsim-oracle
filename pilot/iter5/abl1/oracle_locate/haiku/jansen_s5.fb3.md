Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.ZY (looks swapped with len.XY); len.XY (looks swapped with len.ZY); len.ZW; len.XV; len.YV; len.UT; len.WT; the fixed pivot X is misplaced relative to the crank centre O
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params the loops cannot close at t=0.074 s (crank 4.4 deg): some pair of links is too short to reach
