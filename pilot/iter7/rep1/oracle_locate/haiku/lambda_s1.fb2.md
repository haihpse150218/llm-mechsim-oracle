Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "classical proportions (max rel. error)" measured 0.714, tolerance 0.03
  diagnosis: your SIM.params does not match the classical Chebyshev lambda proportions (uniform scale allowed). Wrong: len.O4B; len.AP; ground distance |O2O4|
- GT (position vs the kinematic solution computed from your SIM.params): "P vs solution" measured 100, tolerance 1.31
  diagnosis: at t=1.439 s (crank 82.4 deg) coupler@P is drawn at (-101.1, 21); that is not where solving the linkage from your SIM.params (keeping the assembly branch drawn at t=0.077 s) puts P
- PANEL (panel number vs the kinematic solution): "P_x" measured 95, tolerance 1.31
  diagnosis: at t=2.329 s the panel P_x reads -135, which does not match the point P solved from your SIM.params
- PANEL (panel number vs the kinematic solution): "P_y" measured 90.9, tolerance 1.31
  diagnosis: at t=5.418 s the panel P_y reads -75.9, which does not match the point P solved from your SIM.params
