# Pilot — LLM mechanical-simulator oracles

Kế hoạch gốc: `../novelty_gate.md` mục 6 "Pilot tối thiểu". Bắt đầu 2026-11-08.

## Tiến độ (checkpoint)
- [x] Hạ tầng: Playwright (từ `~/.claude/skills/teardown/node_modules`) + Chrome hệ thống (`channel:'chrome'`), three r186 copy vào `vendor/`.
- [x] Spec 4 cơ cấu + ground truth giải tích (`oracle/mechs.mjs`)
- [x] Hợp đồng sinh rút gọn (`contract.md`) + script dựng prompt (`oracle/make_prompt.mjs`)
- [x] 4 simulator tham chiếu viết tay (`reference/`) — oracle phải PASS hết (kiểm false positive)
- [x] Oracle v0 (`oracle/run_oracle.mjs`): determinism, periodicity, pose vs giải tích, joint closure, panel
- [x] Mutants (`mutants/`) + đo oracle bắt được
- [ ] Sinh simulator bằng LLM (`gen/<model>/<mech>_s<k>.html`)
- [ ] Baseline VLM trên contact sheet (`sheets/`, `vlm/`)
- [ ] Repair loop (oracle-feedback vs VLM-feedback)
- [ ] Báo cáo `REPORT.md` + tiêu chí GO tiếp

- Kết quả tạm: 4/4 reference PASS (sai số ~1e-14); 24/24 mutant bị bắt (`results/mutants.jsonl`). Sheet VLM: 12 khung/chu kỳ input (8 khung bỏ lỡ pha ăn khớp Geneva).

## Quyết định / sai lệch so với kế hoạch
- Không có API key đọc được trên máy → sinh simulator bằng subagent Claude trong Claude Code (model `sonnet` và `haiku`). Ghi ở Threats: subagent có system prompt của Claude Code, không phải gọi API thô; chưa có model hãng khác.
- Hợp đồng rút gọn ép quy ước hệ toạ độ/tên body/khung local, để oracle không phải khử pha/tỉ lệ (rủi ro 4 trong novelty gate). Đổi lại bài toán sinh bị ràng buộc hơn teardown gốc → ghi ở Threats.

## Cách chạy lại
```
node oracle/run_oracle.mjs reference/*.html          # phải PASS
node oracle/run_oracle.mjs gen/*/*.html --out results/gen.jsonl
```
