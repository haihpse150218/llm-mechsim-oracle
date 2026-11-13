# Bibliography check (cited entries only), 2026-11-13

Scope: 50 distinct keys cited in `draft/sections/*.tex`. 14 of them were flagged:
arXiv-only (11), TODO in a field (3: `jansen_strandbeest`, `wiki_lambda`, `xie2026physcodebench`), or missing year/author (`jansen_strandbeest`, `wiki_lambda`, `liu2026codehallucination`).
The other 36 cited entries already name a peer-reviewed venue (or a book/standard) and were not re-checked.
The .bib files were NOT edited.

Sources used: arXiv abs pages (Journal-ref / Comments / version history), Crossref REST API, Semantic Scholar API, PMLR, ICLR, NeurIPS virtual site, ACL Anthology, publisher/retailer pages, open-access PDFs. DBLP refused automated queries (bot check), so DBLP was not used.

## Results

| key | current status | finding | source URL | confidence |
|---|---|---|---|---|
| chen2023selfdebug | @misc, arXiv:2304.05128 | Published at **ICLR 2024** (poster). Authors on ICLR page: Xinyun Chen, Maxwell Lin, Nathanael Schärli, Denny Zhou (match). No page numbers (ICLR). OpenReview id KuPixIqPiq. | https://iclr.cc/virtual/2024/poster/18880 ; https://openreview.net/forum?id=KuPixIqPiq ; https://proceedings.iclr.cc/paper_files/paper/2024/file/2460396f2d0d421885997dd1612ac56b-Paper-Conference.pdf | High |
| chen2025interactscience | @misc, arXiv:2510.09724, initials only | Published at **ICML 2026**, PMLR vol. 306, pp. 15585–15613. Full authors: Qiaosheng Chen, Yang Liu, Lei Li, Kai Chen, Qipeng Guo, Gong Cheng, Fei Yuan (match initials). Year 2026. | https://proceedings.mlr.press/v306/chen26cf.html | High |
| gandarela2025msynth | @misc, arXiv:2505.17607 | Still arXiv only (v3, 29 May 2026; no Journal-ref/Comments venue; nothing in Crossref or web search). Title/authors confirmed. | https://arxiv.org/abs/2505.17607 | High (that it is preprint-only as of today) |
| gandarela2026linkage | @misc, arXiv:2604.27962 | Still arXiv only (v1, 30 Apr 2026; S2 lists arXiv only). Title/authors confirmed. | https://arxiv.org/abs/2604.27962 | High |
| gerstmayr2026meceng | @misc, arXiv:2608.14615, initials only | Still arXiv only (v1, 10 Jul 2026). Full authors: Johannes Gerstmayr, Sebastian Weyrer, Tobias Möltner, Peter Manzl, Michael Pieber. Note: arXiv number 2608 vs. submission date 10 Jul 2026 as reported by the fetched page; worth a manual look. | https://arxiv.org/abs/2608.14615 | Medium-high |
| liu2026codehallucination | @article TSE, no year/volume/pages, note "Accepted" | Published: **IEEE TSE 52(3):1037–1055, March 2026, DOI 10.1109/TSE.2026.3657432**. Authors (Crossref): Fang Liu, Yang Liu, Lin Shi, Zhen Yang, Li Zhang, Xiaoli Lian, Zhongqi Li, Yuchi Ma (match). | https://api.crossref.org/works/10.1109/TSE.2026.3657432 ; https://doi.org/10.1109/TSE.2026.3657432 | High |
| lopez2026sga | @misc, arXiv:2607.18116, initials only | Published in **Findings of ACL: EMNLP 2026**, pp. 9533–9549, DOI 10.18653/2026.findings-emnlp.454. Authors: Jhon Lopez, Carlos Hinojosa, Bernard Ghanem. | https://aclanthology.org/2026.findings-emnlp.454/ ; Crossref record of the DOI | High |
| lu2026worldcoder | @misc, arXiv:2606.01869, "and others" | **Accepted to NeurIPS 2026** (arXiv Comments; NeurIPS 2026 virtual poster 139687). Proceedings (volume/pages) not yet available. Full 11 authors: Shuo Lu, Yinuo Xu, Kecheng Yu, Siru Jiang, Yongcan Yu, Yubin Wang, Haitao Yang, Yuxiang Zhang, Bin Wang, Ran He, Jian Liang. | https://arxiv.org/abs/2606.01869 ; https://neurips.cc/virtual/2026/poster/139687 | High (acceptance); no pages yet |
| shende2026perceptual | @misc, arXiv:2602.12311 | Still arXiv only (S2: arXiv only; no Journal-ref). Authors: Prashant Shende, Bradley Camburn. | https://arxiv.org/abs/2602.12311 | High |
| vikram2023pbt | @misc, arXiv:2307.04346 | No peer-reviewed venue found (arXiv v2 22 Jul 2024, no Journal-ref; S2 arXiv only; Crossref nothing). Authors confirmed. Keep as preprint; could add `note = {v2, 2024}`. | https://arxiv.org/abs/2307.04346 | Medium (absence of evidence; venue may exist but not found) |
| wang2026simuscene | @misc, arXiv:2602.10840, initials only | Still arXiv only (v2, 13 Aug 2026; S2 no venue). Current title "Training and Benchmarking Code Generation for Physics-Inspired Animations" (v1 title: "SimuScene: Training and Benchmarking Code Generation to Simulate Physical Scenarios"). Full authors: Yanan Wang, Renxi Wang, Yongxin Wang, Xuezhi Liang, Fajri Koto, Timothy Baldwin, Xiaodan Liang, Haonan Li. | https://arxiv.org/abs/2602.10840 | High |
| xie2026physcodebench | @misc, arXiv:2604.23580, "Xie, T. and others", TODO verify | Verified on arXiv: title matches; v1 26 Apr 2026, v2 11 Sep 2026; no venue. Full 12 authors: Tianyidan Xie, Peiyu Wang, Hu Jiaxin, Yuyi Qian, Yuxuan Wang, Shenyi Wang, Rui Ma, Yanlun Peng, Lanjun Wang, Ying Tai, Jian Yang, Zili Yi. ("Hu Jiaxin" is given in that order on arXiv.) TODO can be removed. | https://arxiv.org/abs/2604.23580 | High |
| jansen_strandbeest | @misc, no year, TODO | Best citable source: Theo Jansen, *The Great Pretender*, 010 Publishers, Rotterdam, 2007, 240 pp., ISBN 978-90-6450-630-7 (2nd expanded ed. 2016, ISBN 978-94-6208-344-8). This exact citation (Jansen T. The great pretender. Rotterdam: 010 Publishers, 2007) is used as ref. 32 by the peer-reviewed Nansai et al. 2015 (Adv. Mech. Eng. 7(3), DOI 10.1177/1687814015573824). **Holy numbers not verified on a book page.** Peer-reviewed papers checked (Nansai et al. 2015, 2016) do not print the 11 values (2015 uses squared joint distances). The numbers appear in a table (Table 1, a–m: 38.0, 41.5, 39.3, 40.1, 55.8, 39.4, 36.7, 65.7, 49.0, 50.0, 61.9, 7.8, 15.0) only in an arXiv preprint (2606.22129), per search snippet. Suggest citing the book, optionally plus https://www.strandbeest.com. | https://www.artbook.com/9789064506307.html ; https://spiral.imperial.ac.uk/handle/10044/1/44742 (Nansai 2015, ref. 32) | High for book data; values unverified |
| wiki_lambda | @misc Wikipedia, no author/year, TODO | Peer-reviewed source with these proportions: Miler, Birt, Hoić, "Multi-Objective Optimization of the Chebyshev Lambda Mechanism", *Strojniški vestnik – J. Mech. Eng.* 68(12):725–734, 2022, DOI 10.5545/sv-jme.2022.349 (open access). On p. 726 (text next to Fig. 1): links L1–L5 default {100, 250, 250, 250, 1000} mm, anchor distance L0 = 200 mm, L1 and L2 anchored, L1 the actuator; i.e. crank 1 : ground 2 : rocker 2.5 : further links 2.5, 2.5. **Partially verified:** which of L3/L4 is the coupler vs. the extension to the tracing point is only shown in Fig. 1 (not readable in text extraction), and their L5 = 1000 mm is an added leg link, so AP = 5 is not stated in the text. Textbooks (Artobolevsky, Norton, Hartenberg & Denavit): proportions not verified on page (no accessible copy). | https://www.sv-jme.eu/article/multi-objective-optimization-of-the-chebyshev-lambda-mechanism/ (PDF fetched via sv-jme.eu, DOI 10.5545/sv-jme.2022.349) | Medium |

Summary: 14 checked; 4 now have a confirmed peer-reviewed venue (chen2023selfdebug ICLR 2024, chen2025interactscience ICML 2026, liu2026codehallucination TSE 2026, lopez2026sga Findings EMNLP 2026) and 1 has confirmed acceptance without proceedings data (lu2026worldcoder, NeurIPS 2026). 7 remain preprint-only (gandarela2025msynth, gandarela2026linkage, gerstmayr2026meceng, shende2026perceptual, vikram2023pbt, wang2026simuscene, xie2026physcodebench), with author lists/titles completed. jansen_strandbeest: book source confirmed, values not verified on page. wiki_lambda: peer-reviewed source found, proportions partially verified.

## Proposed BibTeX replacements

Only entries where something was confirmed from a source page. Same keys.

```bibtex
@inproceedings{chen2023selfdebug,
  author    = {Chen, Xinyun and Lin, Maxwell and Sch{\"a}rli, Nathanael and Zhou, Denny},
  title     = {Teaching Large Language Models to Self-Debug},
  booktitle = {The Twelfth International Conference on Learning Representations ({ICLR})},
  year      = {2024},
  url       = {https://openreview.net/forum?id=KuPixIqPiq}
}

@inproceedings{chen2025interactscience,
  author    = {Chen, Qiaosheng and Liu, Yang and Li, Lei and Chen, Kai and Guo, Qipeng and Cheng, Gong and Yuan, Fei},
  title     = {{InteractScience}: Programmatic and Visually-Grounded Evaluation of Interactive Scientific Demonstration Code Generation},
  booktitle = {Proceedings of the 43rd International Conference on Machine Learning},
  series    = {Proceedings of Machine Learning Research},
  volume    = {306},
  pages     = {15585--15613},
  publisher = {PMLR},
  year      = {2026},
  url       = {https://proceedings.mlr.press/v306/chen26cf.html}
}

@misc{gandarela2025msynth,
  author = {Gandarela, Jo{\~a}o Pedro and Rios, Thiago and Menzel, Stefan and Freitas, Andr{\'e}},
  title  = {Symbolic Intermediaries as a Linguistic-Numerical Interface for {LLM}-Driven Geometric Reasoning},
  year   = {2025},
  note   = {arXiv:2505.17607v3 (2026); v1 titled ``Controlled Agentic Planning \& Reasoning for Mechanism Synthesis''},
  doi    = {10.48550/arXiv.2505.17607},
  url    = {https://arxiv.org/abs/2505.17607}
}

@misc{gandarela2026linkage,
  author = {Gandarela, Jo{\~a}o Pedro and Rios, Thiago and Menzel, Stefan and Freitas, Andr{\'e}},
  title  = {Language Models Refine Mechanical Linkage Designs Through Symbolic Reflection and Modular Optimisation},
  year   = {2026},
  note   = {arXiv:2604.27962},
  doi    = {10.48550/arXiv.2604.27962},
  url    = {https://arxiv.org/abs/2604.27962}
}

@misc{gerstmayr2026meceng,
  author = {Gerstmayr, Johannes and Weyrer, Sebastian and M{\"o}ltner, Tobias and Manzl, Peter and Pieber, Michael},
  title  = {Large Language Models and their Awareness of Mechanics and Spatial Geometry},
  year   = {2026},
  note   = {arXiv:2608.14615},
  doi    = {10.48550/arXiv.2608.14615},
  url    = {https://arxiv.org/abs/2608.14615}
}

@article{liu2026codehallucination,
  author  = {Liu, Fang and Liu, Yang and Shi, Lin and Yang, Zhen and Zhang, Li and Lian, Xiaoli and Li, Zhongqi and Ma, Yuchi},
  title   = {Beyond Functional Correctness: Exploring Hallucinations in {LLM}-Generated Code},
  journal = {IEEE Transactions on Software Engineering},
  volume  = {52},
  number  = {3},
  pages   = {1037--1055},
  year    = {2026},
  doi     = {10.1109/TSE.2026.3657432}
}

@inproceedings{lopez2026sga,
  author    = {Lopez, Jhon and Hinojosa, Carlos and Ghanem, Bernard},
  title     = {{SGA}: Plug \& Play Geometric Verification for Educational Video Synthesis},
  booktitle = {Findings of the Association for Computational Linguistics: EMNLP 2026},
  pages     = {9533--9549},
  publisher = {Association for Computational Linguistics},
  year      = {2026},
  doi       = {10.18653/2026.findings-emnlp.454}
}

@inproceedings{lu2026worldcoder,
  author    = {Lu, Shuo and Xu, Yinuo and Yu, Kecheng and Jiang, Siru and Yu, Yongcan and Wang, Yubin and Yang, Haitao and Zhang, Yuxiang and Wang, Bin and He, Ran and Liang, Jian},
  title     = {{WorldCoder-Bench}: Benchmarking Physically Grounded {3D} World Synthesis},
  booktitle = {Advances in Neural Information Processing Systems ({NeurIPS})},
  year      = {2026},
  note      = {To appear; arXiv:2606.01869},
  url       = {https://arxiv.org/abs/2606.01869}
}

@misc{shende2026perceptual,
  author = {Shende, Prashant and Camburn, Bradley},
  title  = {Perceptual Self-Reflection in Agentic Physics Simulation Code Generation},
  year   = {2026},
  note   = {arXiv:2602.12311},
  doi    = {10.48550/arXiv.2602.12311},
  url    = {https://arxiv.org/abs/2602.12311}
}

@misc{vikram2023pbt,
  author        = {Vikram, Vasudev and Lemieux, Caroline and Sunshine, Joshua and Padhye, Rohan},
  title         = {Can Large Language Models Write Good Property-Based Tests?},
  year          = {2023},
  eprint        = {2307.04346},
  archivePrefix = {arXiv},
  primaryClass  = {cs.SE},
  doi           = {10.48550/arXiv.2307.04346}
}

@misc{wang2026simuscene,
  author = {Wang, Yanan and Wang, Renxi and Wang, Yongxin and Liang, Xuezhi and Koto, Fajri and Baldwin, Timothy and Liang, Xiaodan and Li, Haonan},
  title  = {Training and Benchmarking Code Generation for Physics-Inspired Animations},
  year   = {2026},
  note   = {arXiv:2602.10840; v1 titled ``SimuScene: Training and Benchmarking Code Generation to Simulate Physical Scenarios''},
  doi    = {10.48550/arXiv.2602.10840},
  url    = {https://arxiv.org/abs/2602.10840}
}

@misc{xie2026physcodebench,
  author = {Xie, Tianyidan and Wang, Peiyu and Jiaxin, Hu and Qian, Yuyi and Wang, Yuxuan and Wang, Shenyi and Ma, Rui and Peng, Yanlun and Wang, Lanjun and Tai, Ying and Yang, Jian and Yi, Zili},
  title  = {{PhysCodeBench}: Benchmarking Physics-Aware Symbolic Simulation of {3D} Scenes via Self-Corrective Multi-Agent Refinement},
  year   = {2026},
  note   = {arXiv:2604.23580},
  doi    = {10.48550/arXiv.2604.23580},
  url    = {https://arxiv.org/abs/2604.23580}
}

@book{jansen_strandbeest,
  author    = {Jansen, Theo},
  title     = {The Great Pretender},
  publisher = {010 Publishers},
  address   = {Rotterdam},
  year      = {2007},
  isbn      = {978-90-6450-630-7},
  note      = {See also \url{https://www.strandbeest.com}}
}

@article{wiki_lambda,
  author  = {Miler, Daniel and Birt, Dominik and Hoi{\'c}, Matija},
  title   = {Multi-Objective Optimization of the {Chebyshev} Lambda Mechanism},
  journal = {Strojni{\v{s}}ki vestnik -- Journal of Mechanical Engineering},
  volume  = {68},
  number  = {12},
  pages   = {725--734},
  year    = {2022},
  doi     = {10.5545/sv-jme.2022.349}
}
```

Notes on the replacements:
- `wiki_lambda`: the third author's surname was extracted from the PDF as "Hoi" with a dropped diacritic; "Hoić" is my reading, please confirm on the article page. The paper supports crank 1 : ground 2 : rocker 2.5 and two further 2.5 links (p. 726); it does not state AP = 5 in the text. If an exact textbook statement is required, check a library copy of Artobolevsky or Hartenberg & Denavit (not verified here). Alternatively keep the Wikipedia entry as a second citation with `author = {{Wikipedia contributors}}` and `year = {2026}`.
- `jansen_strandbeest`: the eleven values are not verified on a book page; the book is the primary source cited for them in the literature (e.g., Nansai et al. 2015 ref. 32).
- `xie2026physcodebench`: arXiv gives the third author as "Hu Jiaxin" (family name likely Hu); I kept the arXiv order as `Jiaxin, Hu`; switch to `Hu, Jiaxin` if you confirm.
- `chen2023selfdebug`: key keeps "2023", but year is now 2024.
