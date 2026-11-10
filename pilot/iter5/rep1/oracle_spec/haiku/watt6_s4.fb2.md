Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint O4 coincident" measured 125, tolerance 2.33
  diagnosis: at t=0.074 s the markers frame@O4, rocker1@O4 are at (60, 110), (0, 0) (125.3 mm apart); parts sharing joint O4 must meet there at every instant
- META (structural invariant (no ground truth needed)): "joint O6 coincident" measured 233, tolerance 2.33
  diagnosis: at t=0.074 s the markers frame@O6, rocker2@O6 are at (230, 40), (0, 0) (233.5 mm apart); parts sharing joint O6 must meet there at every instant
- PARAM (drawing vs the SIM.params you declared): "len O2A" measured 40, tolerance 2.33
  diagnosis: crank@O2 - crank@A is drawn 0 mm apart, SIM.params.len.O2A = 40
- PARAM (drawing vs the SIM.params you declared): "len AB" measured 120, tolerance 2.33
  diagnosis: coupler1@A - coupler1@B is drawn 0 mm apart, SIM.params.len.AB = 120
- PARAM (drawing vs the SIM.params you declared): "len O4B" measured 90, tolerance 2.33
  diagnosis: rocker1@O4 - rocker1@B is drawn 0 mm apart, SIM.params.len.O4B = 90
- PARAM (drawing vs the SIM.params you declared): "len O4C" measured 80, tolerance 2.33
  diagnosis: rocker1@O4 - rocker1@C is drawn 0 mm apart, SIM.params.len.O4C = 80
- PARAM (drawing vs the SIM.params you declared): "len BC" measured 50, tolerance 2.33
  diagnosis: rocker1@B - rocker1@C is drawn 0 mm apart, SIM.params.len.BC = 50
- PARAM (drawing vs the SIM.params you declared): "len CD" measured 110, tolerance 2.33
  diagnosis: coupler2@C - coupler2@D is drawn 0 mm apart, SIM.params.len.CD = 110
- PARAM (drawing vs the SIM.params you declared): "len O6D" measured 75, tolerance 2.33
  diagnosis: rocker2@O6 - rocker2@D is drawn 0 mm apart, SIM.params.len.O6D = 75
- PARAM (drawing vs the SIM.params you declared): "input angle (deg)" measured 179, tolerance 1
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params, at crank angle 4.4 deg loop 2 cannot close: |C - O6| = 232.7 mm but coupler CD=110 and output rocker O6D=75 can only span 35..185 mm
