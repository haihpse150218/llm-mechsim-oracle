Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "classical proportions (max rel. error)" measured 0.714, tolerance 0.03
  diagnosis: best-fit uniform scale = 40.000 x the classical Chebyshev lambda proportions (crank O2A 1, rocker O4B 2.5, coupler AB 2.5 to the rocker joint and AP 5 to the tracing point, ground O2O4 2). Links that do not match at this scale: len.O4B = 80 mm, expected 100 mm; len.AP = 50 mm, expected 200 mm; ground distance |O2O4| = 120 mm, expected 80 mm
- GT (position vs the kinematic solution computed from your SIM.params): "P vs solution" measured 100, tolerance 1.31
  diagnosis: at t=1.439 s (crank 82.4 deg) coupler@P is drawn at (-101.1, 21); solving the linkage from your SIM.params (keeping the assembly branch drawn at t=0.077 s) puts P at (-8.3, 58.3)
- PANEL (panel number vs the kinematic solution): "P_x" measured 95, tolerance 1.31
  diagnosis: at t=2.329 s the panel P_x reads -135, the point P from your SIM.params is at -40 mm (and drawn at -135 mm)
- PANEL (panel number vs the kinematic solution): "P_y" measured 90.9, tolerance 1.31
  diagnosis: at t=5.418 s the panel P_y reads -75.9, the point P from your SIM.params is at 15 mm (and drawn at -75.9 mm)
