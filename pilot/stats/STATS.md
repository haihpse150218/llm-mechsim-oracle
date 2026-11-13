# Thống kê pilot (sinh bởi `stats/stats.mjs`, 2026-11-13)

Đơn vị: một lượt file (file lỗi × lần lặp). Mọi nhánh chạy trên cùng các lượt nên so sánh theo cặp. Kết quả = PASS oracle sau ≤ 3 vòng.
Pha 5 + pha 6: 22 lượt (rep1 8 + rep2 14, bỏ geneva_s2). Pha 7: 6 lượt lambda (không có nhánh VLM).
**Lưu ý phụ thuộc**: rep1 và rep2 dùng chung 8 file gốc (rep2 ⊃ rep1), nên các lượt không độc lập hoàn toàn; mục "Độ nhạy" chỉ dùng mỗi file gốc một lần.

## RQ3 — sửa lặp: 5 nhánh trên 22 lượt (pha 5–6)

### Tất cả lỗi oracle-thấy-được, pha 5–6 (n = 22 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 22/22 (100%) | [85, 100] |
| locate | 14/22 (64%) | [43, 80] |
| coarse | 10/22 (45%) | [27, 65] |
| vlm | 5/22 (23%) | [10, 43] |
| none | 6/22 (27%) | [13, 48] |

Cochran's Q = 44.47, df = 4, p = 5.1e-9

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 8 | 0 | 0.008 | 0.047 |
| spec vs coarse | 12 | 0 | 4.9e-4 | 0.004 |
| spec vs vlm | 17 | 0 | 1.5e-5 | 1.5e-4 |
| spec vs none | 16 | 0 | 3.1e-5 | 2.7e-4 |
| locate vs coarse | 4 | 0 | 0.125 | 0.375 |
| locate vs vlm | 9 | 0 | 0.004 | 0.027 |
| locate vs none | 8 | 0 | 0.008 | 0.047 |
| coarse vs vlm | 5 | 0 | 0.063 | 0.250 |
| coarse vs none | 4 | 0 | 0.125 | 0.375 |
| vlm vs none | 1 | 2 | 1.000 | 1.000 |

### Lỗi lắp ráp/ràng buộc (ngoài Jansen) (n = 8 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 8/8 (100%) | [68, 100] |
| locate | 8/8 (100%) | [68, 100] |
| coarse | 8/8 (100%) | [68, 100] |
| vlm | 5/8 (63%) | [31, 86] |
| none | 6/8 (75%) | [41, 93] |

Cochran's Q = 8.89, df = 4, p = 0.064

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 0 | 0 | 1.000 | 1.000 |
| spec vs coarse | 0 | 0 | 1.000 | 1.000 |
| spec vs vlm | 3 | 0 | 0.250 | 1.000 |
| spec vs none | 2 | 0 | 0.500 | 1.000 |
| locate vs coarse | 0 | 0 | 1.000 | 1.000 |
| locate vs vlm | 3 | 0 | 0.250 | 1.000 |
| locate vs none | 2 | 0 | 0.500 | 1.000 |
| coarse vs vlm | 3 | 0 | 0.250 | 1.000 |
| coarse vs none | 2 | 0 | 0.500 | 1.000 |
| vlm vs none | 1 | 2 | 1.000 | 1.000 |

### Jansen (tri thức thiết kế) (n = 14 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 14/14 (100%) | [78, 100] |
| locate | 6/14 (43%) | [21, 67] |
| coarse | 2/14 (14%) | [4, 40] |
| vlm | 0/14 (0%) | [0, 22] |
| none | 0/14 (0%) | [0, 22] |

Cochran's Q = 40.94, df = 4, p = 2.8e-8

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 8 | 0 | 0.008 | 0.055 |
| spec vs coarse | 12 | 0 | 4.9e-4 | 0.004 |
| spec vs vlm | 14 | 0 | 1.2e-4 | 0.001 |
| spec vs none | 14 | 0 | 1.2e-4 | 0.001 |
| locate vs coarse | 4 | 0 | 0.125 | 0.500 |
| locate vs vlm | 6 | 0 | 0.031 | 0.188 |
| locate vs none | 6 | 0 | 0.031 | 0.188 |
| coarse vs vlm | 2 | 0 | 0.500 | 1.000 |
| coarse vs none | 2 | 0 | 0.500 | 1.000 |
| vlm vs none | 0 | 0 | 1.000 | 1.000 |

## RQ4 — mức cụ thể của phản hồi trên lỗi tri thức thiết kế

### Lambda (pha 7) (n = 6 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 6/6 (100%) | [61, 100] |
| locate | 1/6 (17%) | [3, 56] |
| coarse | 1/6 (17%) | [3, 56] |
| none | 1/6 (17%) | [3, 56] |

Cochran's Q = 15.00, df = 3, p = 0.002

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 5 | 0 | 0.063 | 0.375 |
| spec vs coarse | 5 | 0 | 0.063 | 0.375 |
| spec vs none | 5 | 0 | 0.063 | 0.375 |
| locate vs coarse | 0 | 0 | 1.000 | 1.000 |
| locate vs none | 0 | 0 | 1.000 | 1.000 |
| coarse vs none | 0 | 0 | 1.000 | 1.000 |

### Gộp Jansen + lambda, haiku (n = 13 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 13/13 (100%) | [77, 100] |
| locate | 0/13 (0%) | [0, 23] |
| coarse | 0/13 (0%) | [0, 23] |
| none | 0/13 (0%) | [0, 23] |

Cochran's Q = 39.00, df = 3, p = 1.7e-8

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 13 | 0 | 2.4e-4 | 0.001 |
| spec vs coarse | 13 | 0 | 2.4e-4 | 0.001 |
| spec vs none | 13 | 0 | 2.4e-4 | 0.001 |
| locate vs coarse | 0 | 0 | 1.000 | 1.000 |
| locate vs none | 0 | 0 | 1.000 | 1.000 |
| coarse vs none | 0 | 0 | 1.000 | 1.000 |

### Gộp Jansen + lambda, sonnet (n = 7 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 7/7 (100%) | [65, 100] |
| locate | 7/7 (100%) | [65, 100] |
| coarse | 3/7 (43%) | [16, 75] |
| none | 1/7 (14%) | [3, 51] |

Cochran's Q = 14.73, df = 3, p = 0.002

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 0 | 0 | 1.000 | 1.000 |
| spec vs coarse | 4 | 0 | 0.125 | 0.500 |
| spec vs none | 6 | 0 | 0.031 | 0.188 |
| locate vs coarse | 4 | 0 | 0.125 | 0.500 |
| locate vs none | 6 | 0 | 0.031 | 0.188 |
| coarse vs none | 2 | 0 | 0.500 | 1.000 |

### Tương tác model × nhánh trên lỗi tri thức thiết kế (Fisher exact, sonnet vs haiku)

| arm | sonnet | haiku | Fisher p |
|---|---|---|---|
| spec | 7/7 (100%) | 13/13 (100%) | 1.000 |
| locate | 7/7 (100%) | 0/13 (0%) | 1.3e-5 |
| coarse | 3/7 (43%) | 0/13 (0%) | 0.031 |
| none | 1/7 (14%) | 0/13 (0%) | 0.350 |

## Độ nhạy — mỗi file gốc chỉ một lần (rep2 + lambda; bỏ rep1, abl1)

### Tất cả, mỗi file một lần (4 nhánh chung) (n = 20 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 20/20 (100%) | [84, 100] |
| locate | 10/20 (50%) | [30, 70] |
| coarse | 8/20 (40%) | [22, 61] |
| none | 4/20 (20%) | [8, 42] |

Cochran's Q = 33.36, df = 3, p = 2.7e-7

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 10 | 0 | 0.002 | 0.008 |
| spec vs coarse | 12 | 0 | 4.9e-4 | 0.002 |
| spec vs none | 16 | 0 | 3.1e-5 | 1.8e-4 |
| locate vs coarse | 2 | 0 | 0.500 | 0.500 |
| locate vs none | 6 | 0 | 0.031 | 0.094 |
| coarse vs none | 4 | 0 | 0.125 | 0.250 |

### Tri thức thiết kế, haiku, mỗi file một lần (n = 10 file-runs)

| arm | PASS | 95% Wilson CI (%) |
|---|---|---|
| spec | 10/10 (100%) | [72, 100] |
| locate | 0/10 (0%) | [0, 28] |
| coarse | 0/10 (0%) | [0, 28] |
| none | 0/10 (0%) | [0, 28] |

Cochran's Q = 30.00, df = 3, p = 1.4e-6

| pair | A only | B only | exact McNemar p | Holm p |
|---|---|---|---|---|
| spec vs locate | 10 | 0 | 0.002 | 0.012 |
| spec vs coarse | 10 | 0 | 0.002 | 0.012 |
| spec vs none | 10 | 0 | 0.002 | 0.012 |
| locate vs coarse | 0 | 0 | 1.000 | 1.000 |
| locate vs none | 0 | 0 | 1.000 | 1.000 |
| coarse vs none | 0 | 0 | 1.000 | 1.000 |

## RQ1 — tỉ lệ lỗi tự nhiên

| tập | lỗi | 95% Wilson CI (%) |
|---|---|---|
| pha 1, spec chi tiết | 0/8 (0%) | [0, 32] |
| pha 2, spec-lite | 7/16 (44%) | [23, 67] |
| pha 5, spec-lite (60 sim) | 14/60 (23%) | [14, 35] |
| pha 5, ngoài Jansen | 5/50 (10%) | [4, 21] |
| pha 7, lambda | 6/10 (60%) | [31, 83] |
| pha 7, peaucellier | 0/10 (0%) | [0, 28] |

Spec chi tiết (0/8) vs spec-lite (7/16): Fisher p = 0.054.
Lambda haiku (5/5) vs sonnet (1/5): Fisher p = 0.048.

## RQ2 — VLM so với oracle trên 24 mutant pha 1 (theo cặp mutant)

| so sánh (n = 24 mutant) | chỉ A bắt | chỉ B bắt | exact McNemar p |
|---|---|---|---|
| oracle vs VLM có panel | 4 | 0 | 0.125 |
| VLM có panel vs ẩn panel | 8 | 2 | 0.109 |
| oracle vs VLM ẩn panel | 10 | 0 | 0.002 |
