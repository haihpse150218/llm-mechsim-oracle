Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- META (structural invariant (no ground truth needed)): "joint D coincident" measured 51.8, tolerance 2.11
  diagnosis: at t=5.124 s the markers coupler2@D, rocker2@D are at (100, 0), (151, 9.3) (51.8 mm apart); parts sharing joint D must meet there at every instant
- DESIGN (engineering design rule for this machine): "linkage assembles for all crank angles" measured 1, tolerance 0.5
  diagnosis: with your SIM.params, at crank angle 4.4 deg loop 2 cannot close: |C - O6| = 177.5 mm but coupler CD=70 and output rocker O6D=60 can only span 10..130 mm
