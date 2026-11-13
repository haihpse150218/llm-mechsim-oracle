Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint A coincident" measured 40, tolerance 3.08
  diagnosis: at t=0.074 s the markers crank@A, coupler1@A are at (40, 0), (0, 0) (40 mm apart); parts sharing joint A must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint B coincident" measured 114, tolerance 3.08
  diagnosis: at t=0.074 s the markers coupler1@B, rocker1@B are at (120, 0), (150, 110) (114 mm apart); parts sharing joint B must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint C coincident" measured 125, tolerance 3.08
  diagnosis: at t=0.074 s the markers rocker1@C, coupler2@C are at (60, 110), (0, 0) (125.3 mm apart); parts sharing joint C must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint D coincident" measured 199, tolerance 3.08
  diagnosis: at t=0.074 s the markers coupler2@D, rocker2@D are at (110, 0), (305, 40) (199.1 mm apart); parts sharing joint D must meet there at every instant
- PARAM (drawing vs the SIM.params you declared): "len O4C" measured 80, tolerance 3.08
  diagnosis: rocker1@O4 - rocker1@C is drawn 0 mm apart, SIM.params.len.O4C = 80
- PARAM (drawing vs the SIM.params you declared): "len BC" measured 40, tolerance 3.08
  diagnosis: rocker1@B - rocker1@C is drawn 90 mm apart, SIM.params.len.BC = 50
- PARAM (drawing vs the SIM.params you declared): "input angle (deg)" measured 179, tolerance 1
- GT (position vs the kinematic solution computed from your SIM.params): "B vs solution" measured 115, tolerance 3.08
  diagnosis: at t=3.274 s (crank 196.4 deg) rocker1@B is drawn at (150, 110); that is not where solving the loops from your SIM.params (keeping the assembly branch drawn at t=0.074 s) puts B
- GT (position vs the kinematic solution computed from your SIM.params): "C vs solution" measured 80, tolerance 3.08
  diagnosis: at t=1.074 s (crank 64.4 deg) rocker1@C is drawn at (60, 110); that is not where solving the loops from your SIM.params (keeping the assembly branch drawn at t=0.074 s) puts C
- GT (position vs the kinematic solution computed from your SIM.params): "D vs solution" measured 120, tolerance 3.08
  diagnosis: at t=3.274 s (crank 196.4 deg) rocker2@D is drawn at (305, 40); that is not where solving the loops from your SIM.params (keeping the assembly branch drawn at t=0.074 s) puts D
- PANEL (panel number vs the kinematic solution): "crank_deg" measured 179, tolerance 1
- PANEL (panel number vs the kinematic solution): "rocker1_deg" measured 79.1, tolerance 1
- PANEL (panel number vs the kinematic solution): "output_deg" measured 106, tolerance 1
