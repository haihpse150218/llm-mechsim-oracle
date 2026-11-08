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
