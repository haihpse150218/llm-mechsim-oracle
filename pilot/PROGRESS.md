# Pilot — LLM mechanical-simulator oracles

Kế hoạch gốc: `../novelty_gate.md` mục 6 "Pilot tối thiểu". Bắt đầu 2026-11-08.

## Tiến độ (checkpoint)
- [x] Hạ tầng: Playwright (từ `~/.claude/skills/teardown/node_modules`) + Chrome hệ thống (`channel:'chrome'`), three r186 copy vào `vendor/`.
- [x] Spec 4 cơ cấu + ground truth giải tích (`oracle/mechs.mjs`)
- [x] Hợp đồng sinh rút gọn (`contract.md`) + script dựng prompt (`oracle/make_prompt.mjs`)
- [x] 4 simulator tham chiếu viết tay (`reference/`) — oracle phải PASS hết (kiểm false positive)
- [x] Oracle v0 (`oracle/run_oracle.mjs`): determinism, periodicity, pose vs giải tích, joint closure, panel
- [x] Mutants (`mutants/`) + đo oracle bắt được
- [x] Sinh simulator bằng LLM — chỉ s1 (8 file), tất cả PASS; dừng s2–s5 vì spec quá chi tiết (xem REPORT.md)
- [x] Baseline VLM: 28 sheet ẩn danh; recall 20/24, báo nhầm 0/4
- [ ] Repair loop — bỏ qua: không có simulator tự nhiên nào lỗi để sửa
- [x] Báo cáo `REPORT.md`: NO-GO theo tiêu chí; đề xuất pivot spec-lite + ablation VLM (chờ Hải quyết)

- Kết quả tạm: 4/4 reference PASS (sai số ~1e-14); 24/24 mutant bị bắt (`results/mutants.jsonl`). Sheet VLM: 12 khung/chu kỳ input (8 khung bỏ lỡ pha ăn khớp Geneva).

## Quyết định / sai lệch so với kế hoạch
- Không có API key đọc được trên máy → sinh simulator bằng subagent Claude trong Claude Code (model `sonnet` và `haiku`). Ghi ở Threats: subagent có system prompt của Claude Code, không phải gọi API thô; chưa có model hãng khác.
- Hợp đồng rút gọn ép quy ước hệ toạ độ/tên body/khung local, để oracle không phải khử pha/tỉ lệ (rủi ro 4 trong novelty gate). Đổi lại bài toán sinh bị ràng buộc hơn teardown gốc → ghi ở Threats.

## Cách chạy lại
```
node oracle/run_oracle.mjs reference/*.html          # phải PASS
node oracle/run_oracle.mjs gen/*/*.html --out results/gen.jsonl
```

## Pha 2 — pivot (Hải chọn hướng 1, 2026-11-08)
- [x] Hợp đồng lite (marker `<part>@<point>`, `SIM.params`), prompt 4 cơ cấu: four_bar, geneva, jansen, planetary (`oracle/mechs_lite.mjs`, `specs_lite/`)
- [x] Sinh 16 simulator lite (sonnet/haiku × 2 mẫu) → `gen_lite/<model>/<mech>_s<k>.html`
- [x] Oracle lite (`oracle/run_oracle_lite.mjs`) + 4 reference lite PASS
- [x] Ablation VLM: 28 sheet cũ ẩn panel → `vlm_nopanel/`
- [x] VLM trên 16 simulator lite (15 render được)
- [x] Cập nhật REPORT.md (mục pha 2): GO theo tiêu chí (a), đóng khung lại thành "oracle + VLM bổ sung nhau"
Tiêu chí: lỗi tự nhiên ≥20% ở (a) HOẶC VLM bỏ sót ≥30% ở (b) → GO lại; cả hai trượt → NO-GO.

- Kết quả tạm pha 2: lỗi tự nhiên 6/16 (37,5%) đã kiểm tay là lỗi thật; ablation không panel: VLM recall 14/24 (bỏ PANEL: 14/20). Đang chạy VLM trên 19 sheet lite (`vlm_lite/`).

## Pha 3 — RQ3 repair loop (2026-11-08)
- [x] `oracle/repair_prep.mjs`: 7 file lỗi × 3 nhánh feedback (oracle | vlm | none) → `repair/<arm>/<model>/<file>.html` + `.feedback.md`
- [x] 21 agent sửa (model = model đã sinh file), 1 vòng, sửa tại chỗ
- [x] Chấm: oracle-lite trên `repair/*/*/*.html`; VLM ẩn danh trên bản đã sửa; kiểm tay geneva_s2 (đĩa khoá)
- [x] Cập nhật REPORT.md mục RQ3 (3/7 mỗi nhánh; đề xuất sửa lặp có cổng oracle + feedback cụ thể)

## Pha 4 — RQ3b: sửa lặp có cổng oracle (2026-11-10)
Thiết kế: 7 file lỗi gốc (gen_lite) × 4 nhánh × tối đa K=3 vòng, người sửa = model đã sinh file, mỗi vòng là agent mới đọc spec + file + toàn bộ lịch sử feedback.
- oracle_spec: oracle gate + feedback cụ thể (oracle thêm trường `detail`: cặp khâu nào sai/đổi chỗ, khớp nào hở ở t nào, toạ độ vẽ vs lời giải). Tiêu chí pass/fail KHÔNG đổi (ref 4/4 PASS, gen_lite y hệt pha 2).
- oracle_coarse: oracle gate + feedback kiểu pha 3 (tên kiểm, số đo, dung sai) → tách hiệu ứng "lặp" khỏi "cụ thể".
- vlm: VLM ẩn danh review mỗi vòng (vòng 0 dùng review pha 2), dừng khi VLM nói "correct".
- none: self-refine, dừng khi người sửa trả NO_CHANGE.
Mọi vòng đều chấm bằng oracle cho mọi nhánh (`iter/results/r<k>.jsonl`), chỉ nhánh oracle được thấy.
Chạy: `node oracle/iter_repair.mjs prep | grade <r> | plan <r> | vlm-prep <r> | summary`; prompt: `iter/PROMPT.md`, `node iter/prompts.mjs <r>`.
- [x] prep, grade 0, plan 0 → 25 tác vụ vòng 1
- [x] vòng 1 sửa (25 agent) → grade 1: oracle_spec 5/6, coarse 3/6, vlm 2/6, none 0/6 (chưa tính geneva_s2)
- [x] vlm review r1 (correct: four_bar, sonnet jansen_s2, geneva_s2 [nhưng đĩa khoá giờ không còn khuyết → đè bánh khi ăn khớp, kiểm tay: ~]) → plan 1: 9 tác vụ vòng 2
- [x] vòng 2 (9 agent) → grade 2: oracle_spec 6/6, coarse 4/6, vlm 2/6, none 0/6 (none dừng hết)
- [x] vlm review r2 (2/3 nói correct nhưng oracle fail) → vòng 3 (3 agent) → grade 3, plan 3 (dừng hết)
- [x] kiểm tay geneva_s2 (vlm = none, sửa một phần); REPORT.md pha 4. Kết quả cuối: oracle_spec 6/6 (7 lượt), coarse 4/6 (11), vlm 2/6 (10+9), none 0/6 (9)

## Pha 5 — mở rộng n + cơ cấu ngoài Jansen (Hải chọn hướng 1, 2026-11-10)
Kế hoạch: thêm cam (cần cam đĩa + cần đẩy con lăn tịnh tiến, cycloidal rise-dwell-return-dwell, góc áp lực ≤30°, không undercut) và watt6 (Watt II, 2 vòng 4 khâu nối tiếp, góc truyền 30–150°). 5 mẫu/ô cho cả 6 cơ cấu (sinh thêm s3–s5 cho 4 cơ cấu cũ) → 60 simulator. Sau đó: VLM review trên mẫu mới, sửa lặp K=3 trên các file lỗi mới, 2 lần lặp/nhánh.
- [x] Spec cam, watt6 (`oracle/lite_specs.mjs` → `specs_lite/`); spec cũ không đổi
- [x] Oracle: kiểm cam (lift vs cycloidal + chẩn đoán harmonic/ngược/lệch hằng/trễ pha, tiếp xúc con lăn–lưới cam qua đỉnh mesh, góc áp lực, undercut), watt6 (lắp ráp 2 vòng dày 720 điểm, góc truyền 2 vòng, B/C/D vs lời giải, panel)
- [x] Tham chiếu cam/watt6 PASS; 6 ref lite PASS; gen_lite y hệt pha 2 (6 fail)
- [x] Mutant `mutants/lite5/` 7/7 bị bắt (harmonic, biên dạng ngược chiều quay, Rb nhỏ, lệch gốc nâng, watt kẹt vòng 2, đổi nhánh, góc truyền)
- [x] Sinh 20 (cam, watt6 × s1–s5 × sonnet/haiku) + 24 (4 cơ cấu cũ × s3–s5 × 2 model) → `results/gen_lite5.jsonl` (60 file): lỗi tự nhiên 14/60; Jansen 9/10, ngoài Jansen 5/50 (cam 0/10, watt6 2/10, planetary 2/10, four_bar 1/10, geneva 0/10). Lỗi mới kiểm tay đều thật (watt6: haiku trang trống, sonnet vòng 2 hở; planetary_s5 Zs+Zr=100)
- [x] VLM ẩn danh trên 44 mẫu mới (`vlm_lite5/`): TP 7, FN 1 (planetary_s5 Zs+Zr), FP 4 (geneva — kiểm marker s0: bánh quay đúng 72°/vòng, VLM hiểu nhầm vì sheet chỉ 1 vòng), TN 32
- [ ] Sửa lặp: iter5/rep1 = 8 file lỗi mới; iter5/rep2 = 8 mới + 7 cũ (pha 4 = rep1 của 7 cũ)
  - Hạ tầng sửa lặp: `ITER_DIR=iter5/repN` + `<ITER_DIR>/faulty.json`; `iter/taskfiles.mjs <r>` ghi prompt đầy đủ ra `<file>.task<r>.md` (agent chỉ nhận "đọc và làm theo file"); rep2 có VLM vòng 0 chạy mới (`iter5/rep2/vlm/r0`), rep1 dùng `vlm_lite5`.
  - [x] rep1 r1 (31 tác vụ) → grade: oracle_spec 7/8 → ..., rep1 plan 1 → 17 tác vụ vòng 2
  - [x] rep2 r1 (55 tác vụ) → grade 1; VLM r1 rep2 (12) đang chạy
  - Quan sát: self-refine NO_CHANGE kèm khẳng định sai ("lengths match holy numbers", four_bar_s2 crash nhưng "nothing wrong"); VLM r0 rep2 nói correct cho geneva_s2 (pha 2 bắt được) → không ổn định.
  - RUNBOOK (tiếp tục sau khi ngắt): mỗi rep R∈{rep1,rep2}, vòng r:
    1) đợi đủ reply: `node -e "const t=require('./iter5/R/tasks_r<r>.json');const fs=require('fs');console.log(t.filter(x=>!fs.existsSync(x.reply)).map(x=>x.reply))"`
    2) `ITER_DIR=iter5/R node oracle/iter_repair.mjs grade <r>`; `... vlm-prep <r>`; ghi task VLM: copy `iter5/rep1/vlm/r1/inputs/jansen-6ff40be1.task.md`, thay mech/dir/id (xem lệnh node đã dùng); chạy agent sonnet "Read this file and follow its instructions exactly: <task.md>"
    3) `... plan <r>` → `ITER_DIR=iter5/R node iter/taskfiles.mjs <r+1>` → agent (model theo dòng) "Read this file and follow its instructions exactly (it is your whole task): <pilot>/iter5/R/<arm>/<model>/<file>.task<r+1>.md"
    4) r=3: grade 3, plan 3 (dừng hết), `summary`. Max 20 agent đồng thời.
  - Trạng thái 11:40: rep1 r2 (17 tác vụ) đang chạy; rep2 r2 (28) đã mở 6 (spec haiku j3,j5,j1,j2; coarse haiku j3,j4), còn 22 từ coarse/haiku/jansen_s5.
  - Trạng thái 11-10 (phiên mới): rep2 r2 đã chấm; rep2 vlm/r2 (8 review) đang chạy; rep1 plan 2 → 10 tác vụ r3 đang chạy. Ghi chú: agent rep2 vlm/sonnet/jansen_s1 r2 đã chạy lệnh Python (vi phạm "không chạy lệnh").
  - [x] PHA 5 XONG (11-10): rep1+rep2 chấm đủ r3, summary tại iter5/rep*/summary.json, REPORT.md mục "Pha 5". Gộp (bỏ geneva_s2 oracle-invisible): spec 22/22, coarse 10/22, vlm 5/22, none 6/22; Jansen: 14/2/0/0 trên 14.
