# Related work, software-testing side (mechsim oracle paper, target: ISSE)

Search date: 2026-11-13. Scope: oracle problem, metamorphic and simulation testing, testing LLM-generated code, simulation V&V, ISSE papers.
Excludes everything already in `novelty_gate.md` §2 (MSynth, LAM, WorldCoder-Bench, InteractScience, SGA, Perceptual self-reflection, SimuScene, MecEng, PhysCodeBench, Articulate-Anything, CADPrompt, Donaldson OOPSLA'17, Self-Debug).

How entries were verified:
- **VERIFIED-CR**: metadata (authors, title, venue, year, vol/issue/pages, DOI) taken from the Crossref record of that DOI (`https://api.crossref.org/works/<DOI>`). The DOI resolves at `https://doi.org/<DOI>`.
- **VERIFIED-arXiv**: metadata taken from the arXiv abstract record (`https://arxiv.org/abs/<id>`, via export.arxiv.org API).
- DBLP returned a bot-check page and Springer article pages redirected to a login flow, so neither was used.
- "Abstract read" means the one-line summary comes from the abstract. "Title/metadata only" means the abstract was not available, so the summary is cautious. Read those papers before citing them for anything specific.
- Totals: **34 entries. 33 VERIFIED, 1 partly unverified** (CodeT: the arXiv record is verified, but the ICLR 2023 venue was not checked).

---

## A. The test oracle problem and oracle automation

**A1. Barr, E.T., Harman, M., McMinn, P., Shahbaz, M., Yoo, S. (2015). The Oracle Problem in Software Testing: A Survey. IEEE TSE 41(5):507–525. doi:10.1109/TSE.2014.2372785**: VERIFIED-CR.
- What: The standard survey of the oracle problem. It sorts oracles into specified, derived (including metamorphic), implicit and human ones.
- Us: Our oracle mixes types. Invariants and design rules are implicit or specified oracles; the kinematic ground truth is a derived oracle, computed from the simulator's own declared parameters. Use this taxonomy to place each check.
- Group: oracle problem.

**A2. Dinella, E., Ryan, G., Mytkowicz, T., Lahiri, S.K. (2022). TOGA: A Neural Method for Test Oracle Generation. ICSE 2022, pp. 2130–2141. doi:10.1145/3510003.3510141**: VERIFIED-CR.
- What: Generates assertion and exception oracles for unit tests with a transformer conditioned on the method under test and its docstring.
- Us: TOGA learns oracles at unit level for ordinary Java methods. Our oracle is engineered, domain-derived and runs over whole animated programs. We do not learn the oracle.
- Group: oracle problem.

**A3. Hossain, S.B., Filieri, A., Dwyer, M.B., Elbaum, S., Visser, W. (2023). Neural-Based Test Oracle Generation: A Large-Scale Evaluation and Lessons Learned. ESEC/FSE 2023, pp. 120–132. doi:10.1145/3611643.3616265**: VERIFIED-CR.
- What: Re-evaluates TOGA-style neural oracle generation at scale. Reports high false-positive rates and weak bug-finding in realistic settings.
- Us: Supports our choice of a deterministic, auditable oracle over a learned one. Our pilot also reports oracle precision on hand-labelled samples.
- Group: oracle problem.

**A4. Molina, F., Gorla, A., d'Amorim, M. (2025). Test Oracle Automation in the Era of LLMs. ACM TOSEM 34(5):1–24. doi:10.1145/3715107**: VERIFIED-CR, abstract read.
- What: A roadmap for using LLMs in test oracle automation. It reviews pre-LLM oracle work and lists open problems, including oracle soundness and the risk of oracles that mirror the implementation.
- Us: We take the opposite stance for the gate: the LLM writes the program, and a non-LLM oracle judges it. This paper is the right recent anchor for "why not let an LLM (or a VLM) be the oracle".
- Group: oracle problem.

**A5. Molinelli, D., Di Grazia, L., Martin-Lopez, A., Ernst, M.D., Pezzè, M. (2025). Do LLMs Generate Useful Test Oracles? An Empirical Study with an Unbiased Dataset. ASE 2025, pp. 278–290. doi:10.1109/ASE63991.2025.00031**: VERIFIED-CR (title/metadata only).
- What: An empirical study of whether LLM-generated oracles are useful, evaluated on a dataset built to avoid training-data leakage.
- Us: Evidence on the reliability of LLM-produced oracles. It complements our finding that VLM review, an LLM-as-oracle, misses mutants that the executable oracle catches.
- Group: oracle problem.

**A6. Fontes, A., Gay, G. (2021). Using Machine Learning to Generate Test Oracles: A Systematic Literature Review. Proc. 1st Int. Workshop on Test Oracles (TORACLE 2021), pp. 1–10. doi:10.1145/3472675.3473974**: VERIFIED-CR.
- What: A systematic literature review of machine-learning-based oracle generation before LLMs.
- Us: Background for the claim that learned oracles are an active line of work. Ours is a specification-derived, non-learned oracle.
- Group: oracle problem.

**A7. Ernst, M.D., Cockrell, J., Griswold, W.G., Notkin, D. (2001). Dynamically Discovering Likely Program Invariants to Support Program Evolution. IEEE TSE 27(2):99–123. doi:10.1109/32.908957**: VERIFIED-CR.
- What: Daikon. It infers likely invariants from execution traces.
- Us: Classic work on invariants as oracles. Our invariants (closure of the linkage loop, rigid link lengths, bounded joint angles) are stated a priori from mechanism theory, not inferred from traces.
- Group: oracle problem.

**A8. Meyer, B. (1992). Applying "Design by Contract". IEEE Computer 25(10):40–51. doi:10.1109/2.161279**: VERIFIED-CR.
- What: Pre- and postconditions and class invariants as executable specifications checked at run time.
- Us: Our per-frame invariant checks and design rules work like runtime contracts, but they are imposed from outside on generated code that never declared them.
- Group: oracle problem.

**A9. Chen, K., Li, Y., Chen, Y., Fan, C., Hu, Z., Yang, W. (2021). GLIB: Towards Automated Test Oracle for Graphically-Rich Applications. ESEC/FSE 2021, pp. 1093–1104. doi:10.1145/3468264.3468586**: VERIFIED-CR.
- What: A visual oracle that detects rendering glitches in game screenshots with a learned image model.
- Us: This is the image-based oracle family that our VLM screenshot baseline belongs to. We argue that state-level kinematic checks catch errors that look plausible in pixels.
- Group: oracle problem.

**A10. Taesiri, M.R., Feng, T., Bezemer, C.-P., Nguyen, A. (2024). GlitchBench: Can Large Multimodal Models Detect Video Game Glitches? CVPR 2024, pp. 22444–22455. doi:10.1109/CVPR52733.2024.02118**: VERIFIED-CR.
- What: A benchmark showing that large multimodal models detect many video-game glitches poorly.
- Us: Independent evidence that VLMs are weak visual oracles for interactive 3D content. It supports why the VLM baseline misses mutants in our pilot.
- Group: oracle problem.

## B. Metamorphic testing, and testing of simulation, physics and scientific software

**B1. Chen, T.Y., Kuo, F.-C., Liu, H., Poon, P.-L., Towey, D., Tse, T.H., Zhou, Z.Q. (2018). Metamorphic Testing: A Review of Challenges and Opportunities. ACM CSUR 51(1):1–27. doi:10.1145/3143561**: VERIFIED-CR.
- What: The standard review of metamorphic testing (MT), its relations, applications and open challenges.
- Us: Background for our metamorphic or derived checks. Our "kinematic ground truth from declared parameters" acts as a derived oracle, and it is not a pure MR between runs.
- Group: metamorphic & simulation testing.

**B2. Segura, S., Fraser, G., Sanchez, A.B., Ruiz-Cortés, A. (2016). A Survey on Metamorphic Testing. IEEE TSE 42(9):805–824. doi:10.1109/TSE.2016.2532875**: VERIFIED-CR.
- What: A survey of about 120 MT papers, with application domains such as simulation and graphics, and MR construction techniques.
- Us: Cite together with B1 when positioning the oracle as reusable across mechanisms of the same family, so no hand-written contract is needed per task.
- Group: metamorphic & simulation testing.

**B3. Kanewala, U., Bieman, J.M. (2014). Testing Scientific Software: A Systematic Literature Review. Information and Software Technology 56(10):1219–1232. doi:10.1016/j.infsof.2014.05.006**: VERIFIED-CR.
- What: A literature review naming the oracle problem as the main challenge in testing scientific and simulation software.
- Us: Our setting, numerical mechanism simulation, inherits this problem. We address it with analytic kinematics as a partial oracle.
- Group: metamorphic & simulation testing.

**B4. Lin, X., Simon, M., Niu, N. (2020). Exploratory Metamorphic Testing for Scientific Software. Computing in Science & Engineering 22(2):78–87. doi:10.1109/MCSE.2018.2880577**: VERIFIED-CR.
- What: Applies exploratory MT to the EPA Storm Water Management Model, keeping candidate relations open while testing.
- Us: An example of MT on real simulation software. Our relations come from mechanism theory, for example Grashof and Freudenstein-type constraints.
- Group: metamorphic & simulation testing.

**B5. Raunak, M.S., Olsen, M.M. (2021). Metamorphic Testing on the Continuum of Verification and Validation of Simulation Models. MET 2021 (IEEE/ACM 6th Int. Workshop on Metamorphic Testing), pp. 47–52. doi:10.1109/MET52542.2021.00015**: VERIFIED-CR (title/metadata only).
- What: Places MT along the verification-to-validation continuum for simulation models.
- Us: It bridges the SE-testing and simulation-V&V literatures, which our paper also bridges. Our checks are verification-type: is the simulator faithful to its own declared model?
- Group: metamorphic & simulation testing (also simulation V&V).

**B6. Zhou, Z.Q., Sun, L. (2019). Metamorphic Testing of Driverless Cars. Communications of the ACM 62(3):61–67. doi:10.1145/3241979**: VERIFIED-CR.
- What: Uses MT to find failures in autonomous-driving perception and planning without a ground-truth oracle.
- Us: A well-known MT application to a simulated or physical system. We target generated simulators, not the system under simulation.
- Group: metamorphic & simulation testing.

**B7. Sorokin, L., Biagiola, M., Stocco, A. (2026). Simulator Ensembles for Trustworthy Autonomous Driving Systems Testing. Empirical Software Engineering 31(4). doi:10.1007/s10664-026-10821-7**: VERIFIED-CR, abstract read.
- What: Runs ADAS test scenarios across several driving simulators. Outcomes differ because of flakiness and different physics implementations, so the ensemble is used to get more trustworthy results.
- Us: Shows that simulators themselves are unreliable test infrastructure. We go further and test the simulator, which is LLM-written, against its own declared parameters.
- Group: metamorphic & simulation testing.

**B8. Li, S., Chen, Q., Ren, X., Lyu, M.R. (2025). Runtime Failure Hunting for Physics Engine Based Software Systems: How Far Can We Go? arXiv:2507.22099**: VERIFIED-arXiv (preprint, no venue), abstract read.
- What: An empirical study of physics failures in software built on physics engines. It gives a taxonomy of failure manifestations and evaluates detectors, including deep learning, prompting and large multimodal models (the PhysiXFails dataset).
- Us: The closest testing work on physics-behaviour failures. Its finding that multimodal models struggle matches our VLM baseline. Unlike our work, it does not cover LLM-generated simulators or a parameter-derived oracle.
- Group: metamorphic & simulation testing.

**B9. Kulshreshtha, A., Mughees, A., Sudheerbabu, G., Ahmad, T., Klemets, K., Truscan, D., Manngård, M. (2026). Multi-Agent Specification-based Metamorphic Testing of FMU-Based Simulations. Accepted at MET 2026 (COMPSAC 2026 workshop). arXiv:2605.25101**: VERIFIED-arXiv (author version; proceedings DOI not yet available).
- What: Uses LLM agents to derive metamorphic relations from specifications to test Functional Mock-up Unit (FMU) simulation models.
- Us: A very recent pairing of LLMs with spec-based oracles for simulation models. There the LLM builds the oracle; in our work the LLM builds the simulator and the oracle is not an LLM.
- Group: metamorphic & simulation testing.

## C. Testing and verifying LLM-generated code beyond unit tests

**C1. Liu, J., Xia, C.S., Wang, Y., Zhang, L. (2023). Is Your Code Generated by ChatGPT Really Correct? Rigorous Evaluation of Large Language Models for Code Generation. NeurIPS 2023 (Advances in NeurIPS 36), pp. 21558–21572. doi:10.52202/075280-0943; arXiv:2305.01210**: VERIFIED-CR.
- What: EvalPlus and HumanEval+. Adding more tests lowers pass@k sharply, so many "passing" solutions are wrong.
- Us: The canonical evidence that thin test suites over-accept LLM code. We make the same point for visual simulators, where looking right in a screenshot plays the role of passing the base tests.
- Group: testing LLM code.

**C2. Hamidi, A., Konstantinou, M., Degiovanni, R., Papadakis, M. (2026). How Effective Are Traditional Test Criteria at Detecting Bugs in Large Language Models Generated Code? arXiv:2609.09315**: VERIFIED-arXiv (preprint), abstract read.
- What: Uses 6,000+ faulty LLM programs. Statement coverage, branch coverage and mutation adequacy rarely expose the hard LLM faults, because the oracles fail to observe the faulty behaviour.
- Us: Directly supports our thesis that the bottleneck is the oracle, not test-input generation.
- Group: testing LLM code.

**C3. Tambon, F., Moradi-Dakhel, A., Nikanjam, A., Khomh, F., Desmarais, M.C., Antoniol, G. (2025). Bugs in Large Language Models Generated Code: An Empirical Study. Empirical Software Engineering 30(3). doi:10.1007/s10664-025-10614-4**: VERIFIED-CR (title/metadata only).
- What: A taxonomy of the bug patterns in LLM-generated code.
- Us: We can relate our oracle's error classes (geometry/closure, kinematic, design-rule) to a general LLM-bug taxonomy.
- Group: testing LLM code.

**C4. Liu, Y., Le-Cong, T., Widyasari, R., Tantithamthavorn, C., Li, L., Le, X.-B.D., Lo, D. (2024). Refining ChatGPT-Generated Code: Characterizing and Mitigating Code Quality Issues. ACM TOSEM 33(5):1–26. doi:10.1145/3643674**: VERIFIED-CR.
- What: Characterizes quality issues in ChatGPT code and studies feedback-driven repair of them.
- Us: Prior SE evidence that feedback improves generated code. Our repair study isolates feedback specificity: a spec-level oracle message versus locate-only, coarse, or none.
- Group: testing LLM code.

**C5. Vikram, V., Lemieux, C., Sunshine, J., Padhye, R. (2023). Can Large Language Models Write Good Property-Based Tests? arXiv:2307.04346**: VERIFIED-arXiv (preprint; v2 2024).
- What: Prompts LLMs to write property-based tests (PBTs) from API documentation, and measures their validity, soundness and property strength.
- Us: An LLM writes the properties there. In our work the properties come from mechanism theory and are fixed per mechanism family, which avoids unsound properties written by the model.
- Group: testing LLM code.

**C6. Maaz, M., DeVoe, L., Hatfield-Dodds, Z., Carlini, N. (2025). Agentic Property-Based Testing: Finding Bugs Across the Python Ecosystem. NeurIPS 2025 Deep Learning for Code Workshop. arXiv:2510.09907**: VERIFIED-arXiv (workshop paper).
- What: An LLM agent writes and runs Hypothesis PBTs over 100 popular Python packages and finds real bugs with few false alarms.
- Us: Shows that invariant- or property-based checking scales with LLMs. We use properties as an acceptance gate and repair signal for generated programs, not as a bug-hunting tool for libraries.
- Group: testing LLM code.

**C7. Endres, M., Fakhoury, S., Chakraborty, S., Lahiri, S.K. (2024). Can Large Language Models Transform Natural Language Intent into Formal Method Postconditions? Proc. ACM Softw. Eng. 1(FSE):1889–1912. doi:10.1145/3660791**: VERIFIED-CR, abstract read.
- What: nl2postcond. LLMs turn natural-language intent into checkable postconditions, which are then used to catch bugs.
- Us: A specification-checking route to judging generated code. Our "spec" is the simulator's own declared parameters plus mechanism theory, not an LLM-written postcondition.
- Group: testing LLM code.

**C8. Chen, B., Zhang, F., Nguyen, A., Zan, D., Lin, Z., Lou, J.-G., Chen, W. (2022). CodeT: Code Generation with Generated Tests. arXiv:2207.10397** (published at ICLR 2023; venue **UNVERIFIED**, only the arXiv record was checked).
- What: Generates candidate programs and tests with the same LLM, then selects programs by dual execution agreement.
- Us: An early "gate by executable checks" for selecting LLM code, but its checks are LLM-written. Our gate is independent of the generator.
- Group: testing LLM code.

## D. Verification and validation of simulation models

**D1. Sargent, R.G. (2013). Verification and Validation of Simulation Models. Journal of Simulation 7(1):12–24. doi:10.1057/jos.2012.20**: VERIFIED-CR.
- What: The standard simulation V&V paper: conceptual model validity, computerized model verification, operational validity, and techniques such as animation, degenerate tests and extreme-condition tests.
- Us: Our oracle automates "computerized model verification", meaning the code implements the declared model. Our VLM screenshot review is a mechanized form of Sargent's "animation" technique, which helps place it.
- Group: simulation V&V.

**D2. Balci, O. (1997). Verification, Validation and Accreditation of Simulation Models. Proc. 1997 Winter Simulation Conference, pp. 135–141. doi:10.1145/268437.268462**: VERIFIED-CR.
- What: The VV&A process and a catalogue of V&V techniques: informal, static, dynamic and formal.
- Us: Our acceptance gate corresponds to a lightweight, automated accreditation step for generated simulators.
- Group: simulation V&V.

**D3. Kleijnen, J.P.C. (1995). Verification and Validation of Simulation Models. European Journal of Operational Research 82(1):145–162. doi:10.1016/0377-2217(94)00016-6**: VERIFIED-CR.
- What: An operations-research view of V&V, including checking simulation outputs against analytic solutions for special cases.
- Us: Comparing against an analytic solution is exactly our "kinematic ground truth": closed-form linkage kinematics compared with simulated poses.
- Group: simulation V&V.

## E. Papers in ISSE (Innovations in Systems and Software Engineering), 2022–2026

Found by searching Crossref with the ISSN filter 1614-5046 and from-pub-date 2022. No ISSE paper on metamorphic testing, test oracles for LLM code, or simulator V&V turned up. The entries below are the closest ones to cite for venue fit.

**E1. Schieferdecker, I.K. (2026). Augmenting Software Engineering with AI. The ai4se Taxonomy and Its Use. ISSE 22(2). doi:10.1007/s11334-026-00652-6**: VERIFIED-CR, abstract read.
- What: Gives a taxonomy of AI support for software engineering, including generative and agentic AI for code generation and defect detection, framed around model-driven SE.
- Us: Lets us place our work in an ISSE-native taxonomy, as AI-generated artefacts plus automated quality assurance.
- Group: ISSE.

**E2. Kumari, P., Dey, A., Deb, N. (2026). ViMSUIT: Vision-Metadata Inferences for Software UI Testing. ISSE 22(2). doi:10.1007/s11334-026-00656-2**: VERIFIED-CR (title/metadata only; abstract not available).
- What: UI testing that combines visual inference with UI metadata, judging from the title.
- Us: An ISSE paper on vision-based testing, related to our VLM screenshot baseline versus state-level checks. Read it before citing.
- Group: ISSE.

**E3. Hermawan, R., Bucaioni, A., Enoiu, E., Afzal, W., Saadatmand, M., Zaimovic, N., Ibtasham, M.S. (2026). Let's Read the Log: Root Cause Analysis of Railway Test Execution Logs with Large Language Models. ISSE 22(2). doi:10.1007/s11334-026-00657-1**: VERIFIED-CR, abstract read.
- What: Uses LLMs to analyse test-execution logs from a digital-twin validation infrastructure for train control software (Alstom).
- Us: An ISSE example of LLMs inside a simulation-based validation loop. In our work an oracle judges what the LLM produces; in theirs the LLM interprets test results.
- Group: ISSE.

**E4. Waldvogel, A., Koehler, F., Annighoefer, B. (2026). Model-Based Block Diagram Recognition for Model Visualization Verification, extended version. ISSE 22(2). doi:10.1007/s11334-026-00633-9**: VERIFIED-CR, abstract read.
- What: Automatically verifies that rendered block-diagram visualizations match the underlying model ("is what you see really what you get?") for safety-critical tools.
- Us: A close ISSE analogue. Both papers check a visualization against the model it claims to show; ours does it for animated 3D mechanisms, using state and kinematics.
- Group: ISSE.

**E5. Graics, B., Molnár, V., Majzik, I. (2026). Integration Test Generation for State-Based Components in the Gamma Framework. ISSE 22(2). doi:10.1007/s11334-026-00643-7**: VERIFIED-CR, abstract read.
- What: Model-based generation of integration tests for composed statechart components, for railway and aerospace control.
- Us: A model-based testing anchor in ISSE. Our oracle is also model-derived, from the declared mechanism model.
- Group: ISSE.

**E6. Priya, S., Zhou, X., Su, Y., Vizel, Y., Bao, Y., Gurfinkel, A. (2022). Verifying Verified Code. ISSE 18(3):335–346. doi:10.1007/s11334-022-00443-9**: VERIFIED-CR (title/metadata only).
- What: Re-verification of already-verified code with other verification tools, judging from the title. Read it before citing anything specific.
- Us: Fits a sentence on "who checks the checker", that is, independent re-checking of artefacts that claim correctness, as LLM-generated simulators do.
- Group: ISSE.

**E7. Ait Wakrime, A., Ouhammou, Y. (2022). Advances in Modeling, Verification and Testing of Safety-Critical Software Architectures (guest editorial). ISSE 18(4):483–484. doi:10.1007/s11334-022-00493-z**: VERIFIED-CR (editorial).
- What: The editorial of an ISSE special issue on modelling, verification and testing.
- Us: Optional. Cite only if you need an ISSE pointer to the verification/testing theme; prefer E1–E5.
- Group: ISSE.

---

## Notes for the writer
- The strongest framing chain: A1 (oracle problem) → B1/B2 (derived/metamorphic oracles) → D1/D3 (simulation verification against analytic solutions) → C1/C2 (LLM code passes weak oracles) → A9/A10/B8 (visual/VLM oracles are weak for physics) → our executable oracle as gate and repair signal.
- Sargent (D1) names "animation" as a V&V technique. The VLM screenshot review is a mechanized version of it, which gives a neat way to place the baseline within V&V terms.
- Possible gaps not covered here: differential testing across WebGL/three.js renderers; MT of game engines in peer-reviewed SE venues (none found; the closest is B8, a preprint).

---

## BibTeX (verified entries)

```bibtex
@article{barr2015oracle,
  author  = {Barr, Earl T. and Harman, Mark and McMinn, Phil and Shahbaz, Muzammil and Yoo, Shin},
  title   = {The Oracle Problem in Software Testing: A Survey},
  journal = {IEEE Transactions on Software Engineering},
  volume  = {41}, number = {5}, pages = {507--525}, year = {2015},
  doi     = {10.1109/TSE.2014.2372785}
}
@inproceedings{dinella2022toga,
  author    = {Dinella, Elizabeth and Ryan, Gabriel and Mytkowicz, Todd and Lahiri, Shuvendu K.},
  title     = {{TOGA}: A Neural Method for Test Oracle Generation},
  booktitle = {Proceedings of the 44th International Conference on Software Engineering (ICSE)},
  pages     = {2130--2141}, year = {2022},
  doi       = {10.1145/3510003.3510141}
}
@inproceedings{hossain2023neural,
  author    = {Hossain, Soneya Binta and Filieri, Antonio and Dwyer, Matthew B. and Elbaum, Sebastian and Visser, Willem},
  title     = {Neural-Based Test Oracle Generation: A Large-Scale Evaluation and Lessons Learned},
  booktitle = {Proceedings of the 31st ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE)},
  pages     = {120--132}, year = {2023},
  doi       = {10.1145/3611643.3616265}
}
@article{molina2025oracle,
  author  = {Molina, Facundo and Gorla, Alessandra and d'Amorim, Marcelo},
  title   = {Test Oracle Automation in the Era of {LLMs}},
  journal = {ACM Transactions on Software Engineering and Methodology},
  volume  = {34}, number = {5}, pages = {1--24}, year = {2025},
  doi     = {10.1145/3715107}
}
@inproceedings{molinelli2025oracles,
  author    = {Molinelli, Davide and Di Grazia, Luca and Martin-Lopez, Alberto and Ernst, Michael D. and Pezz{\`e}, Mauro},
  title     = {Do {LLMs} Generate Useful Test Oracles? An Empirical Study with an Unbiased Dataset},
  booktitle = {Proceedings of the 40th IEEE/ACM International Conference on Automated Software Engineering (ASE)},
  pages     = {278--290}, year = {2025},
  doi       = {10.1109/ASE63991.2025.00031}
}
@inproceedings{fontes2021mloracle,
  author    = {Fontes, Afonso and Gay, Gregory},
  title     = {Using Machine Learning to Generate Test Oracles: A Systematic Literature Review},
  booktitle = {Proceedings of the 1st International Workshop on Test Oracles (TORACLE)},
  pages     = {1--10}, year = {2021},
  doi       = {10.1145/3472675.3473974}
}
@article{ernst2001daikon,
  author  = {Ernst, Michael D. and Cockrell, Jake and Griswold, William G. and Notkin, David},
  title   = {Dynamically Discovering Likely Program Invariants to Support Program Evolution},
  journal = {IEEE Transactions on Software Engineering},
  volume  = {27}, number = {2}, pages = {99--123}, year = {2001},
  doi     = {10.1109/32.908957}
}
@article{meyer1992dbc,
  author  = {Meyer, Bertrand},
  title   = {Applying ``Design by Contract''},
  journal = {Computer},
  volume  = {25}, number = {10}, pages = {40--51}, year = {1992},
  doi     = {10.1109/2.161279}
}
@inproceedings{chen2021glib,
  author    = {Chen, Ke and Li, Yufei and Chen, Yingfeng and Fan, Changjie and Hu, Zhipeng and Yang, Wei},
  title     = {{GLIB}: Towards Automated Test Oracle for Graphically-Rich Applications},
  booktitle = {Proceedings of the 29th ACM Joint Meeting on European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE)},
  pages     = {1093--1104}, year = {2021},
  doi       = {10.1145/3468264.3468586}
}
@inproceedings{taesiri2024glitchbench,
  author    = {Taesiri, Mohammad Reza and Feng, Tianjun and Bezemer, Cor-Paul and Nguyen, Anh},
  title     = {{GlitchBench}: Can Large Multimodal Models Detect Video Game Glitches?},
  booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages     = {22444--22455}, year = {2024},
  doi       = {10.1109/CVPR52733.2024.02118}
}
@article{chen2018metamorphic,
  author  = {Chen, Tsong Yueh and Kuo, Fei-Ching and Liu, Huai and Poon, Pak-Lok and Towey, Dave and Tse, T. H. and Zhou, Zhi Quan},
  title   = {Metamorphic Testing: A Review of Challenges and Opportunities},
  journal = {ACM Computing Surveys},
  volume  = {51}, number = {1}, pages = {1--27}, year = {2018},
  doi     = {10.1145/3143561}
}
@article{segura2016survey,
  author  = {Segura, Sergio and Fraser, Gordon and Sanchez, Ana B. and Ruiz-Cort{\'e}s, Antonio},
  title   = {A Survey on Metamorphic Testing},
  journal = {IEEE Transactions on Software Engineering},
  volume  = {42}, number = {9}, pages = {805--824}, year = {2016},
  doi     = {10.1109/TSE.2016.2532875}
}
@article{kanewala2014scientific,
  author  = {Kanewala, Upulee and Bieman, James M.},
  title   = {Testing Scientific Software: A Systematic Literature Review},
  journal = {Information and Software Technology},
  volume  = {56}, number = {10}, pages = {1219--1232}, year = {2014},
  doi     = {10.1016/j.infsof.2014.05.006}
}
@article{lin2020exploratory,
  author  = {Lin, Xuanyi and Simon, Michelle and Niu, Nan},
  title   = {Exploratory Metamorphic Testing for Scientific Software},
  journal = {Computing in Science \& Engineering},
  volume  = {22}, number = {2}, pages = {78--87}, year = {2020},
  doi     = {10.1109/MCSE.2018.2880577}
}
@inproceedings{raunak2021mtvv,
  author    = {Raunak, M. S. and Olsen, Megan M.},
  title     = {Metamorphic Testing on the Continuum of Verification and Validation of Simulation Models},
  booktitle = {2021 IEEE/ACM 6th International Workshop on Metamorphic Testing (MET)},
  pages     = {47--52}, year = {2021},
  doi       = {10.1109/MET52542.2021.00015}
}
@article{zhou2019driverless,
  author  = {Zhou, Zhi Quan and Sun, Liqun},
  title   = {Metamorphic Testing of Driverless Cars},
  journal = {Communications of the ACM},
  volume  = {62}, number = {3}, pages = {61--67}, year = {2019},
  doi     = {10.1145/3241979}
}
@article{sorokin2026ensembles,
  author  = {Sorokin, Lev and Biagiola, Matteo and Stocco, Andrea},
  title   = {Simulator Ensembles for Trustworthy Autonomous Driving Systems Testing},
  journal = {Empirical Software Engineering},
  volume  = {31}, number = {4}, year = {2026},
  doi     = {10.1007/s10664-026-10821-7}
}
@misc{li2025physicsfailures,
  author        = {Li, Shuqing and Chen, Qiang and Ren, Xiaoxue and Lyu, Michael R.},
  title         = {Runtime Failure Hunting for Physics Engine Based Software Systems: How Far Can We Go?},
  year          = {2025},
  eprint        = {2507.22099},
  archivePrefix = {arXiv},
  primaryClass  = {cs.SE}
}
@misc{kulshreshtha2026fmu,
  author        = {Kulshreshtha, Ashir and Mughees, Abdullah and Sudheerbabu, Gaadha and Ahmad, Tanwir and Klemets, Kristian and Truscan, Dragos and Manng{\aa}rd, Mikael},
  title         = {Multi-Agent Specification-based Metamorphic Testing of {FMU}-Based Simulations},
  year          = {2026},
  eprint        = {2605.25101},
  archivePrefix = {arXiv},
  note          = {Accepted at the 10th International Workshop on Metamorphic Testing (MET 2026), COMPSAC 2026}
}
@inproceedings{liu2023evalplus,
  author    = {Liu, Jiawei and Xia, Chunqiu Steven and Wang, Yuyao and Zhang, Lingming},
  title     = {Is Your Code Generated by {ChatGPT} Really Correct? Rigorous Evaluation of Large Language Models for Code Generation},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS)},
  pages     = {21558--21572}, year = {2023},
  doi       = {10.52202/075280-0943}
}
@misc{hamidi2026criteria,
  author        = {Hamidi, Asma and Konstantinou, Michael and Degiovanni, Renzo and Papadakis, Mike},
  title         = {How Effective Are Traditional Test Criteria at Detecting Bugs in Large Language Models Generated Code?},
  year          = {2026},
  eprint        = {2609.09315},
  archivePrefix = {arXiv},
  primaryClass  = {cs.SE}
}
@article{tambon2025bugs,
  author  = {Tambon, Florian and Moradi-Dakhel, Arghavan and Nikanjam, Amin and Khomh, Foutse and Desmarais, Michel C. and Antoniol, Giuliano},
  title   = {Bugs in Large Language Models Generated Code: An Empirical Study},
  journal = {Empirical Software Engineering},
  volume  = {30}, number = {3}, year = {2025},
  doi     = {10.1007/s10664-025-10614-4}
}
@article{liu2024refining,
  author  = {Liu, Yue and Le-Cong, Thanh and Widyasari, Ratnadira and Tantithamthavorn, Chakkrit and Li, Li and Le, Xuan-Bach D. and Lo, David},
  title   = {Refining {ChatGPT}-Generated Code: Characterizing and Mitigating Code Quality Issues},
  journal = {ACM Transactions on Software Engineering and Methodology},
  volume  = {33}, number = {5}, pages = {1--26}, year = {2024},
  doi     = {10.1145/3643674}
}
@misc{vikram2023pbt,
  author        = {Vikram, Vasudev and Lemieux, Caroline and Sunshine, Joshua and Padhye, Rohan},
  title         = {Can Large Language Models Write Good Property-Based Tests?},
  year          = {2023},
  eprint        = {2307.04346},
  archivePrefix = {arXiv},
  primaryClass  = {cs.SE}
}
@misc{maaz2025agenticpbt,
  author        = {Maaz, Muhammad and DeVoe, Liam and Hatfield-Dodds, Zac and Carlini, Nicholas},
  title         = {Agentic Property-Based Testing: Finding Bugs Across the {Python} Ecosystem},
  year          = {2025},
  eprint        = {2510.09907},
  archivePrefix = {arXiv},
  note          = {NeurIPS 2025 Workshop: The 4th Deep Learning for Code Workshop}
}
@article{endres2024nl2postcond,
  author  = {Endres, Madeline and Fakhoury, Sarah and Chakraborty, Saikat and Lahiri, Shuvendu K.},
  title   = {Can Large Language Models Transform Natural Language Intent into Formal Method Postconditions?},
  journal = {Proceedings of the ACM on Software Engineering},
  volume  = {1}, number = {FSE}, pages = {1889--1912}, year = {2024},
  doi     = {10.1145/3660791}
}
@misc{chen2022codet,
  author        = {Chen, Bei and Zhang, Fengji and Nguyen, Anh and Zan, Daoguang and Lin, Zeqi and Lou, Jian-Guang and Chen, Weizhu},
  title         = {{CodeT}: Code Generation with Generated Tests},
  year          = {2022},
  eprint        = {2207.10397},
  archivePrefix = {arXiv},
  note          = {ICLR 2023 venue not re-verified}
}
@article{sargent2013vv,
  author  = {Sargent, Robert G.},
  title   = {Verification and Validation of Simulation Models},
  journal = {Journal of Simulation},
  volume  = {7}, number = {1}, pages = {12--24}, year = {2013},
  doi     = {10.1057/jos.2012.20}
}
@inproceedings{balci1997vva,
  author    = {Balci, Osman},
  title     = {Verification, Validation and Accreditation of Simulation Models},
  booktitle = {Proceedings of the 29th Winter Simulation Conference (WSC)},
  pages     = {135--141}, year = {1997},
  doi       = {10.1145/268437.268462}
}
@article{kleijnen1995vv,
  author  = {Kleijnen, Jack P. C.},
  title   = {Verification and Validation of Simulation Models},
  journal = {European Journal of Operational Research},
  volume  = {82}, number = {1}, pages = {145--162}, year = {1995},
  doi     = {10.1016/0377-2217(94)00016-6}
}
@article{schieferdecker2026ai4se,
  author  = {Schieferdecker, Ina K.},
  title   = {Augmenting Software Engineering with {AI}. The ai4se Taxonomy and Its Use},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, year = {2026},
  doi     = {10.1007/s11334-026-00652-6}
}
@article{kumari2026vimsuit,
  author  = {Kumari, Pragati and Dey, Arnab and Deb, Novarun},
  title   = {{ViMSUIT}: Vision-Metadata Inferences for Software {UI} Testing},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, year = {2026},
  doi     = {10.1007/s11334-026-00656-2}
}
@article{hermawan2026log,
  author  = {Hermawan, Rahmanu and Bucaioni, Alessio and Enoiu, Eduard and Afzal, Wasif and Saadatmand, Mehrdad and Zaimovic, Nedim and Ibtasham, Md Saleh},
  title   = {Let's Read the Log: Root Cause Analysis of Railway Test Execution Logs with Large Language Models},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, year = {2026},
  doi     = {10.1007/s11334-026-00657-1}
}
@article{waldvogel2026blockdiagram,
  author  = {Waldvogel, Andreas and Koehler, Franz and Annighoefer, Bjoern},
  title   = {Model-Based Block Diagram Recognition for Model Visualization Verification -- Extended Version},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, year = {2026},
  doi     = {10.1007/s11334-026-00633-9}
}
@article{graics2026gamma,
  author  = {Graics, Bence and Moln{\'a}r, Vince and Majzik, Istv{\'a}n},
  title   = {Integration Test Generation for State-Based Components in the {Gamma} Framework},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, year = {2026},
  doi     = {10.1007/s11334-026-00643-7}
}
@article{priya2022verifying,
  author  = {Priya, Siddharth and Zhou, Xiang and Su, Yusen and Vizel, Yakir and Bao, Yuyan and Gurfinkel, Arie},
  title   = {Verifying Verified Code},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {18}, number = {3}, pages = {335--346}, year = {2022},
  doi     = {10.1007/s11334-022-00443-9}
}
@article{aitwakrime2022editorial,
  author  = {Ait Wakrime, Abderrahim and Ouhammou, Yassine},
  title   = {Advances in Modeling, Verification and Testing of Safety-Critical Software Architectures},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {18}, number = {4}, pages = {483--484}, year = {2022},
  doi     = {10.1007/s11334-022-00493-z}
}
```

---

## Search queries run (2026-11-13)

Crossref API (`query.bibliographic`):
1. The oracle problem in software testing: a survey Barr Harman McMinn
2. TOGA: a neural method for test oracle generation Dinella
3. Neural-based test oracle generation: a large-scale evaluation and lessons learned Hossain
4. Do LLMs generate test oracles that capture the actual or the expected program behaviour
5. Metamorphic testing: a review of challenges and opportunities Chen Kuo
6. A survey on metamorphic testing Segura Fraser Sanchez Ruiz-Cortes
7. Is your code generated by ChatGPT really correct? rigorous evaluation ...
8. Testing scientific software: a systematic literature review Kanewala Bieman
9. Verification and validation of simulation models Sargent (Journal of Simulation / WSC)
10. Metamorphic testing of driverless cars Zhou Sun
11. Test oracle automation in the era of LLMs
12. Balci verification validation and accreditation of simulation models
13. Kleijnen verification and validation of simulation models EJOR
14. Testing physics engines metamorphic
15. Metamorphic testing of simulation software autonomous driving simulator
16. automated testing of video games game engine physics bugs
17. Property-based testing LLM generated code PBT / Can LLMs write good property-based tests
18. nl2postcond ...; ClassEval; Program code generation with generative AIs ISSE
19. GLIB automated test oracle graphically-rich applications; GlitchBench
20. Raunak Olsen MT V&V simulation MET 2021; Exploratory MT scientific software SWMM
21. Refining ChatGPT-generated code; Bugs in LLM generated code Tambon; CodeT
22. Empirical evaluation LLM unit test generation Schäfer; trustworthy assertion generation; Assessing evaluation metrics neural test oracle generation
23. Applying design by contract Meyer; Daikon Ernst invariants

Crossref API, ISSE only (`filter=issn:1614-5046,from-pub-date:2022-01-01`): "test oracle", "metamorphic testing", "large language model code generation", "ChatGPT generated code", "simulation model verification validation", "automated test generation", "LLM testing", "generative AI software development", "GitHub Copilot", "mutation testing", "runtime verification monitoring invariants", "GUI testing image", "digital twin simulation testing", "program repair", "assertion", "cyber-physical systems testing simulation", "language models", "testing", "simulation".

Web search:
- metamorphic testing physics engine simulation bugs empirical study ICSE OR FSE OR ISSTA
- large language models property-based testing generate properties evaluation paper 2024 2025
- LLM code generation "test insufficiency" OR "incorrect but plausible" OR "passes tests" study TOSEM OR ICSE 2024 2025
- "Innovations in Systems and Software Engineering" large language model code generation testing 2024 OR 2025 link.springer.com s11334

arXiv API (abstract records): 2307.04346, 2510.09907, 2507.22099, 2609.09315, 2605.25101, 2207.10397.

Blocked or not used: the DBLP search API (it served a bot-check page, which was not bypassed) and Springer article pages (they redirect to a login flow).
