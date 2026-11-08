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
