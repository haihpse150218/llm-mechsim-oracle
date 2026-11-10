Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks:
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 13.3, tolerance 1
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 1, tolerance 0.03
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 73.2, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 109, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 124, tolerance 1
- PANEL (panel number vs the kinematic solution): "foot_x" measured 132, tolerance 1
- PANEL (panel number vs the kinematic solution): "foot_y" measured 123, tolerance 1
  (holy-number check compares your SIM.params.len to the published Jansen link lengths, allowing uniform scale and mirroring)
