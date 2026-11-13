Automated kinematic test report (the page was loaded in a browser and render(t) was sampled over one or more input revolutions). Failed checks, with diagnostics:
- DESIGN (engineering design rule for this machine): "holy numbers (max rel. error)" measured 0.341, tolerance 0.03
  diagnosis: your SIM.params.len does not match the published Jansen proportions (uniform scale and mirroring allowed). Wrong: len.VU (looks swapped with len.WU); len.WU (looks swapped with len.VU); len.UT (looks swapped with len.WT); len.WT (looks swapped with len.UT)
