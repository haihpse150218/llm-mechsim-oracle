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
