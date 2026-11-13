Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 0.345, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.ZY (looks swapped with len.WU); len.XY (looks swapped with len.YV); len.YV (looks swapped with len.XY); len.WU (looks swapped with len.ZY)
