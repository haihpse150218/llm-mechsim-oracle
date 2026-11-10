Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks:
- META (structural invariant (no ground truth needed)): "joint X coincident" measured 77.2, tolerance 1
- META (structural invariant (no ground truth needed)): "joint Y coincident" measured 62.2, tolerance 1
- META (structural invariant (no ground truth needed)): "joint W coincident" measured 113, tolerance 1
- META (structural invariant (no ground truth needed)): "joint V coincident" measured 45.3, tolerance 1
- META (structural invariant (no ground truth needed)): "joint U coincident" measured 70.5, tolerance 1
- PARAM (drawing vs the SIM.params you declared): "O, X positions vs params" measured 77.2, tolerance 1
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 0.341, tolerance 0.03
- GT (position vs the kinematic solution computed from your SIM.params): "Y vs canonical solution" measured 94.3, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "W vs canonical solution" measured 113, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "V vs canonical solution" measured 45.3, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "U vs canonical solution" measured 43.3, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "T vs canonical solution" measured 128, tolerance 1
  (holy-number check compares your SIM.params.len to the published Jansen link lengths, allowing uniform scale and mirroring)
