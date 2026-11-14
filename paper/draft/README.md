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
2. ~~Mã định danh model và ngày chạy~~ — xong: `claude-sonnet-5-5`, `claude-haiku-5-5`, 8–13/11/2026 (lấy từ transcript của subagent Claude Code; mỗi model chỉ có đúng một phiên bản). Trợ lý lập trình và viết là `claude-opus-5-5`, đã khai trong mục "Use of LLMs". **Tác giả cần đọc lại câu khai báo này.**
3. ~~URL repo công khai~~: xong, https://github.com/haihpse150218/llm-mechsim-oracle (13/11). Repo được tách từ thư mục này bằng `git subtree split`, giữ nguyên lịch sử. Muốn cập nhật repo thì chạy `bash publish_public.sh` (tách thư mục, đặt tác giả là haihpse150218, bỏ dòng Co-Authored-By rồi push). Không push `mechsim-export` trực tiếp nữa, vì GitHub sẽ hiện lại Claude là contributor. DOI Zenodo: 10.5281/zenodo.24201916 (v1.1-submission, có pha 8 DeepSeek; bản v1.0-submission là 10.5281/zenodo.24187717), bản ghi chung cho mọi phiên bản: 10.5281/zenodo.24187716; đã điền vào bài. Giấy phép: mã theo MIT, dữ liệu và văn bản theo CC BY 4.0. Muốn có DOI mới thì tạo release mới trên GitHub.
4. ~~Model hãng khác~~: đã làm phần sinh (pha 8, DeepSeek v4-pro / flash, Jansen + lambda, n=5), ghi trong Design, Results ("Another vendor") và Threats. Phần sửa lặp với hãng khác không chạy (tốn tiền) và được nêu là hạn chế.
5. ~~Chuyên gia cơ khí rà bộ DESIGN rules~~: không làm; đã nêu là hạn chế trong Threats.
6–7. ~~Hoàn thiện bib~~ — xong ngày 13/11, chi tiết trong `../bib_check.md`.
   - Đã kiểm 14 mục được trích có vấn đề:
     - 4 mục nay đã có venue: Self-Debug (ICLR 2024), InteractScience (ICML 2026), CodeHallucination (TSE 2026), SGA (Findings of EMNLP 2026).
     - WorldCoder: được nhận ở NeurIPS 2026, chưa có số trang.
     - 7 mục vẫn chỉ là preprint; đã điền đủ tác giả và DOI arXiv.
   - Đã đối chiếu DOI trên Crossref: TSE, SGA và bài lambda.
   - Lambda giờ trích bài Miler et al., SV-JME 2022. Bài này xác nhận tay quay 100, nền 200, các khâu 250; việc khâu nào là coupler và khâu nào là đoạn kéo dài chỉ thể hiện trên hình, và bài không ghi AP = 5. Nếu cần nguồn giáo trình thì xem Artobolevsky hoặc Hartenberg & Denavit ở thư viện.
   - Jansen giờ trích sách *The Great Pretender* (2007). 11 con số chưa được đối chiếu trên trang sách nào.
   - Còn 36 khoá khác chưa kiểm lại lần hai.
8. ~~Hình~~ — xong, đều đọc được khi in đen trắng:
   - Hình 1 `figures/oracle.tex` (TikZ): pipeline của oracle.
   - Hình 2 `figures/loop.tex` (TikZ): vòng sửa và các nhánh phản hồi.
   - Hình 3 `figures/jansen.pdf`: quỹ đạo chân của bộ số công bố so với file `sonnet/jansen_s1` (hoán đổi VU/WU và UT/WT). Hình này sinh bằng `python figures/make_fig_jansen.py`, dùng đúng cách giải và nhánh lắp của oracle.
   Sau khi sửa `draft/`, chạy `node sync_overleaf.mjs` để chép sang `overleaf/`.
9. Đọc toàn văn Pan et al., ConvCodeWorld, Olausson et al. để chắc đoạn so sánh trong Discussion/Related đúng.
10. Biên dịch, sửa lỗi LaTeX, kiểm bảng `table*` trong bố cục 2 cột.
