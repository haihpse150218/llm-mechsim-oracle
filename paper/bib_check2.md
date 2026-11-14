# Bibliography check, second pass (2026-11-14)

Scope: the 50 keys cited in `draft/sections/*.tex`, minus the 14 already fixed in `bib_check.md`
(chen2023selfdebug, chen2025interactscience, gandarela2025msynth, gandarela2026linkage, gerstmayr2026meceng,
liu2026codehallucination, lopez2026sga, lu2026worldcoder, shende2026perceptual, vikram2023pbt, wang2026simuscene,
xie2026physcodebench, jansen_strandbeest, wiki_lambda) and minus the 4 handled by another agent
(olausson2024selfrepair, han2025convcodeworld, pan2025benchmarkstalk, pan2025gfr). **33 keys checked.**
The .bib files were NOT edited.

Sources: Crossref REST API (`/works/{doi}` for every entry with a DOI; `query.bibliographic` for the rest),
arXiv API (author lists, venue comments), PMLR v235 index, CVF open-access page (CVPR 2026), ICLR 2025 virtual site,
Springer book page (LNCS volume), GitHub API (teardown repo). DBLP returned a bot challenge and was not usable.

Style note (sn-mathphys-num): all entries use standard types and fields. Things that matter for rendering:
`and others` prints "et al." but Springer asks for the real author list, so it is replaced below; Springer journal
articles with no page range should carry the article number (put in `pages`), otherwise the reference shows only
volume(issue). `@misc{teardown}` has author, title, year, url, note, so it renders sensibly.

## Results

| key | status | problem |
|---|---|---|
| alrashedy2025cad | FIX | Author list truncated ("Alrashedy, K. and Tambwekar, P. and others"); 6 authors on arXiv 2410.05340. ICLR 2025 confirmed (iclr.cc/virtual/2025/poster/30576). No DOI exists (ICLR). |
| balci1997vva | OK | Crossref matches (WSC '97, pp. 135-141, DOI). |
| barr2015oracle | OK | Crossref matches all fields. |
| chen2018metamorphic | OK | Crossref matches (CSUR 51(1):1-27, DOI). |
| chen2024mllmjudge | FIX | Missing PMLR volume/pages (PMLR 235:6562-6595); author order wrong: PMLR lists Yaochen Wang before Yinuo Liu (arXiv has the reverse; use the proceedings order). URL points to arXiv. No DOI (PMLR). |
| crupi2025llmjudgecode | FIX | Published: IEEE TSE 51(8):2329-2345, 2025, DOI 10.1109/TSE.2025.3586082; entry has only arXiv URL, no volume/pages/DOI. |
| dinella2022toga | OK | Crossref matches (ICSE 2022, pp. 2130-2141, DOI). |
| donaldson2017shader | FIX | Missing DOI 10.1145/3133917 (Crossref: PACMPL 1(OOPSLA), article 93, pp. 1-29). |
| fan2023repairllm | OK | Crossref matches (ICSE 2023, pp. 1469-1481, DOI). |
| gao2026lam | FIX | Author list truncated ("Gao, Y. and others"); CVF open access: Yipeng Gao, Yunhao Ge, Peilin Cai, Daniel Seita, Laurent Itti; pp. 16010-16020. No IEEE DOI found in Crossref yet (re-check before final proofs). |
| hermawan2026log | FIX (minor) | Authors/title/vol/issue match Crossref; add article number 33 (no page range exists). |
| hossain2023neural | OK | Crossref matches (ESEC/FSE 2023, pp. 120-132, DOI). |
| huang2024cannot | OK | ICLR 2024 confirmed (arXiv comment); 7 authors match. No DOI exists. Optional: replace the arXiv URL with the OpenReview/ICLR proceedings URL. |
| kamoi2024selfcorrection | OK | Crossref matches (TACL 12:1417-1440, DOI). |
| kanewala2014scientific | OK | Crossref matches (IST 56(10):1219-1232, DOI). |
| kleijnen1995vv | OK | Crossref matches (EJOR 82(1):145-162, DOI). |
| le2025articulate | FIX | Author list truncated ("Le, L. and others"); 10 authors on arXiv 2410.13882; ICLR 2025 confirmed (arXiv comment). No DOI. |
| liu2023evalplus | OK | Crossref matches (NeurIPS 36, pp. 21558-21572, DOI 10.52202/075280-0943). |
| madaan2023selfrefine | FIX | Missing DOI 10.52202/075280-2019 and pages 46534-46594 (Crossref, NeurIPS 36 proceedings). Authors match (16). |
| molina2025oracle | OK | Crossref matches (TOSEM 34(5):1-24, DOI). |
| rahmanzadehgervi2024blind | FIX | ACCV 2024 paper is published in Springer LNCS 15476 (Computer Vision - ACCV 2024, Part V), pp. 293-309, DOI 10.1007/978-981-96-0917-8_17; entry has only arXiv URL. |
| sargent2013vv | OK | Crossref matches (J. Simulation 7(1):12-24, DOI). |
| schieferdecker2026ai4se | FIX (minor) | Matches Crossref; add article number 29. |
| segura2016survey | OK | Crossref matches (TSE 42(9):805-824, DOI). Accent in "Ruiz-Cort{\'e}s" is correct (Crossref drops it). |
| shinn2023reflexion | FIX | Missing DOI 10.52202/075280-0377 and pages 8634-8652 (Crossref, NeurIPS 36). Authors match. |
| taesiri2024glitchbench | OK | Crossref matches (CVPR 2024, pp. 22444-22455, DOI). |
| teardown | OK | GitHub repo exists (elvarofficial/teardown, created 2026-10-30, MIT licence); @misc has author/title/year/url, renders fine. No DOI. |
| tian2025codehalu | FIX | Missing volume/issue/pages/DOI: Proc. AAAI 39(24):25300-25308, DOI 10.1609/aaai.v39i24.34717. Authors match (9). |
| waldvogel2026blockdiagram | FIX (minor) | Matches Crossref; add article number 19. |
| wang2024notfair | OK | Crossref matches (ACL 2024 long, pp. 9440-9450, DOI). |
| xia2024chatrepair | FIX (minor) | Missing pages 819-831 (Crossref). DOI correct. |
| zheng2023judging | FIX | Author list truncated ("and others"; 13 authors); missing DOI 10.52202/075280-2020 and pages 46595-46623 (Crossref, NeurIPS 36, Datasets and Benchmarks Track per arXiv comment). |
| zhou2019driverless | OK | Crossref matches (CACM 62(3):61-67, DOI). |

Counts: 33 checked; 17 OK, 16 FIX (4 of them minor: article number or pages only).
No remaining arXiv preprint among these 33 lacks a peer-reviewed version: every one already names its venue, and the
venues were confirmed. Entries without a DOI after the fixes (no DOI exists): alrashedy2025cad, chen2024mllmjudge,
huang2024cannot, le2025articulate (ICLR/PMLR do not mint DOIs), gao2026lam (CVPR 2026 IEEE DOI not yet in Crossref),
teardown (software repository).

## Corrected BibTeX (same keys, ready to paste)

```bibtex
@inproceedings{alrashedy2025cad,
  author    = {Alrashedy, Kamel and Tambwekar, Pradyumna and Zaidi, Zulfiqar and Langwasser, Megan and Xu, Wei and Gombolay, Matthew},
  title     = {Generating {CAD} Code with Vision-Language Models for {3D} Designs},
  booktitle = {The Thirteenth International Conference on Learning Representations ({ICLR})},
  year      = {2025},
  url       = {https://arxiv.org/abs/2410.05340}
}

@inproceedings{chen2024mllmjudge,
  author    = {Chen, Dongping and Chen, Ruoxi and Zhang, Shilin and Wang, Yaochen and Liu, Yinuo and Zhou, Huichi and Zhang, Qihui and Wan, Yao and Zhou, Pan and Sun, Lichao},
  title     = {{MLLM}-as-a-Judge: Assessing Multimodal {LLM}-as-a-Judge with Vision-Language Benchmark},
  booktitle = {Proceedings of the 41st International Conference on Machine Learning},
  series    = {Proceedings of Machine Learning Research},
  volume    = {235},
  pages     = {6562--6595},
  publisher = {PMLR},
  year      = {2024},
  url       = {https://proceedings.mlr.press/v235/}
}

@article{crupi2025llmjudgecode,
  author  = {Crupi, Giuseppe and Tufano, Rosalia and Velasco, Alejandro and Mastropaolo, Antonio and Poshyvanyk, Denys and Bavota, Gabriele},
  title   = {On the Effectiveness of {LLM}-as-a-Judge for Code Generation and Summarization},
  journal = {IEEE Transactions on Software Engineering},
  volume  = {51},
  number  = {8},
  pages   = {2329--2345},
  year    = {2025},
  doi     = {10.1109/TSE.2025.3586082}
}

@article{donaldson2017shader,
  author  = {Donaldson, Alastair F. and Evrard, Hugues and Lascu, Andrei and Thomson, Paul},
  title   = {Automated Testing of Graphics Shader Compilers},
  journal = {Proceedings of the ACM on Programming Languages},
  volume  = {1},
  number  = {OOPSLA},
  pages   = {93:1--93:29},
  year    = {2017},
  doi     = {10.1145/3133917}
}

@inproceedings{gao2026lam,
  author    = {Gao, Yipeng and Ge, Yunhao and Cai, Peilin and Seita, Daniel and Itti, Laurent},
  title     = {{LAM}: Language Articulated Object Modelers},
  booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages     = {16010--16020},
  year      = {2026},
  url       = {https://openaccess.thecvf.com/content/CVPR2026/html/Gao_LAM_Language_Articulated_Object_Modelers_CVPR_2026_paper.html}
}

@article{hermawan2026log,
  author  = {Hermawan, Rahmanu and Bucaioni, Alessio and Enoiu, Eduard and Afzal, Wasif and Saadatmand, Mehrdad and Zaimovic, Nedim and Ibtasham, Md Saleh},
  title   = {Let's Read the Log: Root Cause Analysis of Railway Test Execution Logs with Large Language Models},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, pages = {33}, year = {2026},
  doi     = {10.1007/s11334-026-00657-1}
}

@inproceedings{le2025articulate,
  author    = {Le, Long and Xie, Jason and Liang, William and Wang, Hung-Ju and Yang, Yue and Ma, Yecheng Jason and Vedder, Kyle and Krishna, Arjun and Jayaraman, Dinesh and Eaton, Eric},
  title     = {Articulate-Anything: Automatic Modeling of Articulated Objects via a Vision-Language Foundation Model},
  booktitle = {The Thirteenth International Conference on Learning Representations ({ICLR})},
  year      = {2025},
  url       = {https://arxiv.org/abs/2410.13882}
}

@inproceedings{madaan2023selfrefine,
  author    = {Madaan, Aman and Tandon, Niket and Gupta, Prakhar and Hallinan, Skyler and Gao, Luyu and Wiegreffe, Sarah and Alon, Uri and Dziri, Nouha and Prabhumoye, Shrimai and Yang, Yiming and Gupta, Shashank and Majumder, Bodhisattwa Prasad and Hermann, Katherine and Welleck, Sean and Yazdanbakhsh, Amir and Clark, Peter},
  title     = {Self-Refine: Iterative Refinement with Self-Feedback},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS)},
  pages     = {46534--46594},
  year      = {2023},
  doi       = {10.52202/075280-2019}
}

@inproceedings{rahmanzadehgervi2024blind,
  author    = {Rahmanzadehgervi, Pooyan and Bolton, Logan and Taesiri, Mohammad Reza and Nguyen, Anh Totti},
  title     = {Vision Language Models are Blind},
  booktitle = {Computer Vision -- {ACCV} 2024, Part V},
  editor    = {Cho, Minsu and Laptev, Ivan and Tran, Du and Yao, Angela and Zha, Hongbin},
  series    = {Lecture Notes in Computer Science},
  volume    = {15476},
  pages     = {293--309},
  publisher = {Springer},
  address   = {Singapore},
  year      = {2024},
  doi       = {10.1007/978-981-96-0917-8_17}
}

@article{schieferdecker2026ai4se,
  author  = {Schieferdecker, Ina K.},
  title   = {Augmenting Software Engineering with {AI}. The ai4se Taxonomy and Its Use},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, pages = {29}, year = {2026},
  doi     = {10.1007/s11334-026-00652-6}
}

@inproceedings{shinn2023reflexion,
  author    = {Shinn, Noah and Cassano, Federico and Gopinath, Ashwin and Narasimhan, Karthik and Yao, Shunyu},
  title     = {Reflexion: Language Agents with Verbal Reinforcement Learning},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS)},
  pages     = {8634--8652},
  year      = {2023},
  doi       = {10.52202/075280-0377}
}

@article{tian2025codehalu,
  author  = {Tian, Yuchen and Yan, Weixiang and Yang, Qian and Zhao, Xuandong and Chen, Qian and Wang, Wen and Luo, Ziyang and Ma, Lei and Song, Dawn},
  title   = {{CodeHalu}: Investigating Code Hallucinations in {LLMs} via Execution-based Verification},
  journal = {Proceedings of the AAAI Conference on Artificial Intelligence},
  volume  = {39},
  number  = {24},
  pages   = {25300--25308},
  year    = {2025},
  doi     = {10.1609/aaai.v39i24.34717}
}

@article{waldvogel2026blockdiagram,
  author  = {Waldvogel, Andreas and Koehler, Franz and Annighoefer, Bjoern},
  title   = {Model-based block diagram recognition for model visualization verification -- Extended Version},
  journal = {Innovations in Systems and Software Engineering},
  volume  = {22}, number = {2}, pages = {19}, year = {2026},
  doi     = {10.1007/s11334-026-00633-9}
}

@inproceedings{xia2024chatrepair,
  author    = {Xia, Chunqiu Steven and Zhang, Lingming},
  title     = {Automated Program Repair via Conversation: Fixing 162 out of 337 Bugs for \$0.42 Each using {ChatGPT}},
  booktitle = {Proceedings of the 33rd ACM SIGSOFT International Symposium on Software Testing and Analysis (ISSTA)},
  pages     = {819--831},
  year      = {2024},
  doi       = {10.1145/3650212.3680323}
}

@inproceedings{zheng2023judging,
  author    = {Zheng, Lianmin and Chiang, Wei-Lin and Sheng, Ying and Zhuang, Siyuan and Wu, Zhanghao and Zhuang, Yonghao and Lin, Zi and Li, Zhuohan and Li, Dacheng and Xing, Eric P. and Zhang, Hao and Gonzalez, Joseph E. and Stoica, Ion},
  title     = {Judging {LLM}-as-a-Judge with {MT-Bench} and {Chatbot Arena}},
  booktitle = {Advances in Neural Information Processing Systems 36 (NeurIPS), Datasets and Benchmarks Track},
  pages     = {46595--46623},
  year      = {2023},
  doi       = {10.52202/075280-2020}
}
```

Notes:
- `chen2024mllmjudge`: the PMLR per-paper URL was not captured; the v235 index URL is given. Replace with the paper page (proceedings.mlr.press/v235/chen24*.html) if you want a direct link.
- `rahmanzadehgervi2024blind`: the LNCS chapter title is "Vision Language Models are blind"; the arXiv v-latest title adds a subtitle ("Failing to translate detailed visual features into words"). Cite the LNCS title.
- ISSE article numbers (29, 33, 19) are from Crossref `article-number`; issue 2 is dated December 2026 in print.
