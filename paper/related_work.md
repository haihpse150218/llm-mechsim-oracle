# Related work — tổng hợp định vị (2026-11-13)

Nguồn chi tiết: `rw_testing.md` (34 mục, phía kiểm thử) và `rw_repair.md` (42 mục, phía sửa lỗi), do 2 agent tìm. Từng mục đã được xác minh qua Crossref, arXiv hoặc trang hội nghị. BibTeX gộp: `references.bib` (79 khoá, không trùng). Cùng với `novelty_gate.md` mục 2 (14 công trình LLM→code 3D/vật lý), đây là toàn bộ phần related work.

**Kiểm chéo độc lập** (tự tra Crossref, arXiv hoặc trang hội nghị, không dựa vào báo cáo của agent): `barr2015oracle`, `molina2025oracle`, `waldvogel2026blockdiagram`, `xia2024chatrepair`, `fan2023repairllm`, `olausson2024selfrepair`, `han2025convcodeworld`, `pan2025gfr` đều khớp tiêu đề, venue, năm và tác giả. Riêng tiêu đề bài ISSE của Waldvogel có hậu tố "– Extended Version"; đã sửa trong `.bib`.

**Phải kiểm lại trước khi nộp**:
- 18 mục chỉ xác minh qua arXiv, venue lấy từ comment "accepted to"; cần tra trang/DOI chính thức.
- 5 preprint chưa có venue; 6 mục chỉ có metadata, chưa đọc abstract (danh sách ở `rw_testing.md`).
- Vài con số chưa kiểm: ablation feedback cụ thể vs chung của Self-Refine, DOI/trang của CodeHalu, volume/trang TSE của Crupi et al., trang ACCV của "VLMs are blind".

---

## Mục 8 của bài: sáu nhánh và câu định vị

### (a) Bài toán oracle và tự động hoá oracle
`barr2015oracle` (survey chuẩn; khung derived/implicit/specified oracle) → `molina2025oracle` (TOSEM 2025: tự động hoá oracle thời LLM, kèm lý do không nên để LLM làm oracle) → `dinella2022toga`, `hossain2023neural` (oracle/assertion sinh bằng mạng nơ-ron) → `ernst2001daikon`, `meyer1992dbc` (bất biến, hợp đồng).
**Định vị**: oracle của bài là *derived oracle* lấy từ chính tham số mà simulator khai báo (`SIM.params`), cộng luật thiết kế miền. Không cần viết contract tay cho từng task, cũng không dùng LLM làm oracle.

### (b) Metamorphic testing và kiểm thử phần mềm mô phỏng/đồ hoạ
`chen2018metamorphic`, `segura2016survey` (hai survey MT) → `kanewala2014scientific` (phần mềm khoa học) → `zhou2019driverless` (MT cho xe tự lái) → `li2025physicsfailures` (lỗi physics engine, preprint) → `taesiri2024glitchbench` (VLM kém nhận ra glitch game).
**Định vị**: nhóm META của oracle (tất định theo thứ tự gọi, tuần hoàn, độ cứng khâu, khớp trùng) chính là các quan hệ metamorphic suy từ hợp đồng `render(t)` thuần. Điểm mới là áp vào code mô phỏng *do LLM sinh*, không phải vào engine.

### (c) Kiểm thử code do LLM sinh ngoài unit test
`liu2023evalplus` (test yếu chấp nhận nhầm code sai) → `chen2022codet` / `chen2023codet` (LLM sinh test) → `vikram2023pbt`, `maaz2025agenticpbt` (property-based testing với LLM) → `endres2024nl2postcond` (hậu điều kiện từ ngôn ngữ tự nhiên) → `tambon2025bugs` (lỗi trong code LLM).
**Định vị**: simulator 3D không có unit test, và đúng/sai ở đây là đúng/sai động học. Oracle đóng vai bộ test đủ mạnh mà EvalPlus cho thấy là cần thiết.

### (d) V&V mô hình mô phỏng (systems engineering)
`sargent2013vv`, `balci1997vva`, `kleijnen1995vv`.
**Định vị**: Sargent liệt kê "animation" như một kỹ thuật V&V. VLM review contact sheet chính là phiên bản tự động hoá của kỹ thuật này, nên baseline VLM được đặt đúng vào khung V&V truyền thống. Oracle là bản tự động hoá của kỹ thuật "so với lời giải giải tích".

### (e) LLM tự sửa và sửa bằng phản hồi; APR trong SE
- **Self-repair, self-correction**: `olausson2024selfrepair` (ICLR 2024: chất lượng feedback là nút thắt), `huang2024cannot` và `kamoi2024selfcorrection` (không có feedback ngoài thì tự sửa không hiệu quả), `madaan2023selfrefine`, `shinn2023reflexion`, `gou2024critic`.
- **Mức chi tiết feedback**: `han2025convcodeworld` (ICLR 2025: model yếu + feedback giàu thắng model mạnh không feedback), `dai2025feedbackeval`, `wang2024mint`, `zheng2025multiturn`, `zhang2023selfedit`, `zhong2024ldb`.
- **APR ở venue SE**: `xia2024chatrepair` (ISSTA 2024: hội thoại + test fail, dừng khi pass), `fan2023repairllm` (ICSE 2023: sửa code do LLM sinh; thông tin vị trí lỗi có ích), `xia2022alpharepair`, `zhang2024autocoderover`, `yang2024sweagent`, `xia2025agentless`, `bouzenia2025repairagent`.
- **Gần nhất với RQ4**: `pan2025gfr` (DL4C workshop @ ICLR 2025). Nhóm này thay độ mạnh model ở từng vai sinh/feedback/sửa và thấy feedback giúp model yếu nhiều hơn. Nhưng feedback do LLM viết, nên mức cụ thể không được kiểm soát; không có oracle ground truth và không có điều kiện dừng theo oracle.

**Định vị (luận điểm novelty của RQ3–RQ4)**: chưa tìm thấy công trình nào làm cả bốn việc sau cùng lúc:
1. dùng **một oracle tất định** và phát phản hồi ở các mức chi tiết được kiểm soát (vị trí + giá trị đúng / chỉ vị trí / tên check + độ lệch);
2. so các mức đó với VLM-in-the-loop và self-refine;
3. **dừng vòng sửa theo verdict của oracle**;
4. cho thấy **tương tác model × mức thông tin**: model nhỏ cần giá trị đúng, model lớn chỉ cần vị trí (Fisher p = 1,3e-5, xem `pilot/stats/STATS.md`).

Từng mảnh đã có riêng lẻ; sự kết hợp và phát hiện tương tác là mới. Câu viết trong bài nên là "đối chứng có kiểm soát", không phải "lần đầu dùng feedback để sửa".

### (f) LLM/VLM làm giám khảo và lỗi tri thức miền
- **Giám khảo**: `zheng2023judging`, `wang2024notfair` (thiên lệch của LLM-judge), `chen2024mllmjudge` (ICML 2024: MLLM-as-a-judge), `rahmanzadehgervi2024blind` (VLM "mù" với hình học đơn giản), `crupi2025llmjudgecode` và `wang2025llmjudgese` (LLM-judge đánh giá sai độ đúng của code; model nhỏ gần như không đánh giá được).
- **Ảo giác tri thức**: `liu2026codehallucination`, `zhang2025hallucpractical`, `tian2025codehalu`, `spracklen2025package`, `jain2024apihallucination`, `xu2024knowledgeconflicts`, `xiong2024uncertainty`.

**Định vị**: kết quả VLM của bài (VLM nói "correct" 12 lần trong khi oracle còn fail; báo nhầm ở Geneva; recall rơi khi ẩn panel) khớp với văn liệu về giám khảo đa phương thức không đáng tin. Hiện tượng "agent khẳng định sai holy numbers rồi đổ lỗi cho checker" là một dạng ảo giác tri thức miền mà oracle phát hiện được, còn self-refine thì không.

### (g) Bài đăng trên ISSE (để reviewer thấy bài thuộc phạm vi tạp chí)
`waldvogel2026blockdiagram` (gần nhất: kiểm xem hình hiển thị có khớp mô hình không), `schieferdecker2026ai4se` (phân loại AI4SE), `hermawan2026log` (LLM đọc log test của digital twin), `kumari2026vimsuit` (kiểm thử UI bằng thị giác), `graics2026gamma` (sinh test dựa trên mô hình), `priya2022verifying`, `aitwakrime2022editorial`.
Chưa tìm thấy bài ISSE nào về metamorphic testing, oracle cho code LLM hay V&V simulator. Đây là khoảng trống để nêu trong cover letter.

---

## Việc tiếp theo cho phần related work
- Đọc toàn văn `pan2025gfr`, `han2025convcodeworld`, `olausson2024selfrepair` trước khi viết đoạn RQ4, vì đây là ba bài reviewer dễ đem ra so nhất.
- Kiểm lại 18 mục chỉ có arXiv (venue, DOI).
- Khoảng trống chưa tìm: differential testing giữa các renderer WebGL; MT cho game engine ở venue SE bình duyệt (chưa thấy bài nào).
