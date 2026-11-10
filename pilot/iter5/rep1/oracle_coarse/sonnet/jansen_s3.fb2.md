Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks:
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 19.8, tolerance 1
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 0.392, tolerance 0.03
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  (holy-number check compares your SIM.params.len to the published Jansen link lengths, allowing uniform scale and mirroring)
