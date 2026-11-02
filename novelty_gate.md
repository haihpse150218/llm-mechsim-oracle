# Novelty gate — "Automated oracles for LLM-generated mechanical simulators"

## Tiến độ (checkpoint) — HOÀN TẤT (2026-11-02)
- Đã xong: đọc 01_profile.md + 08_plan.md (house style); kiểm SKILL.md teardown cục bộ; 27 nhóm truy vấn (danh sách đầy đủ ở mục 7); viết đủ mục 1–7.
- Công trình đã xác minh qua trang gốc (abs/HTML): MSynth 2505.17607; 2604.27962; WorldCoder-Bench 2606.01869 (cả Bảng 2); InteractScience 2510.09724; SGA 2607.18116; Perceptual self-reflection 2602.12311; SimuScene 2602.10840; VisPhyWorld 2602.13294; MecEng 2608.14615; PAT3D 2511.21978; teardown GitHub. Qua kết quả tìm kiếm/tóm tắt (chưa đọc gốc đầy đủ): LAM (CVPR 2026), PhysCodeBench, Articulate-Anything, CADPrompt, Real2Code, URDFormer, Infinigen-Sim, Donaldson OOPSLA 2017, Self-Debug, TRAVL, PhyDetEx, GIQ.
- Còn treo (cho cổng sau, không chặn verdict): tìm DBLP/Scopus venue SE (ICSE/FSE/ISSTA/ASE/ICST/MET/ISSE); đọc toàn văn WorldCoder, InteractScience, LAM; nguồn gốc các benchmark CAD.

- Ngày chạy: 2026-11-02
- Tác giả mục tiêu: Hải (học viên MSE AI/software, bài đầu tay). Tạp chí mục tiêu: Innovations in Systems and Software Engineering (ISSE, Springer, Q3).
- Phạm vi kiểm: WebSearch + WebFetch (arXiv abstract/HTML, trang hội nghị, GitHub). Chủ yếu đọc **abstract và một số đoạn HTML**, chưa đọc toàn văn bài nào từ đầu đến cuối. Chỗ nào chỉ thấy qua bản tóm tắt thứ cấp thì ghi "chưa xác minh".
- Đã kiểm cục bộ: `C:\Users\Admin\.claude\skills\teardown\SKILL.md` xác nhận hợp đồng `render(t)` là pure (không `Math.random`, không `Date`, không mang state giữa các frame, "Capture calls it at arbitrary times") và vòng review là đọc sheet ảnh tĩnh ("You cannot watch the video; you can look at frames"). Repo gốc: https://github.com/elvarofficial/teardown (MIT).

---

## 1. Verdict: **GO có điều kiện**

Không tìm thấy công trình nào làm đúng tổ hợp: (a) simulator **giải thích** của các cơ cấu đã biết (không phải bài toán synthesis), (b) oracle tự động khai thác tính **pure của render(t)** (metamorphic: determinism, order-independence, periodicity) cộng oracle **giải tích** (loop-closure, vị trí piston, tỉ số truyền), (c) đo đối đầu oracle với VLM screenshot review, (d) repair loop bằng kết quả oracle. Nhưng ý tưởng **bị scoop một phần ở cấp phương pháp**: WorldCoder-Bench (arXiv 2606.01869, 6/2026) đã làm "oracle trạng thái runtime cho chương trình Three.js do LLM sinh" và đã cho thấy screenshot-VLM judge không tương quan với correctness ở mức state; InteractScience đã kết hợp unit test lập trình + kiểm tra hình ảnh cho demo khoa học tương tác; LAM (CVPR 2026) đã dùng LLM sinh code hình học **Three.js primitives** + VLM checker cho khớp nối; SGA đã so verifier hình học symbolic với VLM critic (Manim). Vì vậy không được bán bài như "lần đầu dùng oracle cho 3D code do LLM sinh". Điều kiện để GO: (1) định vị lại thành **oracle dựa trên ground truth động học giải tích + quan hệ metamorphic theo thời gian** cho miền cơ cấu cơ khí, so trực tiếp với WorldCoder (contract do chuyên gia viết tay từng task) và LAM/Perceptual self-reflection (VLM checker); (2) pilot (mục 6) phải cho thấy LLM thật sự mắc lỗi động học mà render vẫn "trông đúng" với tần suất đủ lớn (ví dụ ≥20% mẫu có ít nhất một lỗi oracle bắt được); nếu gần như không có lỗi thì RQ1–RQ3 sẽ rỗng → NO-GO.

---

## 2. Bảng các công trình gần nhất

Ký hiệu overlap: none / partial / full.

| # | Trích dẫn | Họ làm gì | RQ1 (lỗi LLM, tần suất) | RQ2 (VLM bỏ sót vs oracle) | RQ3 (repair bằng oracle) | Mình khác ở đâu |
|---|---|---|---|---|---|---|
| 1 | Gandarela, Rios, Menzel, Freitas. "Controlled Agentic Planning & Reasoning for Mechanism Synthesis" (v1), v3 đổi tên "Symbolic Intermediaries as a Linguistic-Numerical Interface for LLM-Driven Geometric Reasoning". arXiv 2505.17607, 2025 (v3 29/5/2026), preprint, chưa thấy venue. https://arxiv.org/abs/2505.17607 | Bài toán **synthesis**: LLM viết code Python dùng thư viện `pylinkage` để thiết kế cơ cấu 4 khâu/6 khâu sao cho quỹ đạo khớp với đường cong giải tích (tròn, ellipse, thẳng, parabol, lemniscate, NACA). Benchmark MSynth (6 lớp × 5 mẫu theo HTML v3). Feedback qua symbolic regression + khoảng cách; metric Chamfer sau ICP, tỉ lệ chạy được, số vòng lặp. So với GA. | partial (chỉ có execution success, không có taxonomy lỗi động học của simulator; Jansen không có) | none (chỉ nhìn bằng mắt ở phụ lục, không có VLM) | partial (refinement loop dựa trên số liệu simulator, nhưng mục tiêu là tối ưu thiết kế, không phải sửa lỗi code) | Họ coi simulator (`pylinkage`) là đúng và LLM chỉ chọn tham số; mình kiểm chính **code simulator do LLM viết** cho máy đã biết, có ground truth giải tích, và đặt cạnh VLM review. |
| 2 | Gandarela, Rios, Menzel, Freitas. "Language Models Refine Mechanical Linkage Designs Through Symbolic Reflection and Modular Optimisation". arXiv 2604.27962, 4/2026, preprint. https://arxiv.org/abs/2604.27962 | Cùng nhóm, tiếp nối MSynth: LLM chọn topology, optimizer khớp tham số, "symbolic lifting" biến quỹ đạo thành mô tả định tính; báo cáo "structural validity", chẩn đoán over/under-constraint. | partial | none | partial | Vẫn là synthesis. Cách kiểm loop-closure trong bài: chưa xác minh (abstract không nói). |
| 3 | Gao, Y. et al. (Itti, Seita, USC). "LAM: Language Articulated Object Modelers". CVPR 2026. https://openaccess.thecvf.com/content/CVPR2026/papers/Gao_LAM_Language_Articulated_Object_Modelers_CVPR_2026_paper.pdf ; poster: https://cvpr.thecvf.com/virtual/2026/poster/37926 | Text → URDF vật thể có khớp; hình học bằng **Three.js primitives**; Debugger sửa lỗi cú pháp; Geometry Checker là VLM (GPT-4o) hoặc 3D-VLM trên render đa góc; Articulation Checker là VLM xem chuỗi chuyển động (ví dụ cửa mở sai chiều). LAMBench để fine-tune Qwen3-VL-8B. Metric: joint success, CLIP/BLIP, GPT-5 pass rate. (chi tiết checker lấy từ papernotes, chưa đọc PDF gốc → một phần chưa xác minh) | partial | partial (dùng VLM làm checker, nhưng không đo VLM bỏ sót bao nhiêu) | partial (repair loop bằng **VLM**, không phải oracle giải tích) | Vật thể khớp đơn giản (cửa, ngăn kéo), không có cơ cấu vòng kín, không có ground truth giải tích; chính họ thừa nhận judge GPT-5 có thể thiên lệch. Mình đo đúng điểm yếu đó. |
| 4 | Lu, S., Xu, Y., Yu, K., Jiang, S., Yu, Y., …, Liang, J. "WorldCoder-Bench: Benchmarking Physically Grounded 3D World Synthesis". arXiv 2606.01869, 6/2026; trang poster NeurIPS 2026 xuất hiện trong kết quả tìm kiếm (https://neurips.cc/virtual/2026/poster/139687, chưa mở). https://arxiv.org/abs/2606.01869 | 2.026 task Three.js; chương trình phải lộ **runtime state interface**; StateProbe chạy headless Chromium, chụp state trước/sau hành động, kiểm **hidden behavioral contracts do chuyên gia viết**; contract chỉ được nhận khi bác bỏ được lỗi tiêm. Bảng 2: screenshot+VLM (GPT-5.4) pass 2,7%, Kendall τb −0,068 so với V-Cov; DOM τb −0,021; agent 8 bước để lọt 45,6% output lỗi nặng. Lưu ý: phụ lục C.4 cho số khác (VLM τb +0,143), tức con số phụ thuộc cách gộp. | partial (failure mode: state-schema drift, chuỗi tương tác gãy) | **partial–mạnh** (đã chứng minh screenshot-VLM không tương quan với correctness state; nhưng VLM của họ *quá khắt khe* chứ không phải *bỏ sót*) | none (không thấy repair loop trong phần đã đọc) | Đây là **đe doạ lớn nhất**. Khác biệt cần bảo vệ: (i) miền cơ cấu với ground truth **giải tích** thay vì contract viết tay từng task; (ii) oracle **metamorphic theo thời gian** suy ra từ hợp đồng pure render(t) (không cần chuyên gia viết contract); (iii) đo cụ thể *false negative* của VLM trên lỗi động học tinh vi; (iv) repair loop. |
| 5 | Chen, Q., Liu, Y., Li, L., Chen, K., Guo, Q., Cheng, G., Yuan, F. "InteractScience: Programmatic and Visually-Grounded Evaluation of Interactive Scientific Demonstration Code Generation". arXiv 2510.09724, 10/2025 (v2 5/2026), cs.SE, preprint. https://arxiv.org/abs/2510.09724 | Benchmark demo khoa học tương tác (front-end) ở 5 lĩnh vực; đánh giá lai: unit test lập trình (giả lập thao tác người dùng) + so snapshot tham chiếu bằng VLM với checklist; 30 LLM. | partial (thấy lỗi logic vật lý trong JS, ví dụ mặt phẳng nghiêng) | partial (hai kênh song song; có so trực tiếp VLM vs test không: chưa xác minh) | none | Không chuyên cơ cấu cơ khí 3D, không dùng ground truth giải tích theo thời gian, không có oracle metamorphic, không repair. Rất nên trích như baseline phương pháp đánh giá. |
| 6 | Lopez, J., Hinojosa, C., Ghanem, B. "SGA: Plug&Play Geometric Verification for Educational Video Synthesis". arXiv 2607.18116, 7/2026 (v2 9/2026), preprint. https://arxiv.org/abs/2607.18116 | Chặn code Manim do LLM sinh, chạy một phần để lấy scene graph symbolic, phát hiện xung đột không gian (che khuất), sửa code; metric MVQS không cần render. Người chấm thích SGA hơn VLM critic 65,0%. | partial | partial (so symbolic vs VLM critic, nhưng chỉ bằng preference người, lỗi bố cục 2D chứ không phải động học) | **partial–mạnh** (repair bằng verifier symbolic) | 2D video giáo dục, lỗi layout tĩnh; mình là động học 3D theo thời gian với ground truth giải tích. |
| 7 | Shende, P., Camburn, B. "Perceptual Self-Reflection in Agentic Physics Simulation Code Generation". arXiv 2602.12311, 2/2026, cs.SE, preprint. https://arxiv.org/abs/2602.12311 | Sinh code mô phỏng vật lý từ ngôn ngữ tự nhiên; validator **render frame rồi đưa VLM xem**; tự nêu "oracle gap" (code chạy được nhưng sai vật lý). Đánh giá định tính; ~0,20 USD/animation. | partial | none (không so với oracle lập trình) | partial (repair bằng VLM) | Đây chính là cách teardown đang làm (VLM review). Bài này là "phản đề" tốt: mình đo xem cách đó bỏ sót gì. |
| 8 | Wang, Y., Wang, R., Wang, Y., Liang, X., Koto, F., Baldwin, T., Liang, X., Li, H. "Training and Benchmarking Code Generation for Physics-Inspired Animations" (SimuScene). arXiv 2602.10840, 2/2026 (v2 8/2026), preprint. https://arxiv.org/abs/2602.10840 | 7.659 kịch bản vật lý, test 334 ca người kiểm; LLM viết code ra video; VLM trả lời câu hỏi kiểm chứng để chấm và làm reward RL; model tốt nhất 21,5% Avg@8. | partial (độ chính xác thấp dù chạy được) | none (VLM là thước đo, không bị kiểm) | none (RL, không repair loop theo oracle) | Họ **tin** VLM làm judge; mình kiểm VLM bằng ground truth giải tích. |
| 9 | Gerstmayr, J., Weyrer, S., Möltner, T., Manzl, P., Pieber, M. "Large Language Models and their Awareness of Mechanics and Spatial Geometry" (MecEng). arXiv 2608.14615, 7/2026, preprint. https://arxiv.org/abs/2608.14615 | 84 task: LLM dựng mô hình multibody (Exudyn/Netgen) từ mô tả; so với ground truth chuyên gia về cấu trúc (system graph isomorphism), kết quả số, khối lượng, tần số riêng; 34 LLM. | partial (tỉ lệ thành công 86–91% rigid-body) | none | none | Dùng engine vật lý có sẵn; LLM chỉ dựng model. Mình kiểm code đồ hoạ/động học tự viết tay của LLM (không engine), cho mục đích giải thích. Là bằng chứng ground-truth-based eval khả thi trong cơ khí. |
| 10 | Xie, T. et al. "PhysCodeBench: Benchmarking Physics-Aware Symbolic Simulation of 3D Scenes via Self-Corrective Multi-Agent Refinement". arXiv 2604.23580, 4/2026, preprint. https://arxiv.org/abs/2604.23580 (thấy qua kết quả tìm kiếm + alphaxiv) | Code Genesis engine; chấm 100 điểm gồm executability + CLIP + motion smoothness (VBench); framework multi-agent tự sửa lỗi. Số mẫu không nhất quán (700 vs 995) → chưa xác minh. | partial | none | partial (tự sửa lỗi, nhưng không theo oracle giải tích) | Metric thị giác/thống kê, không có ground truth động học. |
| 11 | Le, L. et al. "Articulate-Anything: Automatic Modeling of Articulated Objects via a Vision-Language Foundation Model". ICLR 2025. https://arxiv.org/abs/2410.13882v3 ; https://proceedings.iclr.cc/paper_files/paper/2025/hash/2c8047bf3ed8ef6905351608d641f02f-Abstract-Conference.html | Actor VLM viết Python → URDF, critic VLM xem render và phản hồi; PartNet-Mobility, success 8,7–11,6% → 75%. | none | partial (VLM-critic là thành phần chính) | partial (repair bằng VLM critic) | Mẫu hình "VLM critic loop" mà mình muốn thách thức. |
| 12 | Alrashedy, K., Tambwekar, P. et al. "Generating CAD Code with Vision-Language Models for 3D Designs" (CADPrompt, CADCodeVerify). ICLR 2025. https://arxiv.org/abs/2410.05340v1 | 200 prompt CAD + code chuyên gia; CADCodeVerify: VLM sinh và trả lời câu hỏi kiểm chứng trên render rồi sửa code; metric point-cloud distance, tỉ lệ sinh thành công. | partial | partial (VLM verify, không đo bỏ sót) | partial (VLM repair) | Vật thể tĩnh, không có thời gian/động học. Cả nhánh text-to-CAD (BenchCAD, CADBench, Text2CAD-Bench — chỉ thấy qua tóm tắt, chưa xác minh) kiểm bằng IoU/Chamfer/executability so với hình học tham chiếu, không có oracle động học. |
| 13 | Donaldson, A.F., Evrard, H., Lascu, A., Thomson, P. "Automated Testing of Graphics Shader Compilers". PACMPL 1(OOPSLA), Art. 93, 2017. https://www.doc.ic.ac.uk/~afd/papers/2017/OOPSLA.pdf | Metamorphic testing cho đồ hoạ: biến đổi shader tương đương ngữ nghĩa, so ảnh render; >60 bug trên 17 cấu hình GPU. | none | none | none | Nền tảng SE cho "oracle problem trong đồ hoạ". Mình áp ý metamorphic vào **code do LLM sinh** với quan hệ theo thời gian. |
| 14 | Chen, X., Lin, M., Schärli, N., Zhou, D. "Teaching Large Language Models to Self-Debug". arXiv 2304.05128, 2023. https://arxiv.org/abs/2304.05128 | LLM tự sửa code bằng feedback thực thi/unit test; +12% trên MBPP/TransCoder. | none | none | partial (cơ chế repair bằng test đã biết là hiệu quả ở code tổng quát) | RQ3 chỉ mới nếu feedback là oracle **miền động học** và so với feedback VLM. |

Các nguồn tham khảo phụ đã thấy (không đưa vào bảng chính): Real2Code (Mandi et al., https://arxiv.org/html/2406.08474v2) và URDFormer (Chen et al., RSS 2024, https://arxiv.org/abs/2405.11656v2) — tái dựng vật thể có khớp từ ảnh, không kiểm code simulator; Infinigen-Sim/Infinigen-Articulated (https://arxiv.org/abs/2505.10755) — sinh asset thủ tục, không phải LLM viết code; PAT3D (Lin et al., https://arxiv.org/abs/2511.21978) — simulation-in-the-loop cho cảnh **tĩnh** (cân bằng, không xuyên nhau); ghi chú: đã xác minh ICLR 2026 qua trang poster https://iclr.cc/virtual/2026/poster/10007978 (2026-11-02). VisPhyWorld (Liang et al., https://arxiv.org/abs/2602.13294) — MLLM viết code tái dựng video vật lý. TRAVL/ImplausiBench (https://www.arxiv.org/abs/2510.07550) và PhyDetEx (https://arxiv.org/abs/2512.01843) — bằng chứng VLM kém trong phát hiện vi phạm vật lý trong video. Metamorphic Prompt Testing (https://arxiv.org/pdf/2406.06864) — metamorphic cho chương trình LLM sinh, nhưng ở cấp prompt.

---

## 3. Từng RQ: đã có ai trả lời chưa?

**RQ1 — LLM mắc lỗi gì khi sinh simulator cơ cấu, bao nhiêu?**
Chưa được trả lời cho miền này. Có dữ liệu lân cận: SimuScene (chạy được >99% nhưng đúng chỉ ~21,5%), PhysCodeBench và InteractScience (code chạy nhưng hành vi vật lý lệch mô tả), WorldCoder-Bench (lỗi chủ yếu là state-schema drift, chuỗi tương tác gãy), MecEng (86–91% đúng ở rigid-body multibody với engine có sẵn). Không bài nào đưa ra taxonomy lỗi **động học** (khâu không đóng vòng, sai pha, sai tỉ số truyền, vi phạm periodicity, số trên panel lệch state) cho code tự viết không dùng engine. → Mở, nhưng phải trích các bài trên để nói "lỗi hành vi dù chạy được" đã là hiện tượng đã biết; mình đóng góp **phân loại và tần suất trong miền cơ cấu**.

**RQ2 — VLM screenshot review bỏ sót bao nhiêu lỗi động học mà oracle bắt được?**
Trả lời **một phần** ở mức tổng quát: WorldCoder-Bench Bảng 2 cho thấy screenshot+VLM không tương quan với correctness ở mức state (τb ≈ −0,07), nhưng theo hướng **quá khắt khe** (pass 2,7%, FPR 3,2%) chứ không phải bỏ sót; phụ lục lại cho số khác. TRAVL/ImplausiBench, PhyDetEx: VLM kém phát hiện vi phạm vật lý trong video. GIQ (ICLR 2026, https://iclr.cc/virtual/2026/poster/10009204): VLM kém về hình học 3D cơ bản. SGA: verifier symbolic được người chấm thích hơn VLM critic 65%. Chưa có bài nào đo **false-negative rate của VLM trên lỗi động học tiêm có kiểm soát** (mutation) với ground truth giải tích. → Mở ở mức cụ thể; phải đặt giả thuyết thận trọng (VLM có thể vừa bỏ sót lỗi tinh vi vừa báo sai lỗi thẩm mỹ — đo cả hai chiều, precision/recall).

**RQ3 — Đưa kết quả oracle vào repair loop có cải thiện độ đúng không?**
Cơ chế chung đã biết (Self-Debug; SGA với verifier symbolic; MSynth với feedback số; LAM/Articulate-Anything/CADCodeVerify/Perceptual self-reflection với feedback VLM). Chưa thấy so sánh **oracle-feedback vs VLM-feedback vs không feedback** trên simulator cơ cấu. → Mở nhưng là đóng góp gia tăng; giá trị nằm ở so sánh có đối chứng, không phải ở việc "có repair loop".

---

## 4. Tuyên bố novelty có thể bảo vệ

> "Chúng tôi đề xuất một bộ oracle tự động cho simulator cơ cấu cơ khí do LLM sinh, gồm quan hệ metamorphic suy ra từ hợp đồng `render(t)` pure (determinism, độc lập thứ tự gọi, tuần hoàn) và đối chiếu với lời giải động học giải tích, cùng benchmark ~25 cơ cấu kinh điển có ground truth; trên benchmark này chúng tôi đo tỉ lệ lỗi động học mà review bằng VLM trên ảnh chụp bỏ sót và hiệu quả của vòng sửa lỗi dựa trên oracle so với dựa trên VLM. Theo giao thức tìm kiếm ở mục 7 (arXiv, Google Scholar qua web, các venue CVPR/ICLR/NeurIPS 2025–2026, ngày 2026-11-02), chúng tôi chưa tìm thấy công trình nào kết hợp ground truth động học giải tích với oracle metamorphic theo thời gian cho code đồ hoạ do LLM sinh."

Phần phải định vị lại vì đã bị scoop một phần:
- Không nói "screenshot VLM judge không đáng tin cho code 3D" như phát hiện mới — WorldCoder-Bench đã có. Mình nói: *với lỗi động học cụ thể, VLM bỏ sót/báo nhầm bao nhiêu, loại lỗi nào*.
- Không nói "state-level oracle cho Three.js" là mới — WorldCoder-Bench có StateProbe. Mình nói: *oracle không cần contract viết tay từng task* (metamorphic + giải tích tái dùng cho mọi cơ cấu cùng loại) — đây là điểm SE đáng giá (chi phí tạo oracle).
- Không nói "repair loop" là mới — chỉ nói so sánh có đối chứng giữa các nguồn feedback.
- Phân biệt rõ với MSynth: synthesis (LLM chọn tham số, simulator tin cậy) vs. kiểm chứng simulator giải thích (code simulator chính là đối tượng bị kiểm).

---

## 5. Phù hợp với ISSE (theo 01_profile.md)

- Phạm vi: ISSE nhận software engineering, systems engineering, formal methods; các call gần đây "Systems Engineering and AI", "Intelligence for Systems and Software Engineering", "Resilient, Trustworthy, AI-Driven Software Systems" (01_profile mục 1, 7). Đề tài nên đóng khung **SE thuần**: "test oracle problem cho phần mềm do AI sinh", metamorphic testing, V&V của simulator — chứ không đóng khung như bài CV/graphics. Góc NASA/dependability: simulator giải thích dùng trong đào tạo kỹ sư; lỗi động học "trông đúng" là rủi ro tin cậy.
- Định dạng: loại bài, giới hạn độ dài, citation style vẫn **[CHƯA KIỂM CHỨNG]** (trang Springer bị chặn, 01_profile mục 2–3). Dùng Springer Nature LaTeX template; abstract ~150–250 từ (mặc định Springer, chưa xác nhận cho ISSE); single-blind; cần Data/Code Availability (đề xuất public benchmark + oracle trên GitHub/Zenodo, MIT tương thích với teardown MIT); khai báo dùng LLM.
- Checklist 01_profile nhấn "đánh giá thực nghiệm lặp lại được, baseline, thống kê" → cần: nhiều LLM, nhiều seed, mutation testing để đo sức mạnh oracle (mutation score), kiểm định thống kê (McNemar cho RQ2, so tỉ lệ pass trước/sau cho RQ3).
- Related work phải có nhánh SE: metamorphic testing (Segura et al. survey; Donaldson et al. OOPSLA 2017), test oracle problem, LLM code repair; và tìm thêm bài ISSE 2024–2026 về testing/AI-generated code (chưa làm trong gate này).
- Thời gian review dài (median 42–77 ngày tới quyết định đầu, ~12 tháng tới xuất bản theo 01_profile) → rủi ro bị arXiv vượt mặt; nên đăng preprint sớm khi có kết quả pilot đầy đủ.

---

## 6. Rủi ro và pilot tối thiểu

### Rủi ro
1. **Scoop đang diễn ra**: lĩnh vực "LLM → code 3D/vật lý + verifier" ra bài hàng tháng (WorldCoder 6/2026, SGA 7/2026, MecEng 7/2026). Cần kiểm lại arXiv ngay trước khi nộp.
2. **Lỗi quá ít**: model mạnh có thể viết slider-crank/gear train đúng gần 100%. Giảm nhẹ: chọn cơ cấu khó (Jansen, Geneva, cam có dwell, planetary, Watt/Stephenson 6 khâu), thêm biến thể tham số, và dùng **mutation có kiểm soát** để đo RQ2 độc lập với tần suất lỗi tự nhiên.
3. **Truy cập state**: oracle giải tích cần biết vị trí khâu. Cách: đọc scene graph three.js (world matrix từng mesh theo tên quy ước) tại t mẫu, hoặc yêu cầu LLM lộ `getState(t)` (giống runtime state interface của WorldCoder). Việc yêu cầu interface làm thay đổi bài toán sinh → phải nêu ở Threats.
4. **Đối chiếu ground truth**: ánh xạ mesh ↔ khâu và hệ toạ độ/pha ban đầu khác nhau → cần chuẩn hoá (khử pha, khử tỉ lệ) và dung sai; dễ sinh false positive của oracle. Đo precision oracle bằng gán nhãn tay một mẫu.
5. **VLM baseline công bằng**: dùng đúng vòng review của teardown (sheet beats + zoom) với cùng ngân sách token, nếu không reviewer sẽ nói baseline yếu.
6. **Chi phí**: một simulator teardown đầy đủ (film, panel, tour, âm thanh) rất dài. Cho benchmark nên dùng **hợp đồng rút gọn** (chỉ cơ cấu + panel số, giữ render(t) pure), ghi rõ khác biệt với teardown gốc.
7. GPU đang bận cho training → pilot chỉ dùng API, không chạy model cục bộ.

### Pilot tối thiểu (khoảng 1 tuần, không GPU)
- 3 cơ cấu: slider-crank (có lời giải đóng), four-bar Grashof (loop-closure, góc ra theo Freudenstein), gear train 2–3 cấp (tỉ số). Tuỳ chọn thứ 4: Jansen (khó).
- 2 LLM (ví dụ 1 model Claude và 1 model của hãng khác), 5 mẫu/cơ cấu/model → 30 simulator.
- Oracle v0: (a) determinism: render(t) gọi 2 lần và theo thứ tự ngẫu nhiên → so world matrix; (b) periodicity: t vs t+T; (c) loop-closure residual cho four-bar/slider-crank; (d) so vị trí piston/góc ra/tỉ số với công thức; (e) panel numbers vs state. Chạy bằng Playwright headless Chromium (teardown đã cài sẵn).
- Baseline VLM: vòng review sheet ảnh của teardown, hỏi "có lỗi động học không, ở đâu".
- Mutation nhỏ: tiêm 5 loại lỗi (đổi dấu góc, sai chiều dài khâu 10%, lệch pha 15°, sai tỉ số 1 răng, state giữa frame) vào 3 simulator đúng → đo VLM vs oracle bắt được.
- Repair: với mẫu fail, 1–2 vòng feedback oracle vs 1–2 vòng feedback VLM.
- Tiêu chí GO tiếp: ≥20% simulator tự nhiên có ≥1 lỗi oracle bắt được **và** VLM bỏ sót ≥30% mutation mà oracle bắt; precision oracle ≥90% trên mẫu gán tay. Nếu không đạt → NO-GO hoặc chuyển trọng tâm sang "chi phí tạo oracle" (metamorphic vs contract viết tay).

### Ước tính chi phí API (thô, **chưa kiểm giá hiện hành** — tra bảng giá trước khi chạy)
- Hợp đồng rút gọn: mỗi simulator ~8–15k token output, ~5–10k input. 30 lần sinh + ~30 lần repair (2 nhánh × ~15 mẫu fail) ≈ 60 lần gọi lớn.
- VLM review: ~30 sheet ảnh × 2 vòng + 15 mutation ≈ 75 lần gọi có ảnh, mỗi lần vài nghìn token.
- Với mức giá cỡ model tầm trung (vài USD/1M input, ~15 USD/1M output), tổng cỡ **20–60 USD**; nếu dùng simulator teardown đầy đủ (~30–50k token output mỗi lần) thì nhân 3–4 lần (≈100–200 USD). Đây là ước tính, không phải số đo.

---

## 7. Search log (ngày 2026-11-02)

Công cụ: WebSearch (chế độ standard; 1 truy vấn extended), WebFetch đọc arXiv abs/HTML, trang hội nghị, GitHub. Không dùng được trực tiếp Google Scholar/Semantic Scholar UI; các kết quả đến từ chỉ mục web (arXiv, thecvf, iclr.cc, neurips.cc, alphaxiv, emergentmind, themoonlight — trang tóm tắt AI chỉ dùng để định hướng, không làm nguồn cho số liệu).

Truy vấn đã chạy:
1. Fetch arXiv 2505.17607 (abs v3, abs v1, HTML v3) — MSynth.
2. "LAM LLM articulated objects URDF VLM checker LAMBench Gao USC"; fetch papernotes LAM (2 phần); fetch PDF tác giả (không đọc được do nén).
3. Fetch arXiv 2511.21978 — PAT3D.
4. "Articulate-Anything vision-language articulated objects actor critic Python code"
5. "Real2Code articulated objects code generation LLM; URDFormer"
6. "URDFormer Chen 2024 RSS simulation assets from real images"
7. "Infinigen-Sim procedural articulated simulation assets"
8. "CAD code generation benchmark LLM CadQuery verification CADPrompt CAD-Recode Text2CAD evaluation metrics"
9. "CADCodeVerify CADPrompt 'Generating CAD Code with Vision-Language Models' ICLR 2025"
10. "benchmark LLM generate physics simulation code MuJoCo PyBullet correctness evaluation 2025"
11. "PhysCodeBench Genesis physics-aware code generation benchmark arXiv 2604.23580"
12. "metamorphic testing simulation software physics engine survey"
13. "metamorphic testing LLM-generated code oracle property-based testing LLM code correctness 2025"
14. "testing computer graphics animation software oracle problem metamorphic testing rendering"
15. "Donaldson 'Automated testing of graphics shader compilers' OOPSLA 2017 metamorphic"
16. "vision language models fail geometric reasoning benchmark judge 3D rendering correctness errors"
17. "vision-language models detect physical implausibility in videos benchmark fail physics violation detection 2025"
18. "benchmark LLM generate three.js WebGL interactive 3D code evaluation VLM judge"
19. "'WorldCoder-Bench' arXiv StateProbe Three.js"; fetch arXiv 2606.01869 abs + HTML (Bảng 2, phụ lục C.4)
20. "LLM generated animation code physics plausibility automatic verification video benchmark code animation Manim or p5.js errors"; fetch 2602.10840, 2602.12311, 2602.13294, 2607.18116
21. "LLM generate interactive physics simulations for education HTML JavaScript evaluation correctness study"; fetch 2510.09724
22. "benchmark LLM mechanical engineering kinematics reasoning mechanisms gears linkages MechBench OR mechanism LLM benchmark"; fetch 2608.14615
23. "MecEng benchmark LLM multibody mechanical models simulation ground truth arXiv"
24. "LLM linkage mechanism design kinematics code generation arXiv 2025 four-bar"
25. (extended) "LLM generated mechanical simulator kinematic verification loop closure analytic oracle three.js machine animation"; fetch 2604.27962
26. "'Teaching Large Language Models to Self-Debug' arXiv 2304.05128"
27. Fetch https://github.com/elvarofficial/teardown + đọc SKILL.md cục bộ.

Chưa làm (nên làm ở cổng tiếp theo): tìm theo DBLP/Scopus các venue SE (ICSE, FSE, ISSTA, ASE, ICST, MET workshop, ISSE 2024–2026) với "metamorphic testing" + "LLM-generated" + "simulation"; đọc toàn văn WorldCoder-Bench, InteractScience, LAM để kiểm chi tiết; kiểm các benchmark CAD (CAD-Recode, Text2CAD, BenchCAD, CADBench, Text2CAD-Bench) bằng nguồn gốc thay vì tóm tắt.
