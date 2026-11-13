# Related work — LLM repair / feedback side (for the ISSE mechsim-oracle paper)

Collected 2026-11-13 by web search + opening each entry's public page. Scope: self-repair and self-correction, feedback granularity, LLM-based APR, LLM/VLM-as-judge reliability, and knowledge vs. localization errors. Entries already in `novelty_gate.md` §2 (Self-Debug, Perceptual Self-Reflection, LAM, Articulate-Anything, CADCodeVerify, SGA, MSynth) are not repeated.

**Verification legend**
- **V** = verified: I opened the publisher, proceedings, ACL Anthology, researchr, or arXiv abstract page, and the venue/DOI shown here comes from that page.
- **V-arXiv** = arXiv abstract page opened, and the venue comes from the arXiv comments field ("Accepted to ..."). No publisher page was opened, so check page numbers and DOI before the camera-ready version.
- **P** = preprint (arXiv only, no peer-reviewed venue found).
- **UNVERIFIED** = only seen in search snippets.

Priority: ★ = must cite; others are optional or supporting.

---

## G1. Self-repair and self-correction with execution or external feedback

**1. ★ Olausson et al. 2024, Is Self-Repair a Silver Bullet? — V-arXiv**
Theo X. Olausson, Jeevana Priya Inala, Chenglong Wang, Jianfeng Gao, Armando Solar-Lezama. "Is Self-Repair a Silver Bullet for Code Generation?" ICLR 2024. https://arxiv.org/abs/2306.09896
- **What it does:** Measures self-repair (generate, get execution feedback, model writes a critique, repair) on HumanEval and APPS, accounting for sampling cost. Self-repair gains are modest and inconsistent. Gains grow substantially when a stronger model, or a human, writes the feedback. The authors identify feedback quality as the bottleneck.
- **Relation to us:** This is the closest antecedent of our "feedback content matters" finding. They vary *who writes* the feedback (self, stronger model, human). We vary *how specific* a deterministic oracle's feedback is (location only, location plus correct value, check name plus magnitude), cross that with model size, and gate stopping on the oracle.

**2. ★ Shinn et al. 2023, Reflexion — V**
Noah Shinn, Federico Cassano, Ashwin Gopinath, Karthik Narasimhan, Shunyu Yao. "Reflexion: Language Agents with Verbal Reinforcement Learning." NeurIPS 2023 (Advances in Neural Information Processing Systems 36). https://proceedings.neurips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html (arXiv 2303.11366)
- **What it does:** The agent writes verbal reflections on task feedback (for code, unit-test results) into an episodic memory and retries.
- **Relation to us:** Reflexion is a generic reflect-and-retry loop that trusts its feedback signal. Our self-refine baseline (6/22) is this family. Without an analytic oracle, reflections confirm wrong design knowledge.

**3. ★ Madaan et al. 2023, Self-Refine — V**
Aman Madaan, Niket Tandon, Prakhar Gupta, Skyler Hallinan, Luyu Gao, Sarah Wiegreffe, Uri Alon, Nouha Dziri, Shrimai Prabhumoye, Yiming Yang, Shashank Gupta, Bodhisattwa Prasad Majumder, Katherine Hermann, Sean Welleck, Amir Yazdanbakhsh, Peter Clark. "Self-Refine: Iterative Refinement with Self-Feedback." NeurIPS 2023. https://proceedings.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html (arXiv 2303.17651)
- **What it does:** One LLM generates, critiques, and refines its own output with no external signal, across 7 tasks.
- **Relation to us:** This is our self-refine baseline. A search snippet of the paper's ablation says specific, actionable feedback beats generic feedback, which beats no feedback (Code Optimization 27.5 / 26.0 / 24.8). That figure is UNVERIFIED (snippet only); check the table before quoting it. They have no external oracle and no cross with model size.

**4. ★ Huang et al. 2024, LLMs Cannot Self-Correct Reasoning Yet — V-arXiv**
Jie Huang, Xinyun Chen, Swaroop Mishra, Huaixiu Steven Zheng, Adams Wei Yu, Xinying Song, Denny Zhou. "Large Language Models Cannot Self-Correct Reasoning Yet." ICLR 2024. https://arxiv.org/abs/2310.01798
- **What it does:** Shows that without external feedback, intrinsic self-correction does not improve reasoning and can lower accuracy.
- **Relation to us:** This is the theoretical motivation for an external oracle. Our observation that self-refine agents "confidently claim wrong design knowledge is correct" is a domain instance of it.

**5. ★ Kamoi et al. 2024, When Can LLMs Actually Correct Their Own Mistakes? — V-arXiv**
Ryo Kamoi, Yusen Zhang, Nan Zhang, Jiawei Han, Rui Zhang. "When Can LLMs Actually Correct Their Own Mistakes? A Critical Survey of Self-Correction of LLMs." Transactions of the Association for Computational Linguistics 12:1417–1440, 2024. DOI 10.1162/tacl_a_00713. https://arxiv.org/abs/2406.01297
- **What it does:** A critical survey. It concludes that self-correction works when reliable external feedback exists, and that prompted self-feedback has not been shown to work in general.
- **Relation to us:** It supports the framing that "the oracle is the reliable external feedback." We supply such feedback for a domain (3D kinematics) where tests are not normally available.

**6. Gou et al. 2024, CRITIC — V-arXiv**
Zhibin Gou, Zhihong Shao, Yeyun Gong, Yelong Shen, Yujiu Yang, Nan Duan, Weizhu Chen. "CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing." ICLR 2024. https://arxiv.org/abs/2305.11738
- **What it does:** The LLM verifies its draft with external tools (search, code interpreter) and revises.
- **Relation to us:** CRITIC uses tools as critics. Our oracle is a tool-critic with domain ground truth. CRITIC does not vary how much of the tool output is shown.

**7. Chen et al. 2023, CodeT — V**
Bei Chen, Fengji Zhang, Anh Nguyen, Daoguang Zan, Zeqi Lin, Jian-Guang Lou, Weizhu Chen. "CodeT: Code Generation with Generated Tests." ICLR 2023. https://iclr.cc/virtual/2023/poster/12011 (arXiv 2207.10397)
- **What it does:** The LLM generates tests as well as candidate solutions, and selection uses dual execution agreement.
- **Relation to us:** This is execution-based *selection* with model-generated tests, not repair. Our oracle is hand-derived from analytic kinematics, so it does not share the model's misconceptions.

**8. Ni et al. 2023, LEVER — V-arXiv**
Ansong Ni, Srini Iyer, Dragomir Radev, Ves Stoyanov, Wen-tau Yih, Sida I. Wang, Xi Victoria Lin. "LEVER: Learning to Verify Language-to-Code Generation with Execution." ICML 2023. https://arxiv.org/abs/2302.08468
- **What it does:** A learned verifier reranks LLM programs using the task, the program, and its execution results.
- **Relation to us:** This is a learned acceptance gate. Ours is a deterministic, specification-derived gate that also produces repair feedback.

**9. Tsui 2026, Self-Correction Bench — V-arXiv**
Ken Tsui. "Self-Correction Bench: Uncovering and Addressing the Self-Correction Blind Spot in Large Language Models." COLM 2026 (accepted, per arXiv). https://arxiv.org/abs/2507.02778
- **What it does:** Models fix an error when it is presented as external, but miss the identical error in their own output (a 64.5% "blind spot" across 14 models).
- **Relation to us:** This explains why self-refine accepts its own wrong design knowledge, while the same model fixes the error once an external oracle names it.

## G2. Feedback granularity and informativeness for LLM repair

**10. ★ Han et al. 2025, ConvCodeWorld — V-arXiv**
Hojae Han, Seung-won Hwang, Rajhans Samdani, Yuxiong He. "ConvCodeWorld: Benchmarking Conversational Code Generation in Reproducible Feedback Environments." ICLR 2025. https://arxiv.org/abs/2502.19852
- **What it does:** Nine feedback scenarios combining compilation feedback, execution feedback at different test coverage, and simulated verbal feedback (novice vs. expert). Performance varies strongly with feedback type. Weaker LLMs given sufficient feedback can beat stronger LLMs that get no feedback.
- **Relation to us:** This is the closest systematic study of feedback content. Its axes are coverage and expertise, on standard Python tasks. It does not isolate "location only" vs. "location plus correct value," does not report a per-model-size interaction for those levels, and has no domain oracle as the stop gate.

**11. ★ Dai et al. 2025, FeedbackEval — P**
Dekun Dai, MingWei Liu, Anji Li, Jialun Cao, Yanlin Wang, Chong Wang, Xin Peng, Zibin Zheng. "FeedbackEval: A Benchmark for Evaluating Large Language Models in Feedback-Driven Code Repair Tasks." arXiv:2504.06939, 2025 (v2 Feb 2026). https://arxiv.org/abs/2504.06939
- **What it does:** Compares six feedback types (mixed, LLM-Expert, test, minimal, compiler, LLM-Skilled) across five LLMs. Mixed feedback is best (63.6%), followed by LLM-Expert (62.9%) and test (57.9%); minimal gets 53.1% and compiler 49.2%. Iteration helps but plateaus after 2–3 rounds.
- **Relation to us:** This is the closest SE-side feedback-type comparison. The types are categorical, not a controlled specificity ladder from the same oracle, and the study does not cross feedback type with model size the way we do (Haiku needs the value, Sonnet needs only the location). A search snippet says mixed feedback helps "particularly stronger models" (UNVERIFIED, snippet only).

**12. Lalonde et al. 2026, Revisiting Feedback-Driven LLM Code Repair — P**
Louis Lalonde, Wassim Keddache, Thomas Perron Touchette, Leuson Da Silva, Foutse Khomh. "Revisiting Feedback-Driven LLM Code Repair: A Replication and Exploratory Java Extension." arXiv:2609.00362, 2026. https://arxiv.org/abs/2609.00362
- **What it does:** Replicates FeedbackEval on Python, where test feedback is strongest. In Java, simple and JUnit test feedback do not differ, and the authors attribute this to feedback informativeness and tooling.
- **Relation to us:** It shows that feedback-type rankings are fragile across settings. That supports our controlled, same-oracle specificity ladder.

**13. Zheng et al. 2025, What Makes LLMs Reason in (Multi-Turn) Code Generation? — V-arXiv**
Kunhao Zheng, Juliette Decugis, Jonas Gehring, Taco Cohen, Benjamin Negrevergne, Gabriel Synnaeve. "What Makes Large Language Models Reason in (Multi-Turn) Code Generation?" ICLR 2025. https://arxiv.org/abs/2410.08105
- **What it does:** A systematic grid over reasoning, instruction, and execution-feedback prompts in multi-turn code generation (Llama 3.x 8B/70B/405B, GPT-4o) on CodeContests and TACO.
- **Relation to us:** It includes execution-feedback prompt variants across model sizes on competitive programming. Check the full paper for any feedback-granularity × size result. The abstract does not report one.

**14. Wang et al. 2024, MINT — V-arXiv**
Xingyao Wang, Zihan Wang, Jiateng Liu, Yangyi Chen, Lifan Yuan, Hao Peng, Heng Ji. "MINT: Evaluating LLMs in Multi-turn Interaction with Tools and Language Feedback." ICLR 2024. https://arxiv.org/abs/2309.10691
- **What it does:** Multi-turn benchmark with tool execution and GPT-4-simulated natural-language feedback. Feedback gives 2–17% absolute gains, and single-turn strength does not predict multi-turn gains.
- **Relation to us:** This is natural-language feedback from a model. Ours is deterministic oracle feedback with controlled content.

**15. Pan et al. 2025, When Benchmarks Talk — V**
Jane Pan, Ryan Shar, Jacob Pfau, Ameet Talwalkar, He He, Valerie Chen. "When Benchmarks Talk: Re-Evaluating Code LLMs with Interactive Feedback." Findings of ACL 2025, pp. 24672–24700. DOI 10.18653/v1/2025.findings-acl.1267. https://aclanthology.org/2025.findings-acl.1267/
- **What it does:** Hides parts of the task so 10 models must interact with a simulated user. Rankings change, and different feedback types react differently to high- vs. low-quality feedback.
- **Relation to us:** It shows a feedback-type × model interaction for simulated-user feedback. Our setting is oracle feedback with ground truth.

**16. Pan et al. 2025, Generate-Feedback-Refine — V (workshop)**
Xiang Pan, Jason Phang, Guy Davidson, Ethan Perez. "Generate-Feedback-Refine: How Much Does Model Quality in Each Role Matter?" 3rd DL4C Workshop at ICLR 2025 (workshop poster). https://www.iclr.cc/virtual/2025/34833
- **What it does:** Varies model strength separately for the generator, feedback, and refiner roles on MBPP, APPS, and DS-1000. Weaker-model feedback is sometimes as useful as stronger-model feedback. On MBPP, feedback mainly helps weaker generators.
- **Relation to us:** This is the **closest prior on "model size × feedback."** But the feedback is LLM-written, so its specificity is not controlled, and there is no ground-truth oracle. Our result is sharper: the smaller model needs the correct value, while the larger one needs only the location.

**17. Zhang et al. 2023, Self-Edit — V-arXiv**
Kechi Zhang, Zhuo Li, Jia Li, Ge Li, Zhi Jin. "Self-Edit: Fault-Aware Code Editor for Code Generation." ACL 2023. https://arxiv.org/abs/2305.04087
- **What it does:** Runs the generated code on the example test, turns the execution result into a comment, and a fault-aware editor fixes the code. Evaluated across nine LLMs from 110M to 175B parameters.
- **Relation to us:** This is execution-result feedback across model sizes, but at a single feedback granularity.

**18. Zhong et al. 2024, LDB — V**
Li Zhong, Zilong Wang, Jingbo Shang. "Debug like a Human: A Large Language Model Debugger via Verifying Runtime Execution Step by Step." Findings of ACL 2024, pp. 851–870. DOI 10.18653/v1/2024.findings-acl.49. https://aclanthology.org/2024.findings-acl.49/
- **What it does:** Segments programs into basic blocks and shows the model intermediate variable values so it can locate the faulty block (up to +9.8%).
- **Relation to us:** This is localized, value-level runtime feedback. Our "location plus correct value" condition is the oracle-side analogue: it gives the *expected* value, while LDB shows only the *observed* values.

**19. He et al. 2025, PGS (property-oriented, minimal feedback) — P**
Lehan He, Zeren Chen, Zhe Zhang, Xiang Gao, Lu Sheng. "Effective LLM Code Refinement via Property-Oriented and Structurally Minimal Feedback." arXiv:2506.18315, 2025 (v2 May 2026). https://arxiv.org/abs/2506.18315
- **What it does:** Argues that test-driven refinement is limited by feedback quality. Gives the LLM property violations plus the simplest counterexample, and fixes over 64% of initially failed problems.
- **Relation to us:** This is a design principle close to ours: property-based checks give semantic, minimal feedback. Our checks are kinematic properties (loop closure, transmission, invariants) with analytic expected values.

**20. Sepidband et al. 2026, Role of Fault Localization Context — P**
Melika Sepidband, Hung Viet Pham, Hadi Hemmati. "On the Role of Fault Localization Context for LLM-Based Program Repair." arXiv:2604.05481, 2026. https://arxiv.org/abs/2604.05481
- **What it does:** Runs 61 localization-context configurations on 500 SWE-bench Verified instances (GPT-5-mini). File-level localization dominates, and line-level expansion often hurts.
- **Relation to us:** Supporting evidence that location helps, but more localization text is not always better. We add that location alone is insufficient for a smaller model when the bug is a knowledge error.

## G3. LLM-based automated program repair (SE venues)

**21. ★ Xia & Zhang 2024, ChatRepair — V**
Chunqiu Steven Xia, Lingming Zhang. "Automated Program Repair via Conversation: Fixing 162 out of 337 Bugs for $0.42 Each using ChatGPT" (arXiv title: "Keep the Conversation Going: ..."). ISSTA 2024. DOI 10.1145/3650212.3680323. https://arxiv.org/abs/2304.00385
- **What it does:** Conversational APR. It feeds test-failure information back to the model, reuses failed patches together with their failures, and stops once all tests pass.
- **Relation to us:** This is the canonical "test feedback in the loop, test-gated stop" APR design. We transfer the pattern to a domain without unit tests (3D kinematic simulators), where the oracle must first be built. We also ablate how much of the failure information is shown.

**22. ★ Fan et al. 2023, Automated Repair of Programs from LLMs — V**
Zhiyu Fan, Xiang Gao, Martin Mirchev, Abhik Roychoudhury, Shin Hwei Tan. "Automated Repair of Programs from Large Language Models." ICSE 2023, pp. 1469–1481. DOI 10.1109/ICSE48619.2023.00128. https://buaa.globalimpact.cn/en/publications/automated-repair-of-programs-from-large-language-models/ (arXiv 2205.10583)
- **What it does:** Repairs Codex-generated LeetCode solutions with APR tools and Codex-edit. Codex mistakes resemble human mistakes, and given fault-localization information, Codex-edit matches or beats TBar and Recoder.
- **Relation to us:** This is the original "repair LLM-generated code" study, and it already shows that bug location matters. We add a further step beyond location (the correct value) and show that this step is decisive for the smaller model.

**23. Xia, Wei & Zhang 2023, Practical Program Repair in the Era of Large Pre-trained LMs — V**
Chunqiu Steven Xia, Yuxiang Wei, Lingming Zhang. "Automated Program Repair in the Era of Large Pre-trained Language Models" (arXiv title "Practical Program Repair in the Era of Large Pre-trained Language Models"). ICSE 2023. DOI 10.1109/ICSE48619.2023.00129. https://arxiv.org/abs/2210.14179
- **What it does:** The first large study of nine LLMs for APR across five benchmarks and three languages.
- **Relation to us:** Background on LLM-APR scale effects.

**24. Xia & Zhang 2022, AlphaRepair — V**
Chunqiu Steven Xia, Lingming Zhang. "Less Training, More Repairing Please: Revisiting Automated Program Repair via Zero-shot Learning." ESEC/FSE 2022. DOI 10.1145/3540250.3549101. https://arxiv.org/abs/2207.08281
- **What it does:** Cloze-style zero-shot APR with a pre-trained code model.
- **Relation to us:** Background (the pre-conversational LLM-APR era).

**25. ★ Zhang et al. 2024, AutoCodeRover — V**
Yuntong Zhang, Haifeng Ruan, Zhiyu Fan, Abhik Roychoudhury. "AutoCodeRover: Autonomous Program Improvement." ISSTA 2024. DOI 10.1145/3650212.3680384. https://2024.issta.org/details/issta-2024-papers/127/AutoCodeRover-Autonomous-Program-Improvement
- **What it does:** An agent that combines AST-aware code search with spectrum-based fault localization from tests to resolve GitHub issues.
- **Relation to us:** Agentic repair where localization is the key intermediate signal. We quantify location-only vs. location-plus-value feedback.

**26. ★ Yang et al. 2024, SWE-agent — V**
John Yang, Carlos E. Jimenez, Alexander Wettig, Kilian Lieret, Shunyu Yao, Karthik Narasimhan, Ofir Press. "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering." NeurIPS 2024. https://papers.neurips.cc/paper_files/paper/2024/hash/5a7c947568c1b1328ccc5230172e1e7c-Abstract-Conference.html (arXiv 2405.15793)
- **What it does:** Shows that agent-computer interface design (edit, navigate, run tests) drives agent repair performance.
- **Relation to us:** The interface or feedback channel design matters. Our oracle report format is such an interface.

**27. Xia et al. 2025, Agentless — V**
Chunqiu Steven Xia, Yinlin Deng, Soren Dunn, Lingming Zhang. "Demystifying LLM-based Software Engineering Agents" (arXiv: "Agentless: ..."). FSE 2025 (PACMSE). DOI 10.1145/3715754. https://conf.researchr.org/details/fse-2025/fse-2025-research-papers/85/Demystifying-LLM-based-Software-Engineering-Agents
- **What it does:** A fixed three-phase pipeline (localize, repair, validate) that matches complex agents.
- **Relation to us:** It separates localization from patch generation explicitly, which is the same split as our "where" vs. "what value" feedback.

**28. Bouzenia, Devanbu & Pradel 2025, RepairAgent — V**
Islem Bouzenia, Premkumar Devanbu, Michael Pradel. "RepairAgent: An Autonomous, LLM-Based Agent for Program Repair." ICSE 2025 (Research Track). https://conf.researchr.org/details/icse-2025/icse-2025-research-track/160/RepairAgent-An-Autonomous-LLM-Based-Agent-for-Program-Repair (arXiv 2403.17134). DOI: not shown on the opened pages; leave blank.
- **What it does:** An autonomous agent with tool use (tests, info retrieval) that fixes 164 Defects4J bugs.
- **Relation to us:** Agentic APR with test-gated validation, on a general-purpose bug benchmark.

**29. Zhang et al. 2026, LLM-APR systematic literature review — V-arXiv**
Quanjun Zhang, Chunrong Fang, Yang Xie, YuXiang Ma, Weisong Sun, Yun Yang, Zhenyu Chen. "A Systematic Literature Review on Large Language Models for Automated Program Repair." ACM TOSEM (accepted 2026, per arXiv v4). https://arxiv.org/abs/2405.01466
- **What it does:** A systematic literature review of 189 LLM-APR papers (2020–2025): LLMs used, utilization strategies, repair scenarios, and input forms.
- **Relation to us:** Use it as the umbrella citation for the APR field. Check whether its "input forms" section discusses feedback content granularity.

## G4. LLM-/VLM-as-a-judge reliability

**30. ★ Zheng et al. 2023, Judging LLM-as-a-Judge — V-arXiv**
Lianmin Zheng, Wei-Lin Chiang, Ying Sheng, Siyuan Zhuang, Zhanghao Wu, et al. (13 authors). "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena." NeurIPS 2023 Datasets and Benchmarks Track. https://arxiv.org/abs/2306.05685
- **What it does:** Identifies position, verbosity, and self-enhancement biases in LLM judges.
- **Relation to us:** Motivates why we do not use an LLM or VLM as the acceptance gate.

**31. Wang et al. 2024, LLMs are not Fair Evaluators — V**
Peiyi Wang, Lei Li, Liang Chen, Zefan Cai, Dawei Zhu, Binghuai Lin, Yunbo Cao, Lingpeng Kong, Qi Liu, Tianyu Liu, Zhifang Sui. "Large Language Models are not Fair Evaluators." ACL 2024 (Long), pp. 9440–9450. DOI 10.18653/v1/2024.acl-long.511. https://aclanthology.org/2024.acl-long.511/
- **What it does:** Shows that swapping the order of candidates flips GPT-4 judgments, and proposes calibration methods.
- **Relation to us:** Additional evidence on positional bias in judges.

**32. ★ Chen et al. 2024, MLLM-as-a-Judge — V-arXiv**
Dongping Chen, Ruoxi Chen, Shilin Zhang, Yinuo Liu, Yaochen Wang, Huichi Zhou, Qihui Zhang, Yao Wan, Pan Zhou, Lichao Sun. "MLLM-as-a-Judge: Assessing Multimodal LLM-as-a-Judge with Vision-Language Benchmark." ICML 2024 (oral). https://arxiv.org/abs/2402.04788
- **What it does:** Multimodal judges, GPT-4V included, show biases, hallucinated judgments, and inconsistency, especially in scoring and ranking.
- **Relation to us:** The direct precedent for our VLM-in-the-loop arm (5/22): a VLM reviewing screenshots is an unreliable judge.

**33. Rahmanzadehgervi et al. 2024, Vision Language Models are Blind — V-arXiv (venue from CVF listing in search)**
Pooyan Rahmanzadehgervi, Logan Bolton, Mohammad Reza Taesiri, Anh Totti Nguyen. "Vision Language Models are Blind." ACCV 2024, pp. 18–34 (venue and pages from the CVF Open Access listing seen in search; the page itself returned 403). arXiv v6 title: "...: Failing to translate detailed visual features into words." https://arxiv.org/abs/2407.06581
- **What it does:** VLMs fail simple geometric tasks (overlapping circles, line intersections). Claude 3.5 Sonnet is best at about 74–78%.
- **Relation to us:** It explains why screenshot review misses small geometric and kinematic errors, such as a linkage that is slightly off or a gear that interpenetrates.

**34. ★ Wang et al. 2025, LLM-as-a-Judge in Software Engineering — V**
Ruiqi Wang, Jiyu Guo, Cuiyun Gao, Guodong Fan, Chun Yong Chong, Xin Xia. "Can LLMs Replace Human Evaluators? An Empirical Study of LLM-as-a-Judge in Software Engineering." ISSTA 2025 (PACMSE). DOI 10.1145/3728963. https://conf.researchr.org/details/issta-2025/issta-2025-papers/85/Can-LLMs-replace-Human-Evaluators-An-Empirical-Study-of-LLM-as-a-Judge-in-Software-E
- **What it does:** Seven LLM-as-judge methods compared against human scores on code translation, generation, and summarization. Output-based judges align best, with Pearson correlations up to 81.32 (translation) and 68.51 (generation).
- **Relation to us:** This is the SE-venue counterpoint (judges can be fairly good). It compares against humans, not against execution ground truth on a specialist domain.

**35. ★ Crupi et al. 2025, LLM-as-a-Judge for Code Generation and Summarization — V-arXiv**
Giuseppe Crupi, Rosalia Tufano, Alejandro Velasco, Antonio Mastropaolo, Denys Poshyvanyk, Gabriele Bavota. "On the Effectiveness of LLM-as-a-judge for Code Generation and Summarization." IEEE Transactions on Software Engineering, 2025. https://arxiv.org/abs/2507.16587 (a search snippet gives vol. 51, no. 8, pp. 2329–2345 via NSF PAR; UNVERIFIED, so check on IEEE Xplore)
- **What it does:** Eight LLMs judge the correctness of 1,405 Java and 1,281 Python methods. Even the best (GPT-4-turbo) often misjudges correctness, and smaller LLMs cannot do the task.
- **Relation to us:** This is the strongest SE evidence that a model judge is not a correctness oracle, and that judging ability depends on model size. It is parallel to our size effect, but on the judge side.

## G5. Knowledge errors vs. localization: hallucinated domain facts in code

**36. ★ Liu et al. 2025/26, Hallucinations in LLM-Generated Code — V-arXiv**
Fang Liu, Yang Liu, Lin Shi, Zhen Yang, Li Zhang, Xiaoli Lian, Zhongqi Li, Yuchi Ma. "Beyond Functional Correctness: Exploring Hallucinations in LLM-Generated Code" (earlier title "Exploring and Evaluating Hallucinations in LLM-Powered Code Generation"). IEEE TSE (accepted, per arXiv v3, Jan 2026). https://arxiv.org/abs/2404.00971
- **What it does:** A taxonomy of code hallucinations (3 primary and 12 specific categories), including outputs misaligned with real-world knowledge.
- **Relation to us:** Our "wrong design knowledge" faults (for example, a wrong Jansen linkage length or a wrong Chebyshev ratio) are knowledge-conflicting hallucinations. We show that location-only feedback cannot fix them for a smaller model.

**37. ★ Zhang et al. 2025, LLM Hallucinations in Practical Code Generation — V-arXiv**
Ziyao Zhang, Yanlin Wang, Chong Wang, Jiachi Chen, Zibin Zheng. "LLM Hallucinations in Practical Code Generation: Phenomena, Mechanism, and Mitigation." ISSTA 2025. https://arxiv.org/abs/2409.20550 (DOI not opened; leave blank)
- **What it does:** A repository-level hallucination taxonomy over six LLMs, four contributing factors, and RAG mitigation.
- **Relation to us:** Its mitigation supplies the missing knowledge, which is the same principle as our "correct value" feedback.

**38. Tian et al. 2025, CodeHalu — V-arXiv**
Yuchen Tian, Weixiang Yan, Qian Yang, Xuandong Zhao, Qian Chen, Wen Wang, Ziyang Luo, Lei Ma, Dawn Song. "CodeHalu: Investigating Code Hallucinations in LLMs via Execution-based Verification." AAAI 2025 (a search snippet gives pp. 25300–25308, DOI 10.1609/aaai.v39i24.34717; the AAAI page was bot-blocked, so the DOI is UNVERIFIED). https://arxiv.org/abs/2405.00253
- **What it does:** Detects code hallucinations (mapping, naming, resource, logic) by execution, using a benchmark of 8,883 samples.
- **Relation to us:** Execution-based detection of hallucination. We add domain ground truth and repair.

**39. Spracklen et al. 2025, Package Hallucinations — V-arXiv**
Joseph Spracklen, Raveen Wijewickrama, A H M Nazmus Sakib, Anindya Maiti, Bimal Viswanath, Murtuza Jadliwala. "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs." USENIX Security 2025. https://arxiv.org/abs/2406.10279
- **What it does:** Generates 576k samples from 16 LLMs. Hallucinated packages appear in at least 5.2% of samples from commercial models and 21.7% from open-source models.
- **Relation to us:** Hallucinated parametric facts persist at scale, and the rate depends on the model.

**40. Jain et al. 2024, Code LLM Hallucinations and API Documentation — P**
Nihal Jain, Robert Kwiatkowski, Baishakhi Ray, Murali Krishna Ramanathan, Varun Kumar. "On Mitigating Code LLM Hallucinations with API Documentation." arXiv:2407.09726, 2024. https://arxiv.org/abs/2407.09726
- **What it does:** API hallucination rises for low-frequency APIs (GPT-4o is valid on only 38.58% of them). Retrieving documentation helps those APIs but can hurt high-frequency ones.
- **Relation to us:** Long-tail knowledge (rare mechanisms such as the Peaucellier or Chebyshev lambda linkages) is where the model's knowledge fails. Supplying the fact (the correct value) is what fixes it.

**41. Xu et al. 2024, Knowledge Conflicts for LLMs: A Survey — V**
Rongwu Xu, Zehan Qi, Zhijiang Guo, Cunxiang Wang, Hongru Wang, Yue Zhang, Wei Xu. "Knowledge Conflicts for LLMs: A Survey." EMNLP 2024, pp. 8541–8565. DOI 10.18653/v1/2024.emnlp-main.486. https://aclanthology.org/2024.emnlp-main.486/
- **What it does:** Classifies conflicts as context-memory, inter-context, or intra-memory, and covers how models behave under them.
- **Relation to us:** When the oracle's correct value contradicts the model's parametric belief, that is a context-memory conflict. Our Sonnet vs. Haiku difference concerns which model updates from location alone.

**42. Xiong et al. 2024, Can LLMs Express Their Uncertainty? — V-arXiv**
Miao Xiong, Zhiyuan Hu, Xinyang Lu, Yifei Li, Jie Fu, Junxian He, Bryan Hooi. "Can LLMs Express Their Uncertainty? An Empirical Evaluation of Confidence Elicitation in LLMs." ICLR 2024. https://arxiv.org/abs/2306.13063
- **What it does:** Verbalized confidence is systematically overconfident, especially on professional-knowledge tasks.
- **Relation to us:** Grounds our observation that self-refine agents confidently assert wrong design knowledge.

---

## Does prior work already make our "feedback specificity × model size" point?

**No, not as stated.** These come closest:
- **Pan, Phang, Davidson, Perez (DL4C @ ICLR 2025, #16)** vary model strength per role (generator, feedback, refiner). On MBPP, feedback mainly helps weaker generators. The feedback is LLM-written, so its specificity is uncontrolled, and there is no ground-truth oracle and no gated stop.
- **Olausson et al. (ICLR 2024, #1)** find that feedback quality (from a stronger model or a human) is the bottleneck. They vary the feedback *source*, not a specificity ladder, and do not cross it with repairer size.
- **ConvCodeWorld (ICLR 2025, #10)** finds that weak models with rich feedback beat strong models without feedback. It varies coverage and expertise, not where-vs-value.
- **FeedbackEval (#11)** compares categorical feedback types across five LLMs, without a controlled ladder from one oracle.
- **Fan et al. (ICSE 2023, #22)** show that location information matters, but test only location.

No paper found compares a **controlled ladder of the same deterministic oracle's feedback** (correct value + location > location only > check name + magnitude) against **VLM review and self-refine**, with an **oracle-gated stop**, and reports that **the smaller model needs the correct value while the larger needs only the location**. The pieces exist separately. The combination, and the domain (LLM-written 3D kinematic simulators with analytic ground truth), appear new.

---

## BibTeX (entries marked V or V-arXiv; preprints as @misc)

```bibtex
@inproceedings{olausson2024selfrepair,
  author    = {Olausson, Theo X. and Inala, Jeevana Priya and Wang, Chenglong and Gao, Jianfeng and Solar-Lezama, Armando},
  title     = {Is Self-Repair a Silver Bullet for Code Generation?},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2306.09896}
}
@inproceedings{shinn2023reflexion,
  author    = {Shinn, Noah and Cassano, Federico and Gopinath, Ashwin and Narasimhan, Karthik and Yao, Shunyu},
  title     = {Reflexion: Language Agents with Verbal Reinforcement Learning},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS)},
  year      = {2023},
  url       = {https://proceedings.neurips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html}
}
@inproceedings{madaan2023selfrefine,
  author    = {Madaan, Aman and Tandon, Niket and Gupta, Prakhar and Hallinan, Skyler and Gao, Luyu and Wiegreffe, Sarah and Alon, Uri and Dziri, Nouha and Prabhumoye, Shrimai and Yang, Yiming and Gupta, Shashank and Majumder, Bodhisattwa Prasad and Hermann, Katherine and Welleck, Sean and Yazdanbakhsh, Amir and Clark, Peter},
  title     = {Self-Refine: Iterative Refinement with Self-Feedback},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS)},
  year      = {2023},
  url       = {https://proceedings.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract-Conference.html}
}
@inproceedings{huang2024cannot,
  author    = {Huang, Jie and Chen, Xinyun and Mishra, Swaroop and Zheng, Huaixiu Steven and Yu, Adams Wei and Song, Xinying and Zhou, Denny},
  title     = {Large Language Models Cannot Self-Correct Reasoning Yet},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2310.01798}
}
@article{kamoi2024selfcorrection,
  author  = {Kamoi, Ryo and Zhang, Yusen and Zhang, Nan and Han, Jiawei and Zhang, Rui},
  title   = {When Can {LLMs} Actually Correct Their Own Mistakes? {A} Critical Survey of Self-Correction of {LLMs}},
  journal = {Transactions of the Association for Computational Linguistics},
  volume  = {12},
  pages   = {1417--1440},
  year    = {2024},
  doi     = {10.1162/tacl_a_00713}
}
@inproceedings{gou2024critic,
  author    = {Gou, Zhibin and Shao, Zhihong and Gong, Yeyun and Shen, Yelong and Yang, Yujiu and Duan, Nan and Chen, Weizhu},
  title     = {{CRITIC}: Large Language Models Can Self-Correct with Tool-Interactive Critiquing},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2305.11738}
}
@inproceedings{chen2023codet,
  author    = {Chen, Bei and Zhang, Fengji and Nguyen, Anh and Zan, Daoguang and Lin, Zeqi and Lou, Jian-Guang and Chen, Weizhu},
  title     = {{CodeT}: Code Generation with Generated Tests},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2023},
  url       = {https://arxiv.org/abs/2207.10397}
}
@inproceedings{ni2023lever,
  author    = {Ni, Ansong and Iyer, Srini and Radev, Dragomir and Stoyanov, Ves and Yih, Wen-tau and Wang, Sida I. and Lin, Xi Victoria},
  title     = {{LEVER}: Learning to Verify Language-to-Code Generation with Execution},
  booktitle = {International Conference on Machine Learning (ICML)},
  year      = {2023},
  url       = {https://arxiv.org/abs/2302.08468}
}
@inproceedings{tsui2026selfcorrectionbench,
  author    = {Tsui, Ken},
  title     = {Self-Correction Bench: Uncovering and Addressing the Self-Correction Blind Spot in Large Language Models},
  booktitle = {Conference on Language Modeling (COLM)},
  year      = {2026},
  url       = {https://arxiv.org/abs/2507.02778}
}
@inproceedings{han2025convcodeworld,
  author    = {Han, Hojae and Hwang, Seung-won and Samdani, Rajhans and He, Yuxiong},
  title     = {{ConvCodeWorld}: Benchmarking Conversational Code Generation in Reproducible Feedback Environments},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2025},
  url       = {https://arxiv.org/abs/2502.19852}
}
@misc{dai2025feedbackeval,
  author = {Dai, Dekun and Liu, MingWei and Li, Anji and Cao, Jialun and Wang, Yanlin and Wang, Chong and Peng, Xin and Zheng, Zibin},
  title  = {{FeedbackEval}: A Benchmark for Evaluating Large Language Models in Feedback-Driven Code Repair Tasks},
  year   = {2025},
  eprint = {2504.06939},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2504.06939}
}
@misc{lalonde2026revisiting,
  author = {Lalonde, Louis and Keddache, Wassim and Perron Touchette, Thomas and Da Silva, Leuson and Khomh, Foutse},
  title  = {Revisiting Feedback-Driven {LLM} Code Repair: A Replication and Exploratory {Java} Extension},
  year   = {2026},
  eprint = {2609.00362},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2609.00362}
}
@inproceedings{zheng2025multiturn,
  author    = {Zheng, Kunhao and Decugis, Juliette and Gehring, Jonas and Cohen, Taco and Negrevergne, Benjamin and Synnaeve, Gabriel},
  title     = {What Makes Large Language Models Reason in (Multi-Turn) Code Generation?},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2025},
  url       = {https://arxiv.org/abs/2410.08105}
}
@inproceedings{wang2024mint,
  author    = {Wang, Xingyao and Wang, Zihan and Liu, Jiateng and Chen, Yangyi and Yuan, Lifan and Peng, Hao and Ji, Heng},
  title     = {{MINT}: Evaluating {LLMs} in Multi-turn Interaction with Tools and Language Feedback},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2309.10691}
}
@inproceedings{pan2025benchmarkstalk,
  author    = {Pan, Jane and Shar, Ryan and Pfau, Jacob and Talwalkar, Ameet and He, He and Chen, Valerie},
  title     = {When Benchmarks Talk: Re-Evaluating Code {LLMs} with Interactive Feedback},
  booktitle = {Findings of the Association for Computational Linguistics: ACL 2025},
  pages     = {24672--24700},
  year      = {2025},
  doi       = {10.18653/v1/2025.findings-acl.1267}
}
@inproceedings{pan2025gfr,
  author    = {Pan, Xiang and Phang, Jason and Davidson, Guy and Perez, Ethan},
  title     = {Generate-Feedback-Refine: How Much Does Model Quality in Each Role Matter?},
  booktitle = {3rd Workshop on Deep Learning for Code (DL4C) at ICLR},
  year      = {2025},
  url       = {https://www.iclr.cc/virtual/2025/34833}
}
@inproceedings{zhang2023selfedit,
  author    = {Zhang, Kechi and Li, Zhuo and Li, Jia and Li, Ge and Jin, Zhi},
  title     = {Self-Edit: Fault-Aware Code Editor for Code Generation},
  booktitle = {Proceedings of the 61st Annual Meeting of the Association for Computational Linguistics (ACL)},
  year      = {2023},
  url       = {https://arxiv.org/abs/2305.04087}
}
@inproceedings{zhong2024ldb,
  author    = {Zhong, Li and Wang, Zilong and Shang, Jingbo},
  title     = {Debug like a Human: A Large Language Model Debugger via Verifying Runtime Execution Step by Step},
  booktitle = {Findings of the Association for Computational Linguistics: ACL 2024},
  pages     = {851--870},
  year      = {2024},
  doi       = {10.18653/v1/2024.findings-acl.49}
}
@misc{he2025pgs,
  author = {He, Lehan and Chen, Zeren and Zhang, Zhe and Gao, Xiang and Sheng, Lu},
  title  = {Effective {LLM} Code Refinement via Property-Oriented and Structurally Minimal Feedback},
  year   = {2025},
  eprint = {2506.18315},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2506.18315}
}
@misc{sepidband2026flcontext,
  author = {Sepidband, Melika and Pham, Hung Viet and Hemmati, Hadi},
  title  = {On the Role of Fault Localization Context for {LLM}-Based Program Repair},
  year   = {2026},
  eprint = {2604.05481},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2604.05481}
}
@inproceedings{xia2024chatrepair,
  author    = {Xia, Chunqiu Steven and Zhang, Lingming},
  title     = {Automated Program Repair via Conversation: Fixing 162 out of 337 Bugs for \$0.42 Each using {ChatGPT}},
  booktitle = {Proceedings of the 33rd ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)},
  year      = {2024},
  doi       = {10.1145/3650212.3680323}
}
@inproceedings{fan2023repairllm,
  author    = {Fan, Zhiyu and Gao, Xiang and Mirchev, Martin and Roychoudhury, Abhik and Tan, Shin Hwei},
  title     = {Automated Repair of Programs from Large Language Models},
  booktitle = {Proceedings of the 45th IEEE/ACM International Conference on Software Engineering (ICSE)},
  pages     = {1469--1481},
  year      = {2023},
  doi       = {10.1109/ICSE48619.2023.00128}
}
@inproceedings{xia2023practicalapr,
  author    = {Xia, Chunqiu Steven and Wei, Yuxiang and Zhang, Lingming},
  title     = {Automated Program Repair in the Era of Large Pre-trained Language Models},
  booktitle = {Proceedings of the 45th IEEE/ACM International Conference on Software Engineering (ICSE)},
  year      = {2023},
  doi       = {10.1109/ICSE48619.2023.00129}
}
@inproceedings{xia2022alpharepair,
  author    = {Xia, Chunqiu Steven and Zhang, Lingming},
  title     = {Less Training, More Repairing Please: Revisiting Automated Program Repair via Zero-shot Learning},
  booktitle = {Proceedings of the 30th ACM Joint European Software Engineering Conference and Symposium on the Foundations of Software Engineering (ESEC/FSE)},
  year      = {2022},
  doi       = {10.1145/3540250.3549101}
}
@inproceedings{zhang2024autocoderover,
  author    = {Zhang, Yuntong and Ruan, Haifeng and Fan, Zhiyu and Roychoudhury, Abhik},
  title     = {{AutoCodeRover}: Autonomous Program Improvement},
  booktitle = {Proceedings of the 33rd ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)},
  year      = {2024},
  doi       = {10.1145/3650212.3680384}
}
@inproceedings{yang2024sweagent,
  author    = {Yang, John and Jimenez, Carlos E. and Wettig, Alexander and Lieret, Kilian and Yao, Shunyu and Narasimhan, Karthik and Press, Ofir},
  title     = {{SWE-agent}: Agent-Computer Interfaces Enable Automated Software Engineering},
  booktitle = {Advances in Neural Information Processing Systems 37 (NeurIPS)},
  year      = {2024},
  url       = {https://papers.neurips.cc/paper_files/paper/2024/hash/5a7c947568c1b1328ccc5230172e1e7c-Abstract-Conference.html}
}
@article{xia2025agentless,
  author  = {Xia, Chunqiu Steven and Deng, Yinlin and Dunn, Soren and Zhang, Lingming},
  title   = {Demystifying {LLM}-based Software Engineering Agents},
  journal = {Proceedings of the ACM on Software Engineering (FSE)},
  year    = {2025},
  doi     = {10.1145/3715754}
}
@inproceedings{bouzenia2025repairagent,
  author    = {Bouzenia, Islem and Devanbu, Premkumar and Pradel, Michael},
  title     = {{RepairAgent}: An Autonomous, {LLM}-Based Agent for Program Repair},
  booktitle = {Proceedings of the 47th IEEE/ACM International Conference on Software Engineering (ICSE)},
  year      = {2025},
  url       = {https://arxiv.org/abs/2403.17134}
}
@article{zhang2026aprslr,
  author  = {Zhang, Quanjun and Fang, Chunrong and Xie, Yang and Ma, YuXiang and Sun, Weisong and Yang, Yun and Chen, Zhenyu},
  title   = {A Systematic Literature Review on Large Language Models for Automated Program Repair},
  journal = {ACM Transactions on Software Engineering and Methodology},
  year    = {2026},
  note    = {Accepted; arXiv:2405.01466},
  url     = {https://arxiv.org/abs/2405.01466}
}
@inproceedings{zheng2023judging,
  author    = {Zheng, Lianmin and Chiang, Wei-Lin and Sheng, Ying and Zhuang, Siyuan and Wu, Zhanghao and others},
  title     = {Judging {LLM}-as-a-Judge with {MT-Bench} and {Chatbot Arena}},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS), Datasets and Benchmarks Track},
  year      = {2023},
  url       = {https://arxiv.org/abs/2306.05685}
}
@inproceedings{wang2024notfair,
  author    = {Wang, Peiyi and Li, Lei and Chen, Liang and Cai, Zefan and Zhu, Dawei and Lin, Binghuai and Cao, Yunbo and Kong, Lingpeng and Liu, Qi and Liu, Tianyu and Sui, Zhifang},
  title     = {Large Language Models are not Fair Evaluators},
  booktitle = {Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)},
  pages     = {9440--9450},
  year      = {2024},
  doi       = {10.18653/v1/2024.acl-long.511}
}
@inproceedings{chen2024mllmjudge,
  author    = {Chen, Dongping and Chen, Ruoxi and Zhang, Shilin and Liu, Yinuo and Wang, Yaochen and Zhou, Huichi and Zhang, Qihui and Wan, Yao and Zhou, Pan and Sun, Lichao},
  title     = {{MLLM}-as-a-Judge: Assessing Multimodal {LLM}-as-a-Judge with Vision-Language Benchmark},
  booktitle = {International Conference on Machine Learning (ICML)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2402.04788}
}
@inproceedings{rahmanzadehgervi2024blind,
  author    = {Rahmanzadehgervi, Pooyan and Bolton, Logan and Taesiri, Mohammad Reza and Nguyen, Anh Totti},
  title     = {Vision Language Models are Blind},
  booktitle = {Asian Conference on Computer Vision (ACCV)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2407.06581}
}
@article{wang2025llmjudgese,
  author  = {Wang, Ruiqi and Guo, Jiyu and Gao, Cuiyun and Fan, Guodong and Chong, Chun Yong and Xia, Xin},
  title   = {Can {LLMs} Replace Human Evaluators? {An} Empirical Study of {LLM}-as-a-Judge in Software Engineering},
  journal = {Proceedings of the ACM on Software Engineering (ISSTA)},
  year    = {2025},
  doi     = {10.1145/3728963}
}
@article{crupi2025llmjudgecode,
  author  = {Crupi, Giuseppe and Tufano, Rosalia and Velasco, Alejandro and Mastropaolo, Antonio and Poshyvanyk, Denys and Bavota, Gabriele},
  title   = {On the Effectiveness of {LLM}-as-a-judge for Code Generation and Summarization},
  journal = {IEEE Transactions on Software Engineering},
  year    = {2025},
  url     = {https://arxiv.org/abs/2507.16587}
}
@article{liu2026codehallucination,
  author  = {Liu, Fang and Liu, Yang and Shi, Lin and Yang, Zhen and Zhang, Li and Lian, Xiaoli and Li, Zhongqi and Ma, Yuchi},
  title   = {Beyond Functional Correctness: Exploring Hallucinations in {LLM}-Generated Code},
  journal = {IEEE Transactions on Software Engineering},
  note    = {Accepted; arXiv:2404.00971},
  url     = {https://arxiv.org/abs/2404.00971}
}
@inproceedings{zhang2025hallucpractical,
  author    = {Zhang, Ziyao and Wang, Yanlin and Wang, Chong and Chen, Jiachi and Zheng, Zibin},
  title     = {{LLM} Hallucinations in Practical Code Generation: Phenomena, Mechanism, and Mitigation},
  booktitle = {ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)},
  year      = {2025},
  url       = {https://arxiv.org/abs/2409.20550}
}
@inproceedings{tian2025codehalu,
  author    = {Tian, Yuchen and Yan, Weixiang and Yang, Qian and Zhao, Xuandong and Chen, Qian and Wang, Wen and Luo, Ziyang and Ma, Lei and Song, Dawn},
  title     = {{CodeHalu}: Investigating Code Hallucinations in {LLMs} via Execution-based Verification},
  booktitle = {Proceedings of the AAAI Conference on Artificial Intelligence},
  year      = {2025},
  url       = {https://arxiv.org/abs/2405.00253}
}
@inproceedings{spracklen2025package,
  author    = {Spracklen, Joseph and Wijewickrama, Raveen and Sakib, A H M Nazmus and Maiti, Anindya and Viswanath, Bimal and Jadliwala, Murtuza},
  title     = {We Have a Package for You! {A} Comprehensive Analysis of Package Hallucinations by Code Generating {LLMs}},
  booktitle = {USENIX Security Symposium},
  year      = {2025},
  url       = {https://arxiv.org/abs/2406.10279}
}
@misc{jain2024apihallucination,
  author = {Jain, Nihal and Kwiatkowski, Robert and Ray, Baishakhi and Ramanathan, Murali Krishna and Kumar, Varun},
  title  = {On Mitigating Code {LLM} Hallucinations with {API} Documentation},
  year   = {2024},
  eprint = {2407.09726},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2407.09726}
}
@inproceedings{xu2024knowledgeconflicts,
  author    = {Xu, Rongwu and Qi, Zehan and Guo, Zhijiang and Wang, Cunxiang and Wang, Hongru and Zhang, Yue and Xu, Wei},
  title     = {Knowledge Conflicts for {LLMs}: A Survey},
  booktitle = {Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing (EMNLP)},
  pages     = {8541--8565},
  year      = {2024},
  doi       = {10.18653/v1/2024.emnlp-main.486}
}
@inproceedings{xiong2024uncertainty,
  author    = {Xiong, Miao and Hu, Zhiyuan and Lu, Xinyang and Li, Yifei and Fu, Jie and He, Junxian and Hooi, Bryan},
  title     = {Can {LLMs} Express Their Uncertainty? {An} Empirical Evaluation of Confidence Elicitation in {LLMs}},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  url       = {https://arxiv.org/abs/2306.13063}
}
```

---

## Search queries run (2026-11-13)

Web searches:
1. Reflexion Language Agents with Verbal Reinforcement Learning NeurIPS 2023 proceedings
2. Self-Refine Iterative Refinement with Self-Feedback NeurIPS 2023 proceedings.neurips.cc
3. CodeT Code Generation with Generated Tests ICLR 2023 openreview
4. Fan Gao Mirchev Roychoudhury Tan "Automated Repair of Programs from Large Language Models" ICSE 2023
5. "Less Training, More Repairing Please" AlphaRepair ESEC/FSE 2022 doi
6. SWE-agent Agent-Computer Interfaces NeurIPS 2024 proceedings
7. RepairAgent Bouzenia Devanbu Pradel ICSE 2025 doi
8. Agentless Demystifying LLM-based Software Engineering Agents FSE 2025 doi 10.1145
9. "A Systematic Literature Review on Large Language Models for Automated Program Repair" Zhang TOSEM
10. AutoCodeRover Autonomous Program Improvement ISSTA 2024 doi
11. feedback granularity LLM program repair empirical study test failure message vs fault location information repair success
12. LLM code repair feedback specificity "expected output" vs error location model size smaller models benefit more from detailed feedback
13. aclanthology "Debug like a Human" LDB Findings ACL 2024
14. "Can LLMs Replace Human Evaluators? An Empirical Study of LLM-as-a-Judge in Software Engineering" ISSTA 2025
15. aclanthology "Large Language Models are not Fair Evaluators" ACL 2024 long
16. Crupi "On the Effectiveness of LLM-as-a-judge for Code Generation and Summarization" IEEE TSE
17. "Vision language models are blind" ACCV 2024 proceedings
18. "Knowledge Conflicts for LLMs: A Survey" EMNLP 2024 aclanthology
19. CodeHalu code hallucinations execution-based verification AAAI 2025
20. LLM self-correction overconfident cannot identify own errors code self-verification fails; feedback from smaller vs larger model repair study 2025
21. (extended) weaker model needs more specific feedback stronger model benefits from less feedback code refinement model scale interaction study

Pages opened for verification: the arXiv abstract pages for each arXiv ID above; proceedings.neurips.cc (Reflexion, Self-Refine, SWE-agent); iclr.cc (CodeT poster, Generate-Feedback-Refine workshop poster); aclanthology.org (LDB, not-fair-evaluators, knowledge conflicts, When Benchmarks Talk); conf.researchr.org (RepairAgent ICSE 2025, Agentless FSE 2025, LLM-judge ISSTA 2025); 2024.issta.org (AutoCodeRover); buaa.globalimpact.cn (Fan et al. ICSE 2023); neurips.cc/virtual/2026/179502 (WiML poster; not used). These were blocked: dblp.org (bot check), ojs.aaai.org (bot check), openaccess.thecvf.com (403), and dl.acm.org (redirect, not fetched).
