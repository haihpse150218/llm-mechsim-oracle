# Dàn ý bài báo — Executable oracles as acceptance gates for LLM-generated mechanism simulators

- Ngày: 2026-11-13. Tạp chí mục tiêu: **Innovations in Systems and Software Engineering (ISSE)**, Springer, Q3, single-blind, đăng subscription (không APC).
- Căn cứ: `../novelty_gate.md` (định vị, công trình gần nhất), `../pilot/REPORT.md` pha 1–6 (mọi con số dưới đây lấy từ đó), `journals/innovations-in-systems-and-software-engineering/01_profile.md` (checklist nộp).
- Lưu ý: mục 2.4 trong `08_plan.md` của ISSE là outline cho đề tài khác (type-aware tool filtering). Dàn ý này **thay thế** cho đề tài mechsim; chỉ dùng lại phần format và checklist.
- Giới hạn độ dài, loại bài, số chữ abstract của ISSE vẫn `[CHƯA KIỂM CHỨNG]` — phải mở Guide for Authors bằng Chrome trước khi viết bản thảo.
- Mục tiêu: ~9.000–10.000 chữ (không tính reference), 6 hình, 7 bảng, 40–50 reference.

---

## 0. Luận điểm chính (một câu)

> Với simulator cơ cấu cơ khí do LLM sinh, một oracle thực thi được (kiểm bất biến + luật thiết kế + lời giải động học từ chính tham số mà simulator khai báo) **vừa là cổng nghiệm thu đáng tin, vừa là nguồn phản hồi sửa lỗi** — và giá trị của nó nằm ở chỗ phản hồi chỉ ra *chỗ sai* và *giá trị đúng*, thứ mà VLM review và self-refine không cung cấp được.

Tên bài (chọn 1):
1. *Executable Oracles as Acceptance Gates for LLM-Generated Mechanism Simulators*
2. *Where and What: Localized Oracle Feedback for Repairing LLM-Generated Kinematic Simulators*
3. *Beyond Screenshot Review: Test Oracles for LLM-Generated 3D Mechanism Simulators*

Keywords (4–6): test oracle, LLM code generation, automated program repair, simulation software V&V, metamorphic testing, vision-language models.

## 1. Câu hỏi nghiên cứu ↔ dữ liệu đã có

| RQ | Câu hỏi | Dữ liệu (pha) | Kết quả chính hiện có |
|---|---|---|---|
| RQ1 | LLM mắc lỗi gì, bao nhiêu, khi sinh simulator từ mô tả tự do? | Pha 1 (spec chi tiết), pha 2 + 5 (spec-lite) | Spec chi tiết 0/8; spec-lite 7/16 (pha 2), 14/60 (pha 5). Lỗi tập trung ở **tri thức thiết kế** (Jansen 9/10 sai: gán lệch holy numbers) và **lắp ráp/ràng buộc** (planetary Zs+Zr, Watt6 vòng hở); cam 0/10 |
| RQ2 | Oracle và VLM review bắt được lỗi nào? | Pha 1–2 mutant + ablation panel; pha 2, 5 lỗi tự nhiên | Oracle: 24/24 + 7/7 mutant, 0 báo nhầm trên tham chiếu. VLM: 20/24 có panel → 14/24 ẩn panel (LEN 4/4 → 1/4); lỗi tự nhiên pha 5 TP 7, FN 1, **FP 4**; VLM bắt lỗi ngoài hợp đồng marker (geneva_s2) mà oracle không thấy → **bổ sung nhau** |
| RQ3 | Đưa oracle vào vòng sửa lặp có tốt hơn VLM-in-the-loop và self-refine không? | Pha 3 (1 vòng), pha 4, pha 5 (K=3, 2 rep) | Gộp 22 lượt file: oracle_spec **22/22**, coarse 10/22, self-refine 6/22, VLM 5/22; thứ tự lặp lại ở cả 2 rep và pha 4. VLM dừng sai 12 lần ("correct" khi oracle còn fail) |
| RQ4 | Phản hồi cần cụ thể đến mức nào? | Pha 5 + pha 6 (ablation `oracle_locate`) | Bậc thang: coarse 10/22 < locate 14/22 < spec 22/22. Jansen: sonnet cần "ở đâu" (6/6), haiku cần "giá trị đúng" (locate 0/8, spec 8/8). Lỗi lắp ráp: chỉ cần tên check (8/8 mọi nhánh oracle) |

Phụ (độ tin cậy của chính oracle): audit mesh↔marker, 0 drift trên 109 + 14 file PASS; mutant "lách marker" PASS oracle nhưng audit bắt được → đưa vào oracle thành kiểm META.

## 2. Contributions (đặt cuối Introduction)

1. Một **oracle thực thi được** cho simulator cơ cấu do LLM sinh, không cần contract viết tay cho từng task: 5 họ kiểm (META, PARAM, DESIGN, GT, PANEL) tính ground truth từ chính `SIM.params`, kèm hợp đồng marker tối thiểu và kiểm chống lách marker.
2. **Benchmark + dữ liệu**: 6 cơ cấu spec-lite (+4 cơ cấu spec chi tiết ở pha 1), 68 simulator sinh bởi 2 model (8 pha 1 + 60 spec-lite), 31 mutant (24 + 7), toàn bộ log sửa lặp (hơn 200 lượt: pha 3 21, pha 5 155, pha 6 40, cộng pha 4), công khai.
3. **Nghiên cứu thực nghiệm có đối chứng** oracle vs VLM review vs self-refine, cả ở vai trò phát hiện (RQ2) lẫn vai trò cổng sửa lặp (RQ3).
4. **Ablation mức cụ thể của phản hồi** (RQ4) cho thấy ngưỡng thông tin cần thiết phụ thuộc năng lực tri thức của model sửa, và cơ chế thất bại là trí nhớ sai tự tin (NO_CHANGE đổ lỗi cho checker).

## 3. Cấu trúc bài

| # | Mục | Số chữ | Nội dung | Hình/Bảng |
|---|---|---|---|---|
| – | Abstract | 200–250 | Bối cảnh (LLM sinh simulator 3D tương tác, review bằng ảnh là chuẩn hiện tại); oracle đề xuất; 4 RQ kèm số chính (44% lỗi tự nhiên ở spec tự do; spec-feedback 22/22 vs VLM 5/22; bậc thang locate 14/22); hàm ý | – |
| 1 | Introduction | 1.000–1.200 | Simulator giáo dục/kỹ thuật do LLM sinh (teardown-style); "oracle problem": code chạy, hình đẹp, nhưng sai động học; VLM review là chốt chặn phổ biến nhưng không đo được; ví dụ động cơ Jansen (chân mất đoạn đi phẳng, VLM nói "correct", agent tự tin "khớp holy numbers"); RQ1–RQ4; contributions | **Hình 1**: Jansen đúng vs sai (quỹ đạo chân + khung hình), kèm phản hồi của 3 nguồn |
| 2 | Background | 700–900 | Test oracle problem, metamorphic testing; động học cơ cấu (loop closure, Grashof, điều kiện lắp bánh hành tinh, holy numbers); hợp đồng `render(t)` thuần của teardown; VLM-as-judge | **Bảng 1**: 8 cơ cấu (thêm lambda, Peaucellier ở pha 7), lời giải, luật thiết kế |
| 3 | Approach: the oracle | 1.300–1.600 | Hợp đồng spec-lite (`SIM.params`, marker `<part>@<point>`, panel `data-q`); harness Playwright lấy mẫu `render(t)`; 5 họ kiểm; GT tính từ params của chính simulator (không cần ground truth cố định); diagnostics định vị (khâu nào, thời điểm nào, giá trị kỳ vọng); kiểm chống lách marker (drift) | **Hình 2**: pipeline oracle; **Bảng 2**: các kiểm theo họ + ví dụ diagnosis |
| 4 | Study design | 1.400–1.700 | Generator (sonnet, haiku; n=5/ô; 6 cơ cấu); mutant (6 loại × 4 + 7); VLM baseline (contact sheet 12 khung, ẩn danh, có/không panel); vòng sửa lặp K=3 với 5 nhánh (spec, locate, coarse, vlm, none) và luật dừng; 2 rep độc lập; agent sửa không được chạy code (lý do: tách nguồn thông tin); nhãn tay cho lỗi tự nhiên; thống kê (McNemar/Cochran Q, CI Wilson) | **Bảng 3**: lưới thí nghiệm + số lượt; **Hình 3**: vòng sửa lặp và 5 nhánh phản hồi |
| 5 | Results | 2.400–2.800 | 5.1 RQ1 tỉ lệ + phân loại lỗi tự nhiên (spec chi tiết vs lite); 5.2 RQ2 recall/FP oracle vs VLM, ablation panel, lớp lỗi bổ sung nhau; 5.3 RQ3 đường pass theo vòng, chi phí (số lượt agent), dừng sai; 5.4 RQ4 bậc thang thông tin, tách theo model × loại lỗi, phân tích định tính NO_CHANGE; 5.5 độ tin cậy oracle (tham chiếu, mutant, audit mesh) | **Bảng 4**: lỗi tự nhiên theo cơ cấu × model; **Bảng 5**: oracle vs VLM (mutant + tự nhiên); **Hình 4**: pass theo vòng r0→r3 cho 5 nhánh; **Bảng 6**: 5 nhánh × {ngoài Jansen, Jansen-sonnet, Jansen-haiku}; **Hình 5**: bậc thang thông tin |
| 6 | Discussion | 700–900 | Oracle là cổng nghiệm thu, không thay VLM (VLM vẫn bắt lỗi hình học ngoài hợp đồng) → đề xuất pipeline kết hợp; phản hồi phải định vị + mang giá trị tham chiếu khi có tri thức công bố; model nhỏ cần giá trị, model lớn cần vị trí; "agent tự tin trên trí nhớ sai" là rủi ro cho self-refine; chi phí: oracle 0,2 s/0 token vs VLM ~52k token/lần | **Hình 6** (tuỳ chọn): đề xuất pipeline oracle + VLM |
| 7 | Threats to validity | 700–900 | Construct: oracle mã hoá tri thức do tác giả viết (cần chuyên gia rà); hợp đồng marker có thể làm thay đổi cách sinh; nhãn tay 1 người. Internal: agent sửa không chạy code; subagent Claude Code có system prompt riêng; 1 vi phạm "không chạy lệnh". External: chỉ 2 model cùng hãng; hiệu ứng RQ4 dồn vào Jansen; 6 cơ cấu; spec-lite do tác giả viết. Conclusion: n nhỏ, file không độc lập giữa rep | – |
| 8 | Related work | 900–1.100 | (a) LLM → code 3D/vật lý + verifier: WorldCoder-Bench, InteractScience, SimuScene, PhysCodeBench, SGA, Perceptual self-reflection, LAM, Articulate-Anything, CADCodeVerify; (b) LLM + cơ khí: MSynth và bài tiếp, MecEng; (c) oracle problem, metamorphic testing, đồ hoạ (Donaldson OOPSLA'17, Segura survey); (d) LLM repair với feedback thực thi (Self-Debug, …); (e) VLM-as-judge và giới hạn (TRAVL, PhyDetEx, GIQ); (f) bài ISSE 2024–2026 về testing/AI-generated code | **Bảng 7**: so với công trình gần nhất (đối tượng kiểm, oracle cần viết tay?, có so VLM?, có repair có đối chứng?) |
| 9 | Conclusion | 300–400 | Tóm 4 RQ; future work: model hãng khác, thêm cơ cấu có tri thức công bố, oracle cho teardown đầy đủ (film/tour), oracle tự sinh từ spec | – |
| – | Declarations | 200–300 | Funding, competing interests, ethics (không có người tham gia), author contributions; tuyên bố GenAI (Claude sinh simulator là **đối tượng nghiên cứu**; Claude Code hỗ trợ viết oracle và chạy thí nghiệm); Data & Code Availability (GitHub + Zenodo, MIT; teardown gốc MIT) | – |

## 4. Những gì còn thiếu trước khi viết bản thảo (xếp theo mức chặn)

| # | Việc | Vì sao | Mức |
|---|---|---|---|
| 1 | **Model hãng khác** (sinh + sửa), ít nhất 1 model | Reviewer sẽ đánh vào "chỉ Claude"; hiện bị chặn vì không có API key | Chặn |
| 2 | ~~Thêm cơ cấu tri thức công bố ngoài Jansen~~ — **XONG 11-13 (pha 7)**: lambda lặp lại kiểu kết quả của Jansen (haiku spec 5/5, locate/coarse/none 0/5); Peaucellier 0/10 lỗi tự nhiên. Gộp haiku: spec 13/13 vs locate 0/13 | — | Xong |
| 3 | ~~Sửa diagnosis holy numbers~~ — **XONG 11-13**: verdict dùng scale minimax, diagnosis dùng scale đồng thuận; chấm lại 661 verdict không đổi | — | Xong |
| 4 | ~~Kiểm drift vào oracle~~ — **XONG 11-13**: META drift ≤ 0,5 mm; chỉ mutant gian lận đổi PASS → FAIL | — | Xong |
| 5 | Kiểm định thống kê: Cochran Q cho 5 nhánh, McNemar từng cặp, CI Wilson | Checklist ISSE nhấn thống kê | Cao |
| 6 | Chạy VLM review 2–3 lần trên cùng sheet (inter-run) | Pha 5 đã thấy VLM không ổn định | Trung bình |
| 7 | Chuyên gia cơ khí rà bộ kiểm DESIGN (1 người, có ghi nhận) | Threat construct lớn nhất | Trung bình |
| 8 | Related work nhánh SE: tìm ICSE/FSE/ISSTA/ASE/ICST + bài ISSE 2024–2026 | Novelty gate còn treo; ISSE muốn thấy bài của chính tạp chí | Trung bình |
| 9 | Kiểm lại arXiv ngay trước khi nộp (lĩnh vực ra bài hàng tháng) | Rủi ro scoop | Trước nộp |
| 10 | Xác nhận Guide for Authors ISSE (độ dài, abstract, citation style) | Đang `[CHƯA KIỂM CHỨNG]` | Trước nộp |
| 11 | Đóng gói artifact (repo công khai, Zenodo DOI, README tái lập) | Data availability | Trước nộp |

## 5. Hình/bảng cần dựng từ dữ liệu có sẵn

- Bảng 4, 5, 6: tổng hợp từ `results/gen_lite*.jsonl`, `vlm_lite*/`, `iter5/*/summary.json` — viết 1 script `paper/make_tables.mjs` để số trong bài luôn sinh từ dữ liệu.
- Hình 4: đường pass theo vòng từ `iter/`, `iter5/rep*/`, `iter5/abl*/` (`summary.json`).
- Hình 1: quỹ đạo chân Jansen đúng/sai — đã có mô phỏng kiểm ở pha 2, cần vẽ lại.
