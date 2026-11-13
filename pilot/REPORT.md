# Pilot report — LLM mechanical-simulator oracles (2026-11-08)

Kế hoạch: `../novelty_gate.md` mục 6. Dữ liệu thô: `results/*.jsonl`, `results/vlm_vs_oracle.json`, `vlm/out/`, `vlm/key.json`.

## 1. Đã làm gì

| Thành phần | Nội dung |
|---|---|
| Cơ cấu | 4: slider-crank, four-bar crank-rocker (Grashof), hộp số 2 cấp (20/40, 15/45), Geneva 4 rãnh |
| Ground truth | Lời giải giải tích đóng (`oracle/mechs.mjs`) |
| Hợp đồng sinh | Rút gọn từ teardown: một file HTML three.js, `render(t)` thuần, body đặt tên + khung local quy ước, panel `data-q` (`contract.md`) |
| Oracle v0 | Playwright + Chrome headless. 5 nhóm: determinism (thứ tự xuôi/ngược/xáo), periodicity, pose so giải tích, structural (khớp đóng vòng, khoảng cách tâm, ăn khớp bánh răng, chốt-trong-rãnh), panel so giải tích |
| Tham chiếu | 4 simulator viết tay (`reference/`) |
| Mutant | 6 loại lỗi × 4 cơ cấu = 24 (`oracle/mutate.mjs`): DIR, LEN, PHASE, BRANCH, PANEL, STATE |
| Sinh bằng LLM | Subagent Claude `sonnet` và `haiku` trong Claude Code, mỗi cơ cấu 1 mẫu (s1) → 8 simulator |
| VLM baseline | Subagent `sonnet` xem 1 contact sheet 12 khung/chu kỳ, đầu vào ẩn danh (id băm, khoá tách riêng), đọc spec cơ cấu; 28 sheet = 24 mutant + 4 tham chiếu |

## 2. Kết quả

**Oracle**
- Tham chiếu: 4/4 PASS (sai số ~1e-14) → không báo nhầm.
- Mutant: 24/24 bị bắt.
- Simulator do LLM sinh: 8/8 PASS (sonnet 4/4, haiku 4/4). **Tỉ lệ lỗi tự nhiên = 0/8.**
- Chi phí: median 0,17 s/simulator, không tốn token.

**Kênh nào bắt lỗi** (quan trọng cho luận điểm "oracle không cần lời giải"):
- Chỉ kiểm không cần lời giải (determinism + periodicity + structural) bắt được: STATE (4/4), LEN (4/4), PHASE (4/4), BRANCH 3/4 (gear, geneva, slider), DIR 2/4 (gear, geneva).
- Cần ground truth giải tích (pose/panel) mới bắt: four_bar BRANCH (nhánh chéo vẫn đóng vòng hợp lệ), DIR của slider-crank và four-bar, toàn bộ PANEL.

**VLM so với oracle trên mutant**

| | VLM | Oracle |
|---|---|---|
| Recall trên 24 mutant | **20/24 (83%)** | 24/24 |
| Báo nhầm trên 4 tham chiếu | 0/4 | 0/4 |
| Theo loại lỗi (VLM) | DIR 4/4, LEN 4/4, PANEL 4/4, BRANCH 3/4, STATE 3/4, PHASE 2/4 | tất cả 4/4 |

VLM bỏ sót 4: `slider_crank/PHASE` (tay quay vẽ lệch 15°), `geneva/PHASE` (bánh Geneva lệch 15°), `gear_train/BRANCH` (tâm bánh 4 lệch 6 mm, răng không ăn khớp), `gear_train/STATE`.

Quan sát định tính:
- VLM mạnh hơn dự kiến vì nó **tự giải động học từ spec rồi so với số trên panel** (vd. tính ra 160/113,14/80 mm cho slider-crank). Panel số + spec có công thức là kênh cho VLM "gian lận" theo hướng tốt.
- Ở `geneva/PHASE`, VLM **có thấy** rãnh lệch 12–20° nhưng quy cho phối cảnh và kết luận "correct" (conf 0,7). Đây là kiểu lỗi đúng như giả thuyết RQ2: lệch hình học nhỏ bị hợp lý hoá.
- Ở `gear_train/STATE`, VLM chỉ kiểm tính nhất quán *nội bộ* (out = in/6) mà không đối chiếu góc vào với t.
- Mỗi lần review VLM ~51k token (gồm overhead của agent); oracle 0,17 s.

## 3. Đối chiếu tiêu chí GO trong novelty gate

| Tiêu chí | Ngưỡng | Kết quả | |
|---|---|---|---|
| Simulator tự nhiên có ≥1 lỗi oracle bắt | ≥ 20% | 0/8 = 0% | ✗ |
| VLM bỏ sót mutation mà oracle bắt | ≥ 30% | 4/24 = 17% | ✗ |
| Precision oracle | ≥ 90% | 0 báo nhầm / 12 file đúng (4 ref + 8 gen) | ✓ (mẫu nhỏ) |

→ **Theo đúng tiêu chí đã đặt: NO-GO cho cách đóng khung hiện tại** (RQ1 "LLM mắc lỗi gì" và RQ2 "VLM bỏ sót nhiều").

## 4. Vì sao có thể là do thiết kế pilot (chưa phải kết luận về hiện tượng)

1. **Spec quá chi tiết**: cho sẵn θ(t), hệ toạ độ, nhánh ráp, khung local, thậm chí `a = C·sin(π/4)`. Gần như là đọc chính tả công thức. Dùng teardown thật, người dùng chỉ nói "làm simulator Geneva drive" và LLM tự chọn mọi thứ.
2. **Cơ cấu dễ** (đều có trong sách giáo khoa). Chưa thử Jansen, planetary, cam có dwell, Watt/Stephenson 6 khâu.
3. **Panel + spec có công thức** trao cho VLM một kênh kiểm số rất mạnh; trong teardown thật panel không đi kèm spec giải tích.
4. **Mẫu nhỏ**: 8 simulator, 1 mẫu/ô; 1 VLM (sonnet), 1 lần chạy; mutant tiêm vào code của chính mình.
5. **Generator chỉ là Claude** chạy qua subagent Claude Code (có system prompt riêng), chưa có model hãng khác. Không có API key đọc được trên máy.

## 5. Đề xuất

- **Pivot thử nhanh (~1 ngày, chỉ tốn agent, không GPU)** trước khi bỏ hẳn:
  - (a) *spec-lite*: chỉ mô tả bằng lời + quy ước đặt tên, LLM tự chọn kích thước và lộ `SIM.params`; oracle tính ground truth từ params đó. Thêm 2 cơ cấu khó (Jansen, planetary).
  - (b) *ablation VLM*: cùng 24 mutant nhưng ẩn panel, và spec không có công thức. Nếu recall rơi mạnh → luận điểm "VLM dựa vào panel số, không thấy được hình học" có giá trị.
  - Tiêu chí: lỗi tự nhiên ≥20% ở (a) **hoặc** VLM bỏ sót ≥30% ở (b) → GO lại; nếu cả hai trượt → NO-GO hẳn.
- **Hoặc chuyển trọng tâm** sang "chi phí tạo oracle" (oracle metamorphic/structural không cần lời giải bắt 21/24 mutant mà không cần contract viết tay) — nhưng phần này yếu dần nếu lỗi tự nhiên hiếm.
- **Hoặc NO-GO**: quay lại 2 đề tài còn lại trong `journals/TOPIC_COMPARISON.md`.

---

# Pha 2 — pivot (spec-lite + cơ cấu khó + ablation VLM), 2026-11-08

## Thiết kế
- **Spec-lite** (`oracle/lite_specs.mjs`, `specs_lite/`): chỉ mô tả bằng lời; LLM tự chọn kích thước, vị trí, tốc độ, chiều quay và khai báo trong `SIM.params`. Quy ước duy nhất: marker `<part>@<point>` ở mỗi khớp.
- 4 cơ cấu: four-bar crank-rocker, Geneva (n tự chọn 4–6), **chân Jansen** (holy numbers), **bộ hành tinh** (vành cố định, 3 bánh hành tinh).
- Sinh: sonnet + haiku × 2 mẫu = 16 simulator (`gen_lite/`).
- **Oracle-lite** (`oracle/run_oracle_lite.mjs`), 5 họ kiểm:
  - META (không cần lời giải): determinism theo thứ tự gọi, periodicity, độ cứng từng khâu, khớp trùng, khung đứng yên.
  - PARAM: hình vẽ khớp với `params` khai báo.
  - DESIGN: luật kỹ thuật (Grashof, Geneva vào rãnh tiếp tuyến, holy numbers, Zr = Zs + 2Zp và điều kiện chia đều 3 bánh hành tinh).
  - GT: lời giải từ params.
  - PANEL: số trên panel so với lời giải.
- 4 tham chiếu lite (`reference_lite/`): **4/4 PASS**. Sửa 1 lỗi của oracle trong quá trình làm: periodicity của Geneva không được so các rãnh sau khi bánh đã chuyển vị trí.

## Kết quả

**Lỗi tự nhiên** (đã kiểm tay từng ca):

| Simulator | Lỗi | Oracle | VLM (có panel) |
|---|---|---|---|
| sonnet four_bar_s2 | crash khi nạp (`Cannot assign to read only property 'position'`) | LOAD | — (không render được) |
| sonnet jansen_s1, s2 | gán nhầm holy numbers VU↔WU, UT↔WT → chân mất đoạn đi phẳng (36% → 6% chu kỳ, bước 49 → 11 mm, đã mô phỏng kiểm) | DESIGN | bắt (cả 2, conf 0,55) |
| haiku jansen_s1 | holy numbers xáo trộn (tay quay 38 thay vì 15) → khớp rời tới 52 mm | META+DESIGN | bắt |
| haiku jansen_s2 | tương tự, khớp gối U hở 18 mm | META+DESIGN | bắt |
| haiku planetary_s1 | Zs+Zr = 100 không chia hết cho 3 → 3 bánh hành tinh chia đều không thể ăn khớp đồng thời | DESIGN | **bỏ sót** (conf 0,6 "correct") |
| sonnet geneva_s2 | phần khuyết của đĩa khoá nằm ngược phía chốt → bánh không bị khoá lúc dừng, đĩa đè lên bánh lúc ăn khớp | **bỏ sót** (ngoài hợp đồng marker) | bắt |

- **Lỗi tự nhiên: 7/16 = 44%** (oracle bắt 6, VLM bắt thêm 1). Bỏ ca crash: 6/16 = 38%. Phase 1 (spec chi tiết) là 0/8.
- Jansen: **4/4 mẫu sai**. Cả hai model đều nhớ đủ 13 con số nhưng gán sai khâu, hoặc xáo trộn hẳn.

**VLM trên 15 simulator lite render được** (bỏ ca crash):
- Recall trên lỗi thật: 5/6. Bỏ sót đúng ca vi phạm điều kiện lắp ráp, là lỗi không thể nhìn thấy trên hình.
- Báo nhầm trên simulator đúng: 1/9 (`sonnet/geneva_s1`: đọc nhầm do sheet bắt đầu giữa lúc ăn khớp; oracle đo được bước 60°/vòng và chốt luôn nằm trên trục rãnh).
- Ngoài ra báo nhầm 2/4 trên tham chiếu lite của tao. Nguyên nhân chủ yếu là hình vẽ tham chiếu quá thô, nên không tính vào số liệu.

**Ablation trên 24 mutant pha 1**:

| | Có panel | Ẩn panel |
|---|---|---|
| VLM recall (24 mutant) | 20/24 | 14/24 |
| Bỏ nhóm PANEL (không thể thấy khi ẩn) | 16/20 | 14/20 → **bỏ sót 30%** |
| LEN (khâu dài/ngắn 10–15%) | 4/4 | **1/4** |
| Báo nhầm trên 4 tham chiếu | 0/4 | 0/4 |

→ VLM phát hiện lỗi về độ dài chủ yếu bằng cách **đọc số trên panel rồi tự giải**, không phải bằng cách nhìn hình.

**Chi phí**: oracle median 0,23 s/simulator (lâu nhất 15 s, là ca crash chờ timeout), 0 token. Một lần review VLM ~52k token.

## Đối chiếu tiêu chí pivot
- (a) lỗi tự nhiên ≥ 20%: **44% ✓**
- (b) VLM bỏ sót ≥ 30%: ẩn panel 30% (vừa chạm ngưỡng); lỗi tự nhiên 1/6 = 17% (✗); có panel 17% (✗)
- Tiêu chí đã đặt là (a) **hoặc** (b) → **GO**, nhưng phải đổi cách đóng khung:

## Cách đóng khung đề xuất cho bài báo
Không nói "VLM bỏ sót nhiều". Nói: **oracle thực thi được và VLM bắt các lớp lỗi khác nhau.**
1. **Oracle bắt**:
   - lỗi tri thức kỹ thuật trông vẫn hợp lý (holy numbers gán sai, điều kiện lắp bánh hành tinh);
   - lỗi không nhìn thấy (state, determinism);
   - sai số mà VLM chỉ thấy được khi có panel số.

   Chi phí gần 0, không cần contract viết tay cho từng task: META và DESIGN dùng lại được cho mọi biến thể.
2. **VLM bắt**: lỗi hình học nằm ngoài hợp đồng marker (va chạm, đĩa khoá). Nhưng VLM hay hợp lý hoá ("do phối cảnh") và báo nhầm khi sheet bắt đầu ở pha khó đọc.
3. **Spec càng tự do thì LLM càng sai nhiều** (0% → 44%): lỗi nằm ở bước *chọn tham số / tri thức miền*, không phải ở bước code động học.
4. RQ3 (vòng sửa lỗi) bây giờ đã làm được: có 7 lỗi thật để thử sửa bằng phản hồi của oracle so với phản hồi của VLM.

## Hạn chế (ghi ở Threats)
- n nhỏ: 16 simulator, 1 VLM, 1 lần chạy.
- Generator và VLM đều là Claude, chạy qua subagent Claude Code (cùng họ model → thiên lệch tương quan).
- Bộ kiểm DESIGN mã hoá tri thức miền do tác giả viết. Cần một chuyên gia cơ khí rà lại; riêng holy numbers đã kiểm bằng mô phỏng quỹ đạo chân.
- Hợp đồng marker là điều kiện tiên quyết để oracle chạy được. Cần đo xem nó làm thay đổi hành vi sinh code đến mức nào.

## Bước tiếp theo đề xuất
1. RQ3: sửa 6 lỗi oracle bắt được bằng phản hồi oracle so với phản hồi VLM (1–2 vòng).
2. Mở rộng n: 5 mẫu/ô, thêm 1 model hãng khác (cần API key), thêm 2–3 cơ cấu (cam có dwell, Watt 6 khâu).
3. Đo inter-rater: chạy VLM review 2–3 lần trên cùng sheet.

---

# Pha 3 — RQ3: vòng sửa lỗi (2026-11-08)

## Thiết kế
- 7 simulator lỗi thật từ pha 2 × 3 nhánh feedback × 1 vòng; người sửa là **chính model đã sinh ra file** (sonnet/haiku), sửa tại chỗ, không được chạy thử (`oracle/repair_prep.mjs`, `repair/`).
  - **oracle**: danh sách các kiểm bị fail, kèm số đo và dung sai.
  - **vlm**: báo cáo của VLM ở pha 2.
  - **none**: chỉ nói "có thể có lỗi, hãy kiểm lại".
- Chấm: chạy lại oracle-lite cho cả 21 bản. Riêng geneva_s2 (lỗi nằm ngoài hợp đồng marker) chấm bằng mắt trên sheet (`sheets_repair/`).

## Kết quả (✓ sửa đúng, ~ cải thiện một phần, ✗ không sửa được)

| Lỗi gốc | oracle | vlm | none |
|---|---|---|---|
| sonnet four_bar_s2 (crash) | ✓ | ✓ | ✓ |
| sonnet jansen_s1 (gán nhầm holy numbers) | ✗ đổi sai cặp YV↔VU | ✗ | ✗ "không thấy lỗi" |
| sonnet jansen_s2 (như trên) | ✓ | ✓ | ✗ "không thấy lỗi" |
| haiku jansen_s1 (khớp rời + holy numbers) | ~ sửa bug xoay khâu, META đã pass, còn DESIGN | ✗ không sửa gì | ~ như nhánh oracle |
| haiku jansen_s2 | ✗ | ✗ | ✗ |
| haiku planetary_s1 (điều kiện lắp) | ✓ | ✓ (dù được báo "không lỗi") | ✓ (tự phát hiện) |
| sonnet geneva_s2 (đĩa khoá) | ✗ (oracle báo "pass") | ? phần khuyết không còn thấy | ✓ (kiểm bằng mắt) |
| **Tổng sửa đúng** | **3/7** | **3/7** (+1 chưa rõ) | **3/7** |

## Nhận xét
1. **Với 1 vòng và n = 7, không nhánh nào hơn nhánh nào.** Không đủ cơ sở để nói "feedback từ oracle sửa tốt hơn".
2. **Feedback của oracle quá thô.** Thông báo "holy numbers rel. error 0,341" khiến sonnet đoán mò và đổi nhầm cặp khâu (khớp với 0,341 nhưng là cặp sai). Feedback phải chỉ đích danh *cặp khâu nào sai* thì mới hành động được.
3. **Câu nhắc chung "hãy kiểm lại" mạnh hơn dự đoán.** Nhánh none tự tìm ra lỗi lắp bánh hành tinh và lỗi đĩa khoá. Nhưng cũng nhánh đó lại khẳng định "không có lỗi" với Jansen sai (tin vào trí nhớ sai về holy numbers).
4. **Giá trị rõ nhất của oracle là làm cổng nghiệm thu**: biết chính xác bản sửa nào đạt và bản nào chưa, gần như không tốn gì (vd. bắt được việc sonnet tự tin "đã sửa" nhưng sửa sai cặp). VLM không làm được việc này một cách đáng tin.
5. Gợi ý thiết kế cho bài báo: chạy **sửa lặp có cổng oracle** (lặp đến khi pass, tối đa k vòng) với feedback cụ thể hơn, so với VLM-in-the-loop và self-refine. Đây là RQ3 hợp lý hơn so với "1 vòng".

## Hạn chế
n = 7, mỗi nhánh 1 lần chạy; agent sửa không được chạy thử trang; việc chấm geneva_s2 do một người (tác giả) xem sheet.

---

# Pha 4 — RQ3b: sửa lặp có cổng oracle (2026-11-10)

## Thiết kế
- 7 simulator lỗi gốc (`gen_lite`, giống pha 3) × 4 nhánh × tối đa **K = 3 vòng**. Người sửa là chính model đã sinh file. Mỗi vòng là một agent mới, đọc spec + file hiện tại + toàn bộ lịch sử feedback, không được chạy trang (`iter/PROMPT.md`, `oracle/iter_repair.mjs`).
- Nhánh và luật dừng:
  - **oracle_spec**: cổng oracle + feedback *cụ thể*. Oracle thêm trường `detail`: khâu nào lệch bao nhiêu so với holy numbers ở tỉ lệ khớp nhất, cặp nào "trông như bị đổi chỗ", khớp nào hở ở t nào, toạ độ vẽ so với lời giải, điều kiện bánh răng nào vi phạm. **Tiêu chí pass/fail không đổi** (4/4 tham chiếu PASS, gen_lite cho kết quả y hệt pha 2). Dừng khi oracle pass.
  - **oracle_coarse**: cổng oracle + feedback *thô* kiểu pha 3 (tên kiểm, số đo, dung sai). Dừng khi oracle pass. Nhánh này tách hiệu ứng "lặp" khỏi hiệu ứng "cụ thể".
  - **vlm**: VLM ẩn danh review sheet mỗi vòng (vòng 0 dùng lại review pha 2). Dừng khi VLM nói "correct".
  - **none** (self-refine): prompt chung "hãy kiểm lại". Dừng khi người sửa trả NO_CHANGE.
- Mọi vòng của mọi nhánh đều được chấm bằng oracle (`iter/results/r<k>.jsonl`, bản chụp `*.r<k>.html`), nhưng chỉ hai nhánh oracle được thấy kết quả.

## Kết quả (6 lỗi oracle thấy được; geneva_s2 xét riêng)

Số file pass oracle sau mỗi vòng:

| Nhánh | v0 | v1 | v2 | v3 (cuối) | Lượt gọi agent |
|---|---|---|---|---|---|
| **oracle_spec** | 0/6 | 5/6 | **6/6** | **6/6** | 7 sửa |
| oracle_coarse | 0/6 | 3/6 | 4/6 | 4/6 | 11 sửa |
| vlm | 0/6 | 2/6 | 2/6 | 2/6 | 10 sửa + 9 review VLM |
| none | 0/6 | 0/6 | 0/6 | 0/6 | 9 sửa |

Theo từng file (✓ = pass oracle ở cuối):

| File lỗi | oracle_spec | oracle_coarse | vlm | none |
|---|---|---|---|---|
| sonnet four_bar_s2 (crash) | ✓ v1 | ✓ v1 | ✓ v1 | ✗ NO_CHANGE ("không lỗi") |
| sonnet jansen_s1 (VU↔WU, UT↔WT) | ✓ v1 | ✓ v2 (sửa từng cặp) | ✗ VLM nói correct ở v2 | ✗ NO_CHANGE |
| sonnet jansen_s2 (UT↔WT) | ✓ v1 | ✓ v1 | ✓ v1 | ✗ NO_CHANGE |
| haiku jansen_s1 (xáo trộn + bug xoay khâu) | ✓ v1 | ✗ hết ngân sách (khăng khăng "độ dài đúng") | ✗ VLM nói correct ở v2 | ✗ NO_CHANGE ở v2 |
| haiku jansen_s2 (xáo trộn + bộ giải) | ✓ v2 | ✗ hết ngân sách | ✗ hết ngân sách (tự đặt VU = 50) | ✗ NO_CHANGE |
| haiku planetary_s1 (Zs+Zr không chia hết 3) | ✓ v1 | ✓ v1 | ✗ VLM nói correct từ v0 | ✗ NO_CHANGE |
| sonnet geneva_s2 (đĩa khoá, ngoài hợp đồng marker) | ✗ oracle pass từ v0 nên không sửa | ✗ như trên | ~ v1, VLM nói correct | ~ v1, NO_CHANGE ở v2 |

geneva_s2 (kiểm tay trên sheet `iter/sheets_check/`): nhánh vlm và nhánh none cho ra **bản sửa giống hệt nhau từng byte**. Phần khuyết sai phía đã bị xoá, nhưng đĩa khoá bây giờ tròn kín, nên vẫn đè lên cánh bánh lúc ăn khớp (t = 0, t = 4,8 s). Chấm: sửa một phần.

## Nhận xét
1. **Cổng oracle + feedback cụ thể sửa được 6/6 trong ≤ 2 vòng với ít lượt gọi nhất (7).** Pha 3 (1 vòng, feedback thô) mỗi nhánh chỉ được 3/7. Hai yếu tố đều đóng góp:
   - *Lặp*: nhánh coarse từ 3 lên 4. Sonnet suy ngược từ con số 0,0736 ra cặp còn lại.
   - *Cụ thể*: spec hơn coarse 6 so với 4, và nhanh hơn. Hai ca coarse không sửa được đều là haiku: model khăng khăng bộ độ dài sai của mình "chính là holy numbers" và cho rằng bộ chấm sai.
2. **Luật dừng dựa vào tự đánh giá thì không đáng tin.**
   - none: 7/7 lần dừng là NO_CHANGE. 6/6 lần trong số đó file vẫn fail oracle, kể cả trang crash không nạp được.
   - vlm: 6 lần VLM nói "correct". 3 lần sai hẳn (planetary v0, sonnet jansen_s1 v2, haiku jansen_s1 v2), 1 lần chỉ đúng một phần (geneva).
   - Riêng sonnet jansen_s1 nhánh vlm: vòng 2 hoàn tác bản sửa vòng 1, file trở về đúng trạng thái lỗi ban đầu. Pha 2 VLM bắt được trạng thái này (conf 0,55), lần này lại nói "correct" (conf 0,6). Đây là bằng chứng VLM không ổn định giữa các lần chấm.
3. **Feedback từ VLM dẫn người sửa đi sai hướng.** Có các ca:
   - xoay chân đế 20° để "làm phẳng" quỹ đạo chân;
   - đổi VU thành 50 (không phải holy number) để hết "kẹt gối";
   - viết lại bộ giải nhưng giữ nguyên độ dài sai.

   VLM mô tả triệu chứng chứ không chỉ ra nguyên nhân; người sửa chữa triệu chứng.
4. **Self-refine tự tin sai một cách có hệ thống trên tri thức miền.** Nhiều lần người sửa liệt kê nguyên bảng độ dài sai rồi khẳng định chúng "khớp holy numbers". Ở pha 3, cũng prompt đó tự tìm ra lỗi bánh hành tinh; ở pha này thì không. Vậy self-refine còn không ổn định giữa các lần chạy.
5. **Điểm mù của oracle được xác nhận:**
   - Lỗi ngoài hợp đồng marker (geneva) bị oracle chấp nhận ngay từ v0. Đây là chỗ VLM/người duyệt còn cần thiết, dù chính VLM cũng chấp nhận bản sửa một phần.
   - Feedback cụ thể suy cho cùng là đưa đáp án, vì bộ kiểm DESIGN mã hoá holy numbers. Đây là đặc tính của oracle đặc tả, không phải gian lận, nhưng cần nói rõ trong bài: giá trị nằm ở chỗ *oracle có thể tạo tự động/tái dùng*, không ở chỗ nó "gợi ý khéo".

## Hệ quả cho bài báo
- RQ3 có câu trả lời rõ hơn pha 3: **oracle làm cổng nghiệm thu + nguồn feedback chẩn đoán > VLM-in-the-loop > self-refine**, trên cả tỉ lệ sửa lẫn chi phí. Luận điểm mạnh nhất là *luật dừng*: chỉ cổng oracle không bao giờ dừng sai.
- Đề xuất đóng khung: *"executable oracles as acceptance gates for LLM-generated simulators"*, với VLM là kênh bổ sung cho phần nằm ngoài hợp đồng.

## Hạn chế
- n = 6 (+1), mỗi ô 1 lần chạy, chỉ họ Claude (sonnet/haiku làm người sửa, sonnet làm VLM).
- Lỗi tập trung vào Jansen (4/6), nên kết quả có thể phản ánh riêng độ khó của tri thức holy numbers.
- Nhánh oracle_spec được hưởng lợi từ việc DESIGN mã hoá đáp án.
- geneva_s2 do tác giả kiểm tay một mình.

## Bước tiếp theo đề xuất
1. Thêm 2–3 cơ cấu có lỗi tự nhiên ngoài Jansen (cam có dwell, Watt 6 khâu), 5 mẫu/ô, lặp mỗi nhánh 2–3 lần để có khoảng tin cậy.
2. Ablation mức cụ thể của feedback ở nhánh oracle: chỉ chỉ ra *cặp nào sai*, không đưa giá trị đúng.
3. Một model hãng khác (cần API key) cho cả sinh và sửa.
4. Bắt đầu dàn ý bài báo theo cách đóng khung "acceptance gate".

# Pha 5 — mở rộng: cam + Watt 6 khâu, n=5/ô, sửa lặp lặp lại 2 lần (2026-11-10)

## Thiết kế
- Thêm 2 cơ cấu ngoài Jansen: **cam** (cycloid rise–dwell–return–dwell, con lăn, cần đẩy lệch tâm; kiểm luật nâng, tiếp xúc con lăn–cam, góc áp lực ≤30°, không cắt lẹm) và **Watt 6 khâu** (lắp ráp 2 vòng trên 720 điểm, góc truyền [30°,150°] cả 2 vòng, giữ nhánh).
- 7 mutant mới (cam ×4, watt6 ×3): oracle bắt **7/7**.
- Sinh n=5/ô cho 6 cơ cấu × {sonnet, haiku} = 60 sim (44 mới).
- Sửa lặp K=3, 4 nhánh: oracle_spec, oracle_coarse, vlm, none. Luật dừng như pha 4. Chạy **2 lần độc lập**:
  - rep1: 8 file lỗi mới;
  - rep2: 8 file đó + 7 file lỗi pha 4 → 15 file.

## Kết quả 1 — lỗi tự nhiên (oracle, kiểm tay xác nhận)
| | four_bar | geneva | jansen | planetary | cam | watt6 |
|---|---|---|---|---|---|---|
| haiku | 0/5 | 0/5 | 5/5 | 2/5 | 0/5 | 1/5 |
| sonnet | 1/5 | 0/5 | 4/5 | 0/5 | 0/5 | 1/5 |

- Tổng có lỗi: 14/60. Ngoài Jansen chỉ 5/50 có lỗi.
- **Cam 0/10**: một cơ cấu mô tả đầy đủ bằng luật chuyển động thì LLM hầu như làm đúng.
- Lỗi ngoài Jansen là lỗi lắp ráp / ràng buộc:
  - watt6 haiku không render;
  - watt6 sonnet: vòng 2 hở;
  - planetary_s5: Zs+Zr=100 không thoả Zr=Zs+2Zp.

## Kết quả 2 — VLM một lượt trên 44 sim mới
- Kết quả: TP 7, FN 1 (planetary_s5: sai số răng, nhìn không ra), **FP 4** (cả 4 là geneva).
- Probe marker xác nhận các geneva đó đúng (72°/vòng). Tức VLM "thấy" lỗi ở chuyển động gián đoạn vốn đúng.
- Bất ổn: VLM vòng 0 của rep2 nói "correct" cho geneva_s2, planetary_s1 và planetary_s5. Trong đó geneva_s2 là file mà VLM pha 2 đã bắt.

## Kết quả 3 — sửa lặp K=3 (số file PASS oracle sau vòng r)
| nhánh | rep1 r0→r3 (n=8) | rep2 r0→r3 (n=15) |
|---|---|---|
| oracle_spec | 0 → 6 → **8 → 8** | 1 → 11 → **15 → 15** |
| oracle_coarse | 0 → 3 → 3 → 3 | 1 → 6 → 8 → 8 |
| vlm | 0 → 2 → 2 → 2 | 1 → 4 → 4 → 4 |
| none (self-refine) | 0 → 3 → 3 → 3 | 1 → 4 → 4 → 4 |

Cách đọc bảng:
- Ở rep2, file đã pass từ r0 là geneva_s2. Lỗi khoá đĩa của nó là lỗi **oracle không thấy được**, như ở pha 4. Phần dưới loại file này, nên còn 22 lượt file có lỗi oracle thấy được: 14 Jansen, 8 ngoài Jansen.
- oracle_spec: **22/22**, gồm Jansen 14/14 và ngoài Jansen 8/8. Mọi file pass trong ≤ 2 vòng, khớp ở cả 2 lần lặp.
- oracle_coarse: **10/22** (Jansen 2/14, ngoài Jansen 8/8).
- vlm: **5/22** (Jansen 0/14, ngoài Jansen 5/8).
- none (self-refine): **6/22** (Jansen 0/14, ngoài Jansen 6/8).
- Pha 4 để so sánh: 6/6, 4/6, 2/6, 0/6. Thứ tự giữa các nhánh **lặp lại** ở cả 2 rep và ở pha 4.

## Nhận xét
1. **Độ khó tách đôi rõ.**
   - Lỗi lắp ráp/ràng buộc (watt6, planetary, four_bar crash) phần lớn tự sửa được với bất kỳ tín hiệu nào, kể cả không có tín hiệu: none 6/8.
   - Lỗi **tri thức thiết kế** (bộ "holy numbers" Jansen bị gán lệch thanh) chỉ sửa được khi oracle nói **thanh nào** sai, tức oracle_spec 14/14. Có thông tin "sai bao nhiêu" mà không có "ở đâu" thì oracle_coarse chỉ được 2/14. VLM và self-refine đều 0/14.
2. **Agent sửa tự tin dựa vào trí nhớ sai.**
   - Ở nhánh coarse và none, agent lặp lại khẳng định "len khớp holy numbers đã công bố" trong khi chính bộ số bị gán lệch. Nhiều agent còn nói lỗi do "checker map sai" hoặc do "spec", trong khi spec không quy định độ dài.
   - Ví dụ: rep1 vlm/haiku/jansen_s5 chứng minh đúng rằng hình học không lắp ráp được, nhưng đổ lỗi cho spec.
   - Hai agent nhánh coarse (sonnet) suy ngược được thanh sai từ chính con số sai số (0.52 ≈ 55.8/36.7−1). Đây là con đường duy nhất để coarse sửa được Jansen.
3. **VLM làm nhánh vlm dừng sớm sai.**
   - 12 lần dừng vì "vlm says correct" (rep1 4, rep2 8). Phần lớn là file vẫn trượt oracle.
   - planetary_s5 (sai số răng) không bao giờ được VLM nhận ra. Vì vậy trên nhóm ngoài Jansen, nhánh vlm (5/8) còn kém self-refine (6/8).
4. **Có dấu hiệu "lách" oracle.**
   - rep2 coarse/haiku/jansen_s1 r3 tự thừa nhận đặt marker trực tiếp từ điểm đã giải để "che" sai lệch.
   - Bản đó vẫn trượt DESIGN nên không thành PASS giả. Tuy vậy, cần thêm kiểm mesh↔marker trước khi viết bài.
5. **Vi phạm quy tắc**: 1/155 lượt sửa (rep2 vlm/sonnet/jansen_s1 r2) đã chạy lệnh Python, dù prompt cấm. Lượt đó vẫn được giữ trong số liệu, và trượt oracle ở r3 (LOAD).

## Hệ quả cho bài báo
- RQ3 vững hơn:
  - n tăng từ 6 lên 22 lượt file;
  - 2 lần lặp độc lập cho cùng thứ tự: spec > coarse > none ≈ vlm;
  - phân tích theo loại lỗi cho câu chuyện rõ: **phản hồi định vị (localized) từ oracle là thứ quyết định với lỗi tri thức thiết kế**.
- Giới hạn cần nói thẳng:
  - lỗi tự nhiên ngoài Jansen hiếm (5/50);
  - cam không sinh lỗi tự nhiên nào, nên phần "sửa" trên cam chỉ dựa vào mutant.

## Hạn chế
- Hai lần lặp có chung file khởi đầu, nên khác biệt giữa rep chỉ đến từ tính ngẫu nhiên của agent sửa.
- 14/22 lượt là Jansen, nên kết quả nghiêng về một cơ cấu.
- Chưa có kiểm định thống kê: n nhỏ, mỗi file là một cặp so sánh, nên phù hợp McNemar hoặc Cochran Q khi mở rộng.
- Agent sửa không được chạy code. Đây là thiết kế có chủ ý để tách nguồn thông tin, nhưng làm self-refine yếu hơn thực tế.

## Bổ sung: kiểm mesh ↔ marker (audit sau, 2026-11-10)
- Script `oracle/audit_mesh.mjs` lấy 60 mẫu trên một vòng quay. Với mỗi marker `<part>@<point>`, nó đo:
  - **drift**: vị trí marker trong hệ toạ độ cục bộ của mesh thuộc part đó có đổi theo thời gian không (0 nghĩa là marker gắn cứng với hình vẽ);
  - **gap**: khoảng cách XY từ marker tới đỉnh mesh gần nhất của part.
- **Oracle hiện tại có lỗ hổng thật.** Mutant `mutants/audit/four_bar_gamed.html` vẽ thanh truyền lệch tới 0.3 rad, nhưng mỗi frame lại đặt lại `coupler@B` về đúng vị trí đã giải. Bản này **PASS oracle-lite**, còn audit bắt được (drift 41 mm, gap 34 mm).
- Đã chạy audit trên **toàn bộ 109 file PASS** (gen_lite5, cùng bản cuối của pha 4, rep1 và rep2): **drift = 0 ở cả 109 file**, không file nào lỗi tải.
  - Gap lớn chỉ xuất hiện ở các điểm tâm không có hình học: `ring@C`, tâm cam và trục `@O`, và điểm rãnh của geneva.
  - Như vậy **không có PASS giả do lách marker** trong mọi số liệu đã báo cáo. Agent ở rep2 coarse/haiku/jansen_s1 r3 có thử, nhưng bản đó vẫn trượt DESIGN.
- Đề xuất cho bài báo: đưa "drift ≤ 0.5 mm" vào oracle thành một kiểm tra META ("markers rigidly attached to the part's geometry"). Thêm kiểm tra này không đổi kết quả nào đã có, vì cả 109 file đều đạt.

# Pha 6 — ablation mức cụ thể của feedback: "ở đâu" vs "ở đâu + giá trị đúng" (2026-11-13)

## Thiết kế
- Nhánh mới **oracle_locate**: dùng đúng diagnostics của oracle_spec nhưng **bỏ mọi giá trị đúng**:
  - holy numbers: bỏ bộ số đã công bố, bỏ "expected …", bỏ hệ số scale; chỉ giữ danh sách `len.*` sai, gợi ý "looks swapped with len.*" và câu "fixed pivot X is misplaced";
  - GT: giữ marker, thời điểm, vị trí đang vẽ; bỏ vị trí lời giải;
  - PANEL: bỏ giá trị đúng.
  - Các diagnosis không chứa giá trị đúng (khớp không trùng, PARAM, điều kiện lắp planetary, loop không đóng) giữ nguyên.
- Code: `locateDetail()` trong `oracle/iter_repair.mjs`, chọn nhánh bằng env `ARMS=oracle_locate`.
- Cùng 22 lượt file như pha 5: `iter5/abl1` = 8 file của rep1, `iter5/abl2` = 14 file của rep2 (bỏ geneva_s2). K=3, luật dừng như oracle_spec (chỉ dừng khi PASS hoặc hết vòng). Tổng 40 lượt sửa.

## Kết quả (số file PASS oracle sau vòng r)
| | r0 | r1 | r2 | r3 |
|---|---|---|---|---|
| abl1 (n=8) | 0 | 4 | 5 | **5** |
| abl2 (n=14) | 0 | 8 | 9 | **9** |

Gộp 22 lượt, so với pha 5 (cùng file, cùng K):
| nhánh | ngoài Jansen (8) | Jansen sonnet (6) | Jansen haiku (8) | tổng (22) |
|---|---|---|---|---|
| oracle_spec (ở đâu + giá trị) | 8/8 | 6/6 | **8/8** | **22/22** |
| **oracle_locate (chỉ ở đâu)** | 8/8 | **6/6** | **0/8** | **14/22** |
| oracle_coarse (tên check + độ lệch) | 8/8 | 2/6 | 0/8 | 10/22 |
| none (self-refine) | 6/8 | 0/6 | 0/8 | 6/22 |
| vlm | 5/8 | 0/6 | 0/8 | 5/22 |

- Audit mesh↔marker trên 14 file PASS mới: drift 0 ở cả 14 (`results/audit_mesh_abl.jsonl`) → không PASS giả.

## Nhận xét
1. **Thông tin "ở đâu" đủ cho sonnet, không đủ cho haiku.** Với Jansen, locate đưa sonnet từ 2/6 (coarse) lên 6/6 — bằng spec. Gợi ý "looks swapped with" cho sonnet biết cặp nào cần đổi, và sonnet nhớ đủ bộ số để hoàn tất. Haiku 0/8 ở locate nhưng 8/8 ở spec: haiku cần chính **giá trị đúng**.
2. **Cơ chế thất bại của haiku là trí nhớ sai, không phải thiếu định vị.**
   - 9/40 lượt trả NO_CHANGE, tất cả là haiku Jansen, đều khẳng định "len khớp holy numbers đã công bố" và đổ lỗi cho checker ("checker artifact", "report may be unreliable").
   - Các lượt CHANGED của haiku thay một số sai bằng số sai khác: dùng 7.8 (độ lệch dọc của X) làm chiều dài YV hoặc làm |OX|, đặt X ở (−7.8, 15), giữ OZ = 38.
   - Một agent bác bỏ đúng cặp hoán đổi oracle gợi ý vì nó làm crank "non-Grashof" — tính đúng, nhưng dựa trên OZ = 38 sai.
3. **Lỗi ngoài Jansen không cần giá trị đúng**: 8/8 ở cả spec, locate, coarse. Với lỗi lắp ráp/ràng buộc, biết check nào trượt là đủ.
4. **Diagnosis holy numbers (đã kiểm lại 11-13, xem mục "Sửa oracle")**: scale ước lượng bằng median(len/H) lệch ở **1/53** bộ tham số Jansen đã chấm (abl2 haiku jansen_s4: 0,967 thay vì 1,000). Lời phàn nàn "báo cáo gắn cờ OZ = 15" của agent abl1 haiku jansen_s5 r3 là **agent đọc nhầm**: báo cáo về bản hiện tại không nhắc OZ; OZ = 38 chỉ có trong báo cáo vòng 1.

## Hệ quả cho bài báo
- Có thể phát biểu bậc thang thông tin rõ ràng: **có/không lỗi < tên check + độ lệch < vị trí lỗi < vị trí + giá trị đúng**, và ngưỡng cần thiết phụ thuộc năng lực tri thức của model sửa (sonnet đủ ở "vị trí", haiku cần "giá trị").
- Hàm ý thiết kế: oracle nên trả về giá trị tham chiếu khi có (tri thức thiết kế công bố), vì đó là thứ bù cho trí nhớ sai của model nhỏ.

## Hạn chế
- Hiệu ứng model gắn hoàn toàn với Jansen (lỗi tri thức thiết kế duy nhất có đủ mẫu). Cần thêm một cơ cấu có "con số công bố" khác để tách hiệu ứng khỏi một cơ cấu.
- Chưa kiểm định thống kê; so sánh cặp spec vs locate trên haiku Jansen là 8/8 vs 0/8 (McNemar chính xác p ≈ 0.008), nhưng các file không độc lập hoàn toàn (abl1 ⊂ abl2 cùng file gốc).
- Vẫn chỉ hai model cùng hãng; model hãng khác vẫn bị chặn (không có API key).


# Sửa oracle: scale holy numbers + kiểm drift chính thức (2026-11-13)

## Thay đổi
1. **Verdict holy numbers** (`holyMinimax`): trước đây scale neo vào OZ (`len.OZ/15`), không khớp định nghĩa "cho phép một tỉ lệ đều". Nay dùng scale minimax trên 13 tỉ số (11 khâu + 2 độ lệch chốt X): sai số = (rmax − rmin)/(rmax + rmin). Giá trị này luôn ≤ giá trị cũ, nên không PASS nào thành FAIL.
2. **Diagnosis holy numbers** (`holyScale`): scale đồng thuận — chọn ứng viên s = len_i/H_j sao cho nhiều độ dài vẽ ra trùng *một* holy number nhất (sai lệch ≤ 3%); hoà thì ưu tiên nhiều khâu trùng đúng số của mình; tinh chỉnh bằng median trên các khâu trùng. Chịu được hoán vị khâu và giá trị lạ (7.8, 15). Đã thử phương án ghép cặp sau sắp xếp: hỏng khi model chèn giá trị không thuộc bộ holy (scale 0,934, gắn cờ lại OZ = 15) → bỏ.
   - Trên 53 bộ tham số Jansen đã chấm: diagnosis chỉ đổi ở 1 bộ (abl2 haiku jansen_s4: scale 1,000; thêm cờ XY 40,1 vs 41,5 và gợi ý hoán đổi XW↔YV).
3. **Kiểm META "markers attached to part geometry"** đưa vào `run_oracle_lite.mjs` (mã probe dùng chung `oracle/drift.mjs`, `audit_mesh.mjs` import lại): drift của marker trong hệ toạ độ mesh của part ≤ 0,5 mm × scale, lấy 24 mẫu/chu kỳ; bỏ qua marker trên part không có mesh; lỗi probe không bao giờ làm fail oracle.

## Chấm lại toàn bộ dữ liệu (661 verdict: gen_lite5, reference_lite, repair pha 3, mọi snapshot r0–r3 của iter, iter5/rep1, rep2, abl1, abl2, mutant lite5 và mutant gian lận)
- **660/661 verdict y hệt**, kể cả tập họ lỗi (fails) của từng file.
- File duy nhất đổi: `mutants/audit/four_bar_gamed.html` PASS → **FAIL [META]** (drift 41 mm) — đúng mục tiêu đóng lỗ hổng.
- 7/7 mutant lite5 vẫn bị bắt; 6/6 tham chiếu lite vẫn PASS.
- → Mọi số liệu pha 2–6 trong báo cáo này **không đổi** dưới oracle mới. Dữ liệu: `results/regrade_list.json` (verdict cũ), `results/regrade_v2.jsonl` (verdict mới).
