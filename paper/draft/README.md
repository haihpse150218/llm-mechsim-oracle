# Bản thảo 1 (2026-11-13) — ISSE

**Trạng thái**: bản thảo đầu đủ mọi mục, khoảng 7.000 chữ (không tính bảng và tài liệu tham khảo; ISSE không giới hạn độ dài). **Đã biên dịch** (2026-11-13, MiKTeX 25.12, pdflatex): 17 trang, không lỗi, không overfull, không tham chiếu thiếu. Dùng thư mục `../overleaf/` (bản phẳng, có kèm `sn-jnl.cls` và `sn-mathphys-num.bst` lấy từ template chính thức của Springer Nature, tháng 12/2024). Trích dẫn dạng số theo Guide của ISSE. Cách build: `pdflatex main; bibtex main; pdflatex main; pdflatex main` trong `paper/overleaf/`, hoặc dùng LaTeX Workshop trong VS Code. Muốn đưa lên Overleaf thì upload `../mechsim_draft_overleaf.zip` bằng New Project → Upload Project.
Khi sửa bản thảo: sửa trong `draft/`, chạy `node make_tables.mjs`, rồi chép `sections/` và `tables/` sang `overleaf/`. Bảng chỉ sinh ra trong `draft/tables`.

## Cấu trúc
- `main.tex`: `sn-jnl` với `[pdflatex,sn-basic,iicol]`; tham khảo lấy từ `../references.bib` và `llm3d.bib`.
- `sections/*.tex`: abstract (247 từ, trong khoảng 150–250), introduction, background, approach, design (gồm mục "Use of large language models" mà ISSE bắt buộc), results, discussion, threats, related, conclusion, declarations ("Statements and Declarations").
- `tables/*.tex`: **sinh tự động** bởi `node make_tables.mjs` từ `pilot/results`, `pilot/iter5`, `pilot/stats/stats.json`. Không sửa bằng tay; Bảng 1 (các họ kiểm) viết tay trong `approach.tex`.
- `check_refs.mjs`: kiểm mọi `\cite` có trong `.bib` và mọi `\ref` có `\label` (lần chạy gần nhất: 50 khoá, 15 tham chiếu, không thiếu).

## Đã kiểm số liệu khi viết
Mọi con số trong văn bản đều được đối chiếu với REPORT.md, `stats/STATS.md` hoặc dữ liệu gốc. Các chỗ đã phát hiện và sửa ngay trong lúc viết:
- abstract từng nói "VLM không bao giờ phát hiện" lỗi Jansen → sai, đã sửa;
- số mutant: 39, không phải 31;
- số lượt sửa: khoảng 300 (đếm file trả lời: 277 + 21 của pha 3);
- sai số tham chiếu cam là 5e-4 mm, không phải dưới 1e-12;
- kích thước oracle: 1.060 dòng; module mỗi cơ cấu 27–90 dòng;
- số file PASS được audit drift: 146;
- câu NO_CHANGE của self-refine trên Jansen: 17/17 tuyên bố file đúng, 10/17 nói rõ "khớp holy numbers".

## TODO trước khi nộp (cũng được đánh dấu `\todo{}` màu đỏ trong văn bản)
1. Tên tác giả, đơn vị, email (`main.tex`); funding, đóng góp tác giả (`declarations.tex`).
2. **Mã định danh chính xác của model** (Sonnet/Haiku) và ngày chạy (`design.tex`).
3. URL repo công khai và DOI Zenodo (`introduction.tex`, `declarations.tex`).
4. Model hãng khác (Threats; hiện bị chặn vì chưa có API key).
5. Chuyên gia cơ khí rà bộ DESIGN rules (Threats).
6. Hoàn thiện `llm3d.bib`: danh sách tác giả đầy đủ, venue cuối cùng; thay nguồn Wikipedia của lambda bằng giáo trình; thêm nguồn chính thức cho holy numbers.
7. Kiểm venue/DOI của 18 mục chỉ có arXiv trong `references.bib`.
8. Hình: (1) Jansen đúng/sai — quỹ đạo chân + khung hình; (2) pipeline oracle; (3) vòng sửa và các nhánh phản hồi. Chưa vẽ; văn bản hiện chỉ dùng bảng. Hình phải đọc được khi in đen trắng.
9. Đọc toàn văn Pan et al., ConvCodeWorld, Olausson et al. để chắc đoạn so sánh trong Discussion/Related đúng.
10. Biên dịch, sửa lỗi LaTeX, kiểm bảng `table*` trong bố cục 2 cột.
