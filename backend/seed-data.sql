-- ============================================================
-- NihongoFlow — Seed data đầy đủ N5 → N1
-- Cấu trúc quiz: 4 từ vựng + 3 nội dung + 3 trình tự sự kiện
-- Chạy: mysql -u nihongo -p123456 nihongoflow < seed-data.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE user_lesson_progress;
TRUNCATE TABLE user_streaks;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE questions;
TRUNCATE TABLE quizzes;
TRUNCATE TABLE lessons;
TRUNCATE TABLE courses;
TRUNCATE TABLE levels;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Levels ──────────────────────────────────────────────────
INSERT INTO levels (id, name, description, order_index) VALUES
(1, 'N5', 'Trình độ sơ cấp — Hiragana, Katakana, ~800 từ vựng cơ bản', 1),
(2, 'N4', 'Sơ trung cấp — Ngữ pháp mở rộng, ~1500 từ vựng', 2),
(3, 'N3', 'Trung cấp — Đọc báo đơn giản, ~3000 từ vựng', 3),
(4, 'N2', 'Trung cao cấp — Tiếng Nhật thực tế trong công việc, ~6000 từ vựng', 4),
(5, 'N1', 'Cao cấp — Thành thạo tiếng Nhật, ~10000 từ vựng', 5);

-- ── Courses ─────────────────────────────────────────────────
INSERT INTO courses (id, level_id, title, description, thumbnail_url, order_index) VALUES
(1,  1, 'Bảng chữ cái tiếng Nhật',
 'Học Hiragana và Katakana từ đầu, nền tảng của mọi kỹ năng tiếng Nhật.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400', 1),
(2,  1, 'Giao tiếp cơ bản N5',
 'Các mẫu câu chào hỏi, giới thiệu bản thân và hội thoại hằng ngày.',
 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=400', 2),
(3,  2, 'Ngữ pháp N4 căn bản',
 'Các cấu trúc ngữ pháp quan trọng ở trình độ N4: て form, potential form...',
 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400', 1),
(4,  2, 'Từ vựng và Kanji N4',
 'Hệ thống 300 Kanji N4, cách đọc âm On/Kun và ứng dụng trong văn cảnh.',
 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400', 2),
(5,  3, 'Ngữ pháp N3 — Cấu trúc câu phức',
 'Nắm vững các mẫu ngữ pháp phức tạp: ために、ように、のに, điều kiện giả định...',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', 1),
(6,  3, 'Từ vựng và Kanji N3',
 'Học 650 Kanji N3 qua chủ đề: công việc, sức khỏe, xã hội. Luyện đọc đoạn ngắn.',
 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=400', 2),
(7,  4, 'Ngữ pháp N2 nâng cao',
 'Chinh phục các cấu trúc ngữ pháp N2: にもかかわらず、に反して、に対して...',
 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400', 1),
(8,  4, 'Đọc hiểu văn bản N2',
 'Luyện đọc bài báo, email công việc, văn bản học thuật ở trình độ N2.',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400', 2),
(9,  5, 'Ngữ pháp và từ vựng N1',
 'Các cấu trúc ngữ pháp đặc trưng N1: văn phong trang trọng, biểu đạt tinh tế.',
 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400', 1),
(10, 5, 'Đọc và nghe hiểu N1',
 'Luyện đọc văn học, nghị luận, nghe tin tức và hội thoại phức tạp cấp N1.',
 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400', 2);

-- ── Lessons ─────────────────────────────────────────────────
INSERT INTO lessons (id, course_id, title, video_url, duration, order_index) VALUES
(1,  1, 'Hiragana — Hàng あ (a, i, u, e, o)',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 596, 1),
(2,  1, 'Hiragana — Hàng か đến さ',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 654, 2),
(3,  1, 'Katakana — Tổng quan và cách nhớ nhanh',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 600, 3),
(4,  2, 'Xin chào — はじめまして và cách giới thiệu bản thân',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 540, 1),
(5,  2, 'Hỏi thăm — おげんきですか và trả lời',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 480, 2),
(6,  2, 'Mua sắm — Hỏi giá, số đếm và giao dịch hằng ngày',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 510, 3),
(7,  3, 'て form — Cách chia và ứng dụng',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 734, 1),
(8,  3, 'Potential form — Diễn đạt khả năng làm gì',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 600, 2),
(9,  3, 'Câu điều kiện — たら và ば',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 620, 3),
(10, 4, 'Kanji N4 — Nhóm thiên nhiên và thời tiết',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 560, 1),
(11, 4, 'Kanji N4 — Nhóm hành động hằng ngày',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 580, 2),
(12, 5, 'Mẫu câu ために (Mục đích) và ように (Mục tiêu)',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 680, 1),
(13, 5, 'Câu giả định — ば、なら và sự khác biệt',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 720, 2),
(14, 5, 'Biểu đạt hoàn tất — てしまう、ておく、てみる',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 650, 3),
(15, 6, 'Kanji N3 — Nhóm xã hội và kinh tế',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 700, 1),
(16, 6, 'Luyện đọc đoạn văn N3 — Chủ đề cuộc sống',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 740, 2),
(17, 7, 'Ngữ pháp N2 — にもかかわらず (Mặc dù... vẫn)',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 800, 1),
(18, 7, 'Ngữ pháp N2 — に反して và に対して',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 760, 2),
(19, 8, 'Đọc email công việc và văn bản hành chính N2',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 820, 1),
(20, 8, 'Kỹ thuật đọc báo tiếng Nhật — Skimming và Scanning',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 780, 2),
(21, 9, 'Ngữ pháp N1 — Văn phong trang trọng をもって、いかんによって',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 900, 1),
(22, 9, 'Thành ngữ và tục ngữ Nhật N1',
 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', 840, 2),
(23, 10, 'Nghe hiểu hội thoại tốc độ cao — Chiến lược và luyện tập',
 'https://media.w3.org/2010/05/bunny/trailer.mp4', 860, 1),
(24, 10, 'Đọc văn học và văn nghị luận N1',
 'https://media.w3.org/2010/05/video/movie_300.mp4', 820, 2);

-- ── Quizzes ─────────────────────────────────────────────────
INSERT INTO quizzes (id, lesson_id, pass_score) VALUES
(1,1,70),(2,2,70),(3,3,70),(4,4,70),(5,5,70),(6,6,70),
(7,7,70),(8,8,70),(9,9,70),(10,10,70),(11,11,70),(12,12,70),
(13,13,70),(14,14,70),(15,15,70),(16,16,70),(17,17,75),(18,18,75),
(19,19,75),(20,20,75),(21,21,80),(22,22,80),(23,23,80),(24,24,80);

-- ── Questions ───────────────────────────────────────────────
-- Cấu trúc bắt buộc mỗi quiz:
--   order_index 1-4 : VOCABULARY  (4 câu từ vựng)
--   order_index 5-7 : CONTENT     (3 câu nội dung video)
--   order_index 8-10: SEQUENCE    (3 câu trình tự sự kiện)

INSERT INTO questions (quiz_id, content, options, correct_option, order_index, question_type) VALUES

-- ══════════════════════════════════════════════════════════════
-- QUIZ 1 — Hiragana hàng あ
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(1,'Chữ あ đọc là gì?','["a","i","u","e"]',0,1,'VOCABULARY'),
(1,'Chữ い đọc là gì?','["a","i","u","e"]',1,2,'VOCABULARY'),
(1,'Chữ う đọc là gì?','["a","i","u","e"]',2,3,'VOCABULARY'),
(1,'Chữ え đọc là gì?','["a","i","u","e"]',3,4,'VOCABULARY'),
-- CONTENT
(1,'Hàng あ trong Hiragana gồm bao nhiêu chữ cái?','["3","4","5","6"]',2,5,'CONTENT'),
(1,'Hiragana được phát triển từ thế kỷ nào?','["Thế kỷ 7","Thế kỷ 9","Thế kỷ 11","Thế kỷ 13"]',1,6,'CONTENT'),
(1,'Hiragana được phát triển từ loại chữ nào?','["Chữ Hán","Chữ Katakana","Chữ Romaji","Chữ Hangul"]',0,7,'CONTENT'),
-- SEQUENCE
(1,'Thứ tự đúng của hàng あ từ đầu đến cuối là?','["あいうえお","いあうえお","うえおあい","おえういあ"]',0,8,'SEQUENCE'),
(1,'Trong video, giáo viên giới thiệu hàng あ theo thứ tự nào?','["Viết → Phát âm → Ví dụ","Phát âm → Viết → Ví dụ","Ví dụ → Phát âm → Viết","Ví dụ → Viết → Phát âm"]',0,9,'SEQUENCE'),
(1,'Để học thuộc hàng あ hiệu quả, bước nào thực hiện đầu tiên theo bài học?','["Luyện viết tay","Nghe và nhắc lại phát âm","Tra từ điển","Làm bài tập"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 2 — Hiragana hàng か đến さ
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(2,'Chữ か đọc là gì?','["sa","ka","ta","na"]',1,1,'VOCABULARY'),
(2,'Chữ き đọc là gì?','["ka","ki","ku","ke"]',1,2,'VOCABULARY'),
(2,'Chữ さ đọc là gì?','["ka","sa","ta","na"]',1,3,'VOCABULARY'),
(2,'Chữ し đọc là gì?','["sa","si","shi","su"]',2,4,'VOCABULARY'),
-- CONTENT
(2,'Hàng か gồm bao nhiêu chữ cái?','["3","4","5","6"]',2,5,'CONTENT'),
(2,'Âm "shi" thuộc hàng nào trong bảng Hiragana?','["Hàng か","Hàng さ","Hàng た","Hàng な"]',1,6,'CONTENT'),
(2,'Chữ く có nét viết đặc trưng nào so với các chữ khác trong hàng か?','["Nét ngang","Nét cong hình chữ V","Nét đứng thẳng","Nét tròn"]',1,7,'CONTENT'),
-- SEQUENCE
(2,'Thứ tự đúng hàng か là?','["かきくけこ","きかくけこ","くけこかき","かけくきこ"]',0,8,'SEQUENCE'),
(2,'Trong video, hàng nào được dạy trước?','["Hàng さ","Hàng か","Dạy cùng lúc","Không rõ"]',1,9,'SEQUENCE'),
(2,'Sau khi học xong hàng か, bài học chuyển sang hàng nào tiếp theo?','["Hàng た","Hàng な","Hàng さ","Hàng は"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 3 — Katakana tổng quan
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(3,'Chữ Katakana ア đọc là gì?','["a","i","u","e"]',0,1,'VOCABULARY'),
(3,'Chữ Katakana イ đọc là gì?','["a","i","u","e"]',1,2,'VOCABULARY'),
(3,'Chữ Katakana ウ đọc là gì?','["a","i","u","e"]',2,3,'VOCABULARY'),
(3,'Chữ Katakana カ đọc là gì?','["a","i","ka","sa"]',2,4,'VOCABULARY'),
-- CONTENT
(3,'Katakana thường được dùng để viết loại từ nào?','["Từ thuần Nhật","Từ Hán-Nhật","Từ ngoại lai (tiếng nước ngoài)","Tên địa danh Nhật"]',2,5,'CONTENT'),
(3,'Điểm khác biệt về hình dáng giữa Hiragana và Katakana là?','["Katakana có nét cong hơn","Katakana có nét thẳng, góc cạnh hơn","Hai bộ giống hệt nhau","Katakana có nhiều chữ hơn"]',1,6,'CONTENT'),
(3,'Tổng số chữ cơ bản trong bảng Katakana là bao nhiêu?','["36","46","56","66"]',1,7,'CONTENT'),
-- SEQUENCE
(3,'Thứ tự đúng hàng ア trong Katakana là?','["アイウエオ","イアウエオ","ウエオアイ","オエウイア"]',0,8,'SEQUENCE'),
(3,'Video giới thiệu Katakana theo trình tự nào?','["So sánh với Hiragana → Học từng chữ → Luyện từ ngoại lai","Học từng chữ → So sánh → Luyện tập","Luyện từ ngoại lai trước → Học chữ → So sánh","Không có trình tự cụ thể"]',0,9,'SEQUENCE'),
(3,'Bước cuối cùng trong bài học Katakana theo video là?','["Học hàng ア","So sánh Hiragana-Katakana","Luyện đọc từ ngoại lai thực tế","Học âm ghép"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 4 — はじめまして và giới thiệu bản thân
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(4,'"はじめまして" nghĩa là gì?','["Tạm biệt","Xin chào (lần đầu gặp mặt)","Cảm ơn","Xin lỗi"]',1,1,'VOCABULARY'),
(4,'"わたし" nghĩa là gì?','["Tôi","Bạn","Anh ấy","Chúng tôi"]',0,2,'VOCABULARY'),
(4,'"です" có vai trò gì trong câu?','["Động từ hành động","Trợ từ chủ đề","Động từ liên kết (là/thì)","Phó từ"]',2,3,'VOCABULARY'),
(4,'"どうぞよろしく" nghĩa là gì?','["Tạm biệt","Rất vui được gặp — nhờ quan tâm","Cảm ơn nhiều","Xin lỗi"]',1,4,'VOCABULARY'),
-- CONTENT
(4,'Cấu trúc câu giới thiệu tên đầy đủ bằng tiếng Nhật là?','["わたしは〜です","〜はわたしです","です〜わたしは","わたしが〜だ"]',0,5,'CONTENT'),
(4,'"はじめまして" chỉ được dùng trong hoàn cảnh nào?','["Gặp nhau mỗi ngày","Lần đầu tiên gặp mặt","Sau khi chia tay","Khi cảm ơn"]',1,6,'CONTENT'),
(4,'Trong video, sau khi nói "はじめまして" người ta thường nói gì ngay tiếp theo?','["ありがとう","さようなら","〜と申します (tên của tôi là)","おはよう"]',2,7,'CONTENT'),
-- SEQUENCE
(4,'Thứ tự đúng khi tự giới thiệu lần đầu là?','["はじめまして → Tên → どうぞよろしく","Tên → はじめまして → どうぞよろしく","どうぞよろしく → Tên → はじめまして","Tên → どうぞよろしく → はじめまして"]',0,8,'SEQUENCE'),
(4,'Trong hội thoại, sau khi người A tự giới thiệu xong thì điều gì xảy ra tiếp theo?','["Người A tiếp tục nói","Người B cũng tự giới thiệu lại","Kết thúc hội thoại","Người B nói ありがとう"]',1,9,'SEQUENCE'),
(4,'Bước nào xuất hiện CUỐI CÙNG trong màn chào hỏi lần đầu theo video?','["はじめまして","Nói tên","どうぞよろしくおねがいします","Giới thiệu nghề nghiệp"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 5 — おげんきですか và hỏi thăm
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(5,'"おげんき" nghĩa là gì?','["Thời tiết","Sức khỏe / Khỏe mạnh","Hạnh phúc","Bận rộn"]',1,1,'VOCABULARY'),
(5,'"はい" nghĩa là gì?','["Vâng / Có","Không","Tạm tạm","Rất"]',0,2,'VOCABULARY'),
(5,'"まあまあ" nghĩa là gì?','["Rất tốt","Không tốt","Tạm tạm / Bình thường","Tệ lắm"]',2,3,'VOCABULARY'),
(5,'"いいえ" nghĩa là gì?','["Vâng","Không","Cảm ơn","Xin lỗi"]',1,4,'VOCABULARY'),
-- CONTENT
(5,'"おげんきですか" là câu hỏi về điều gì?','["Tên của bạn","Sức khỏe của bạn","Công việc của bạn","Tuổi của bạn"]',1,5,'CONTENT'),
(5,'Câu trả lời đầy đủ và lịch sự khi bạn đang khỏe là?','["はい、まあまあです","はい、おかげさまで、げんきです","いいえ、げんきです","げんきではありません"]',1,6,'CONTENT'),
(5,'"おかげさまで" trong câu trả lời mang ý nghĩa gì?','["Rất khỏe","Nhờ ơn bạn (thể hiện sự khiêm tốn)","Không khỏe lắm","Bình thường"]',1,7,'CONTENT'),
-- SEQUENCE
(5,'Hội thoại hỏi thăm diễn ra theo thứ tự nào?','["Chào → Hỏi thăm sức khỏe → Trả lời → Hỏi ngược lại","Hỏi thăm → Chào → Trả lời","Trả lời → Hỏi thăm → Chào","Chào → Trả lời → Hỏi thăm"]',0,8,'SEQUENCE'),
(5,'Sau khi trả lời "げんきです", điều gì thường xảy ra tiếp theo trong hội thoại?','["Kết thúc cuộc trò chuyện","Hỏi ngược lại: あなたは？","Nói tạm biệt","Đổi chủ đề ngay"]',1,9,'SEQUENCE'),
(5,'Trong video, các mẫu câu được giới thiệu theo thứ tự nào?','["Câu hỏi → Trả lời khẳng định → Trả lời phủ định","Trả lời → Câu hỏi","Câu phủ định → Câu hỏi → Câu khẳng định","Không có thứ tự"]',0,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 6 — Mua sắm N5
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(6,'"いくら" nghĩa là gì?','["Bao nhiêu tiền?","Ở đâu?","Cái gì?","Khi nào?"]',0,1,'VOCABULARY'),
(6,'"えん" là gì?','["Đô la Mỹ","Đồng Won Hàn Quốc","Đồng Yên Nhật","Bảng Anh"]',2,2,'VOCABULARY'),
(6,'"たかい" nghĩa là gì?','["Rẻ","Đắt","To lớn","Mới"]',1,3,'VOCABULARY'),
(6,'"やすい" nghĩa là gì?','["Đắt","To","Rẻ","Cũ"]',2,4,'VOCABULARY'),
-- CONTENT
(6,'Câu hỏi giá đầy đủ bằng tiếng Nhật là?','["これはなんですか","これはいくらですか","これはどこですか","いくらがこれですか"]',1,5,'CONTENT'),
(6,'"ください" trong mua sắm có nghĩa là?','["Cảm ơn","Xin cho tôi / Tôi muốn mua","Bao nhiêu tiền","Không cần"]',1,6,'CONTENT'),
(6,'"ひゃく" có nghĩa là bao nhiêu?','["10","50","100","1000"]',2,7,'CONTENT'),
-- SEQUENCE
(6,'Quy trình mua hàng tại cửa hàng Nhật theo đúng thứ tự là?','["Vào cửa hàng → Hỏi giá → Quyết định → Trả tiền → Cảm ơn","Hỏi giá → Vào cửa hàng → Mua → Tạm biệt","Trả tiền → Hỏi giá → Vào cửa hàng","Cảm ơn → Hỏi giá → Trả tiền"]',0,8,'SEQUENCE'),
(6,'Trong video, nội dung được trình bày theo thứ tự nào?','["Từ vựng số đếm → Hỏi giá → Giao dịch thực tế","Giao dịch → Từ vựng → Số đếm","Số đếm → Giao dịch → Hỏi giá","Không có thứ tự cụ thể"]',0,9,'SEQUENCE'),
(6,'Sau khi hỏi giá và quyết định mua, bước tiếp theo trong video là?','["Nói tạm biệt","Hỏi giá thêm","Đưa tiền và nhận hàng","Xem thêm sản phẩm khác"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 7 — て form
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(7,'て form của "たべる" (ăn) là gì?','["たべた","たべて","たべます","たべない"]',1,1,'VOCABULARY'),
(7,'て form của "のむ" (uống) là gì?','["のみて","のんで","のむて","のんだ"]',1,2,'VOCABULARY'),
(7,'て form của "かく" (viết) là gì?','["かくて","かいて","かって","かけて"]',1,3,'VOCABULARY'),
(7,'て form của "いく" (đi) là gì?','["いきて","いいて","いって","いくて"]',2,4,'VOCABULARY'),
-- CONTENT
(7,'て form dùng để làm gì trong câu?','["Diễn đạt phủ định","Nối hai hành động liên tiếp","Hỏi về khả năng","Ra lệnh mạnh"]',1,5,'CONTENT'),
(7,'Động từ nhóm 1 có đuôi "く" thì て form đổi thành gì?','["いで","いて","くて","きて"]',1,6,'CONTENT'),
(7,'"〜てください" có nghĩa là gì?','["Đừng làm điều đó","Hãy làm điều đó (yêu cầu lịch sự)","Tôi đã làm điều đó","Có thể làm điều đó"]',1,7,'CONTENT'),
-- SEQUENCE
(7,'Video dạy て form theo thứ tự nhóm động từ nào?','["Nhóm 1 → Nhóm 2 → Nhóm đặc biệt","Nhóm 2 → Nhóm 1 → Nhóm đặc biệt","Nhóm đặc biệt → Nhóm 1 → Nhóm 2","Tất cả cùng một lúc"]',0,8,'SEQUENCE'),
(7,'Để tạo て form của động từ nhóm 1, bước nào thực hiện ĐẦU TIÊN?','["Thêm て vào cuối","Xác định âm cuối của động từ","Bỏ ます","Tra từ điển"]',1,9,'SEQUENCE'),
(7,'Sau khi học て form cơ bản, bài học giới thiệu ứng dụng nào tiếp theo?','["Chia thể phủ định","Nối nhiều hành động trong một câu","Học potential form","Học thể た"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 8 — Potential form
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(8,'"できる" nghĩa là gì?','["Muốn làm","Có thể làm","Phải làm","Không làm"]',1,1,'VOCABULARY'),
(8,'Potential form của "たべる" (ăn) là gì?','["たべれる","たべられる","たべできる","たべえる"]',1,2,'VOCABULARY'),
(8,'Potential form của "よむ" (đọc) là gì?','["よめる","よまれる","よみれる","よめます"]',0,3,'VOCABULARY'),
(8,'Potential form của "はなす" (nói) là gì?','["はなされる","はなしれる","はなせる","はなすれる"]',2,4,'VOCABULARY'),
-- CONTENT
(8,'Potential form biểu đạt điều gì?','["Ý muốn thực hiện hành động","Khả năng / Có thể thực hiện hành động","Nghĩa vụ phải làm","Đang thực hiện hành động"]',1,5,'CONTENT'),
(8,'Động từ nhóm 2 tạo potential form bằng cách nào?','["Thêm れる vào cuối","Bỏ る, thêm られる","Thêm できる vào sau","Bỏ ます, thêm れる"]',1,6,'CONTENT'),
(8,'"にほんごがはなせます" nghĩa là gì?','["Tôi muốn nói tiếng Nhật","Tôi có thể nói tiếng Nhật","Tôi đang học tiếng Nhật","Tôi không nói được tiếng Nhật"]',1,7,'CONTENT'),
-- SEQUENCE
(8,'Video giới thiệu potential form theo thứ tự nào?','["Giải thích ý nghĩa → Quy tắc chia → Ví dụ thực tế","Ví dụ → Quy tắc → Giải thích","Quy tắc → Ví dụ → Giải thích","Không có trình tự"]',0,8,'SEQUENCE'),
(8,'Để chuyển "たべる" sang potential form, thực hiện theo thứ tự?','["Thêm られる → Bỏ る","Bỏ る → Thêm られる","Thêm できる → Không đổi gì","Bỏ ます → Thêm られる"]',1,9,'SEQUENCE'),
(8,'Phần nào được giới thiệu CUỐI CÙNG trong video?','["Quy tắc cơ bản","Ví dụ đơn giản","Thể phủ định của potential form","Động từ nhóm 1"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 9 — Câu điều kiện たら và ば
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(9,'"もし" trong câu điều kiện nghĩa là gì?','["Nếu (nhấn mạnh giả thiết)","Vì vậy","Mặc dù","Khi đó"]',0,1,'VOCABULARY'),
(9,'"〜たら" được dùng để diễn đạt điều gì?','["Nguyên nhân","Điều kiện giả định (nếu/khi... thì)","Mục đích","Phủ định"]',1,2,'VOCABULARY'),
(9,'"〜ば" mang tính chất gì?','["Điều kiện cụ thể một lần","Điều kiện chung, mang tính quy luật","Câu mệnh lệnh","Câu nghi vấn"]',1,3,'VOCABULARY'),
(9,'"なら" dùng khi nào?','["Sau sự kiện đã xảy ra","Sau khi nhận thông tin từ người khác","Trong tương lai xa","Câu mệnh lệnh"]',1,4,'VOCABULARY'),
-- CONTENT
(9,'"雨が降ったら、傘を持っていく" nghĩa là gì?','["Vì trời đã mưa, tôi mang ô","Nếu trời mưa thì tôi sẽ mang ô","Dù trời mưa tôi cũng không mang ô","Trời mưa và tôi đang mang ô"]',1,5,'CONTENT'),
(9,'〜ば thường xuất hiện nhiều hơn trong văn phong nào?','["Văn nói thân mật","Văn viết trang trọng","Chỉ dùng trong câu hỏi","Chỉ dùng trong câu phủ định"]',1,6,'CONTENT'),
(9,'Điểm khác biệt chính giữa たら và ば là?','["Không có khác biệt","たら thường dùng cho sự kiện hoàn thành/cụ thể, ば mang tính điều kiện chung","たら chỉ dùng với tính từ, ば chỉ dùng với động từ","たら lịch sự hơn ば"]',1,7,'CONTENT'),
-- SEQUENCE
(9,'Video giới thiệu các mẫu điều kiện theo thứ tự nào?','["たら → ば → なら","ば → たら → なら","なら → ば → たら","Tất cả cùng một lúc"]',0,8,'SEQUENCE'),
(9,'Trong câu điều kiện, mệnh đề điều kiện (If-clause) đứng ở đâu?','["Sau mệnh đề chính","Trước mệnh đề chính","Ở giữa câu","Vị trí tùy ý"]',1,9,'SEQUENCE'),
(9,'Khi xây dựng câu với "たら", thực hiện theo thứ tự?','["Xác định động từ → Chia thể た → Thêm ら → Thêm kết quả","Thêm たら → Xác định động từ → Kết quả","Kết quả trước → Động từ → たら","Chia ます → Bỏ ます → Thêm たら"]',0,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 10 — Kanji N4 thiên nhiên và thời tiết
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(10,'Kanji 山 đọc âm Kun (訓読み) là gì?','["さん","やま","もり","かわ"]',1,1,'VOCABULARY'),
(10,'Kanji 川 có nghĩa là gì?','["Núi","Biển","Sông","Hồ"]',2,2,'VOCABULARY'),
(10,'天気 (てんき) nghĩa là gì?','["Thời tiết","Bầu trời","Nhiệt độ","Gió"]',0,3,'VOCABULARY'),
(10,'Kanji 雨 đọc âm Kun là gì?','["あめ","うめ","かめ","さめ"]',0,4,'VOCABULARY'),
-- CONTENT
(10,'Kanji 花 có nghĩa là gì?','["Lá cây","Hoa","Cỏ","Quả"]',1,5,'CONTENT'),
(10,'Âm On (音読み) của Kanji 山 là gì?','["やま","かわ","さん","もり"]',2,6,'CONTENT'),
(10,'Kanji 海 có nghĩa là gì?','["Sông","Biển / Đại dương","Hồ","Suối"]',1,7,'CONTENT'),
-- SEQUENCE
(10,'Video giới thiệu Kanji thiên nhiên theo nhóm chủ đề nào trước?','["Thời tiết → Địa hình → Thực vật","Địa hình (núi, sông) → Thời tiết → Thực vật","Thực vật → Thời tiết → Địa hình","Không có thứ tự"]',1,8,'SEQUENCE'),
(10,'Khi học một Kanji mới, video hướng dẫn theo thứ tự nào?','["Nhận dạng hình chữ → Học nghĩa → Học cách đọc On/Kun","Học cách đọc → Học nghĩa → Nhận dạng","Học ví dụ câu → Học nghĩa → Học chữ","Ngẫu nhiên"]',0,9,'SEQUENCE'),
(10,'Sau khi học nghĩa Kanji, bước tiếp theo trong bài là?','["Làm bài kiểm tra ngay","Học cách đọc âm On và Kun","Viết lại 10 lần","Chuyển sang Kanji khác"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 11 — Kanji N4 hành động
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(11,'食べる đọc là gì?','["のむ","たべる","みる","かく"]',1,1,'VOCABULARY'),
(11,'飲む đọc là gì?','["たべる","のむ","きく","はなす"]',1,2,'VOCABULARY'),
(11,'書く đọc là gì?','["よむ","かく","みる","きく"]',1,3,'VOCABULARY'),
(11,'走る đọc là gì?','["あるく","はいる","はしる","とぶ"]',2,4,'VOCABULARY'),
-- CONTENT
(11,'Kanji 見 trong từ 見る (みる) nghĩa là gì?','["Nghe","Xem / Nhìn","Viết","Đọc"]',1,5,'CONTENT'),
(11,'起きる (おきる) nghĩa là gì?','["Đi ngủ","Thức dậy","Ăn sáng","Ra ngoài"]',1,6,'CONTENT'),
(11,'Kanji 聞 xuất hiện trong từ nào sau đây mang nghĩa "nghe"?','["聞く (きく)","読む (よむ)","書く (かく)","見る (みる)"]',0,7,'CONTENT'),
-- SEQUENCE
(11,'Video sắp xếp Kanji hành động theo nhóm chủ đề nào?','["Ăn uống → Di chuyển → Học tập/Làm việc","Di chuyển → Ăn uống → Ngủ nghỉ","Học tập → Ăn uống → Di chuyển","Sắp xếp theo nét viết"]',0,8,'SEQUENCE'),
(11,'Bài học dạy mỗi Kanji hành động theo thứ tự nào?','["Hình chữ → Nghĩa → Cách đọc → Ví dụ câu","Ví dụ câu → Hình chữ → Nghĩa","Nghĩa → Ví dụ → Hình chữ","Cách đọc → Hình chữ → Nghĩa"]',0,9,'SEQUENCE'),
(11,'Sau khi học Kanji 食 (ăn), video giới thiệu Kanji nào tiếp theo?','["書 (viết)","走 (chạy)","飲 (uống)","見 (xem)"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 12 — ために và ように
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(12,'"ために" biểu đạt ý gì?','["Nguyên nhân","Mục đích của hành động chủ thể","Điều kiện","Kết quả"]',1,1,'VOCABULARY'),
(12,'"ように" biểu đạt ý gì?','["Mục đích hành động","Mục tiêu đạt được trạng thái nào đó","Nguyên nhân","Phương tiện"]',1,2,'VOCABULARY'),
(12,'"目的" (もくてき) nghĩa là gì?','["Mục đích","Kết quả","Phương pháp","Điều kiện"]',0,3,'VOCABULARY'),
(12,'"目標" (もくひょう) nghĩa là gì?','["Phương pháp","Nguyên nhân","Mục tiêu","Kết quả"]',2,4,'VOCABULARY'),
-- CONTENT
(12,'"日本語を話せるように、毎日練習する" nghĩa là gì?','["Tôi luyện tập mỗi ngày nên đã nói được tiếng Nhật","Tôi luyện tập mỗi ngày để (đạt được) có thể nói tiếng Nhật","Tôi nói tiếng Nhật mỗi ngày vì muốn luyện tập","Dù luyện tập mỗi ngày tôi vẫn không nói được"]',1,5,'CONTENT'),
(12,'Khác biệt cốt lõi giữa ために và ように là?','["Không có khác biệt","ために đi với động từ ý chí (chủ thể điều khiển), ように đi với trạng thái/khả năng","ために lịch sự hơn ように","ように chỉ dùng trong văn viết"]',1,6,'CONTENT'),
(12,'"〜ために" KHÔNG dùng được với loại động từ nào?','["Động từ ý chí","Động từ trạng thái (vd: ある、いる、できる...)","Động từ nhóm 1","Động từ nhóm 2"]',1,7,'CONTENT'),
-- SEQUENCE
(12,'Video giới thiệu hai mẫu câu theo thứ tự nào?','["ために → ように → So sánh hai mẫu","ように → ために → Bài tập","So sánh → ために → ように","Cả hai cùng lúc"]',0,8,'SEQUENCE'),
(12,'Trong câu với ために, các thành phần xuất hiện theo thứ tự nào?','["Kết quả → ために → Hành động","Hành động/Mục đích + ために → Hành động chính","Chủ thể → Kết quả → ために","ために → Mục đích → Hành động"]',1,9,'SEQUENCE'),
(12,'Phần luyện tập cuối video yêu cầu học viên làm gì đầu tiên?','["Dịch câu tiếng Việt sang tiếng Nhật","Phân biệt câu dùng ために hay ように","Chia động từ","Đọc to câu mẫu"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 13 — Câu giả định ば、なら
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(13,'"〜ば" tạo nghĩa gì?','["Điều kiện chung / quy luật","Câu mệnh lệnh","Câu phủ định","Câu nghi vấn"]',0,1,'VOCABULARY'),
(13,'"〜なら" dựa trên điều kiện gì?','["Sự kiện chưa xảy ra","Thông tin vừa nhận được từ người khác","Điều tất yếu","Lệnh"]',1,2,'VOCABULARY'),
(13,'"〜と" trong câu điều kiện tạo kết quả gì?','["Kết quả ngẫu nhiên","Kết quả tự nhiên / tất yếu","Kết quả mong muốn","Kết quả phủ định"]',1,3,'VOCABULARY'),
(13,'"仮定" (かてい) nghĩa là gì?','["Sự thật","Giả định / Giả thiết","Kết quả","Điều kiện đã xảy ra"]',1,4,'VOCABULARY'),
-- CONTENT
(13,'"暗くなると、星が見える" nghĩa là gì?','["Khi trời tối thì sao xuất hiện (điều tất yếu)","Nếu trời tối thì có thể thấy sao","Dù trời tối sao vẫn không thấy","Vì muốn thấy sao nên chờ trời tối"]',0,5,'CONTENT'),
(13,'Mẫu 〜なら khác 〜たら ở điểm quan trọng nào?','["なら mạnh hơn たら","なら dựa vào thông tin người nói vừa nhận, たら dùng cho điều kiện giả định thông thường","たら lịch sự hơn","Hai mẫu hoàn toàn giống nhau"]',1,6,'CONTENT'),
(13,'Mẫu 〜と KHÔNG dùng được trong câu nào?','["Câu tả hiện tượng tự nhiên","Câu diễn đạt ý chí, mong muốn của chủ thể","Câu quy luật","Câu hướng dẫn"]',1,7,'CONTENT'),
-- SEQUENCE
(13,'Video giới thiệu 4 mẫu điều kiện theo thứ tự nào?','["と → ば → たら → なら","ば → と → なら → たら","たら → ば → と → なら","なら → たら → ば → と"]',0,8,'SEQUENCE'),
(13,'Khi phân biệt các mẫu điều kiện, bước ĐẦU TIÊN là?','["Chọn mẫu ngẫu nhiên","Xem xét ngữ cảnh và loại kết quả muốn diễn đạt","Tra từ điển","Hỏi người Nhật"]',1,9,'SEQUENCE'),
(13,'Sau phần lý thuyết, video tiến hành phần nào tiếp theo?','["Kiểm tra ngay","Thực hành với ví dụ hội thoại thực tế","Học mẫu câu mới","Xem lại từ đầu"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 14 — てしまう、ておく、てみる
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(14,'"〜てしまう" biểu đạt điều gì?','["Làm thử xem sao","Làm trước để chuẩn bị","Hoàn tất hành động (thường kèm hối tiếc hoặc nhấn mạnh)","Đang làm dở"]',2,1,'VOCABULARY'),
(14,'"〜ておく" biểu đạt điều gì?','["Làm thử","Làm trước để chuẩn bị cho sau này","Hoàn tất ngoài ý muốn","Đang làm"]',1,2,'VOCABULARY'),
(14,'"〜てみる" biểu đạt điều gì?','["Làm thử / Thử nghiệm","Làm trước","Hoàn tất","Không làm"]',0,3,'VOCABULARY'),
(14,'"後悔" (こうかい) nghĩa là gì?','["Hối tiếc","Vui mừng","Chuẩn bị","Kết thúc"]',0,4,'VOCABULARY'),
-- CONTENT
(14,'"財布を忘れてしまった" nghĩa là gì?','["Tôi sẽ quên ví","Tôi đang quên ví","Tôi đã lỡ quên ví mất rồi (tiếc)","Tôi chuẩn bị quên ví"]',2,5,'CONTENT'),
(14,'"旅行の前に、ホテルを予約しておいた" nghĩa là gì?','["Tôi đặt khách sạn sau khi đi du lịch","Trước khi đi du lịch, tôi đã đặt khách sạn trước (chuẩn bị)","Tôi muốn đặt khách sạn","Tôi thử đặt khách sạn xem sao"]',1,6,'CONTENT'),
(14,'"この料理を食べてみてください" nghĩa là gì?','["Hãy ăn hết món này","Hãy thử ăn món này xem","Đừng ăn món này","Món này đã ăn hết rồi"]',1,7,'CONTENT'),
-- SEQUENCE
(14,'Video giới thiệu 3 mẫu theo thứ tự nào?','["てしまう → ておく → てみる","てみる → てしまう → ておく","ておく → てみる → てしまう","Cả ba cùng lúc"]',0,8,'SEQUENCE'),
(14,'Trong mỗi mẫu câu, cấu trúc bài dạy theo thứ tự?','["Bài tập → Ví dụ → Nghĩa","Nghĩa → Ví dụ thực tế → Bài luyện tập","Ví dụ → Bài tập → Nghĩa","Nghĩa → Bài tập → Ví dụ"]',1,9,'SEQUENCE'),
(14,'Phần tổng kết cuối video sắp xếp lại 3 mẫu theo tiêu chí nào?','["Theo mức độ khó","Từ hoàn tất (てしまう) → Chuẩn bị (ておく) → Thử nghiệm (てみる)","Theo thứ tự bảng chữ cái","Theo tần suất sử dụng"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 15 — Kanji N3 xã hội và kinh tế
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(15,'経済 (けいざい) nghĩa là gì?','["Chính trị","Kinh tế","Xã hội","Văn hoá"]',1,1,'VOCABULARY'),
(15,'社会 (しゃかい) nghĩa là gì?','["Công ty","Xã hội","Trường học","Gia đình"]',1,2,'VOCABULARY'),
(15,'政治 (せいじ) nghĩa là gì?','["Kinh tế","Xã hội","Chính trị","Lịch sử"]',2,3,'VOCABULARY'),
(15,'環境 (かんきょう) nghĩa là gì?','["Môi trường","Giáo dục","Y tế","Giao thông"]',0,4,'VOCABULARY'),
-- CONTENT
(15,'問題 (もんだい) nghĩa là gì?','["Câu trả lời","Vấn đề / Bài tập","Kết quả","Nguyên nhân"]',1,5,'CONTENT'),
(15,'情報 (じょうほう) nghĩa là gì?','["Thông tin","Điện thoại","Máy tính","Internet"]',0,6,'CONTENT'),
(15,'発展 (はってん) nghĩa là gì?','["Phá hoại","Thu nhỏ","Phát triển","Dừng lại"]',2,7,'CONTENT'),
-- SEQUENCE
(15,'Video giới thiệu Kanji N3 theo nhóm chủ đề nào trước?','["Chính trị → Kinh tế → Xã hội → Môi trường","Môi trường → Xã hội → Kinh tế → Chính trị","Kinh tế → Chính trị → Môi trường → Xã hội","Không có thứ tự cố định"]',0,8,'SEQUENCE'),
(15,'Khi gặp Kanji N3 mới, quy trình học hiệu quả theo video là?','["Học nghĩa → Học phát âm On/Kun → Học từ ghép → Luyện trong câu","Học từ ghép trước → Nghĩa → Phát âm","Luyện trong câu → Nghĩa → Phát âm","Chỉ cần nhớ nghĩa"]',0,9,'SEQUENCE'),
(15,'Sau phần Kanji cơ bản, bài học N3 giới thiệu nội dung gì tiếp theo?','["Kanji mức N2","Từ ghép và cách dùng trong câu hoàn chỉnh","Bài kiểm tra cuối","Katakana nâng cao"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 16 — Đọc hiểu N3
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(16,'"しかし" có chức năng gì trong đoạn văn?','["Bổ sung thêm ý (thêm vào)","Đảo ngược ý / Tuy nhiên","Kết luận","Nêu ví dụ"]',1,1,'VOCABULARY'),
(16,'"つまり" thường đứng trước loại nội dung nào?','["Ví dụ minh hoạ","Tóm tắt / Diễn giải lại ý trước","Câu phủ định","Câu hỏi tu từ"]',1,2,'VOCABULARY'),
(16,'"一方で" (いっぽうで) có nghĩa gì?','["Vì vậy","Mặt khác / Ngược lại","Ví dụ như","Kết luận"]',1,3,'VOCABULARY'),
(16,'"逆接" (ぎゃくせつ) trong ngữ pháp là?','["Mối quan hệ nhân quả","Mối quan hệ bổ sung","Mối quan hệ đảo ngược / tương phản","Mối quan hệ thời gian"]',2,4,'VOCABULARY'),
-- CONTENT
(16,'Kỹ thuật đọc lướt lấy ý chính gọi là gì?','["Scanning","Skimming (đọc lướt)","Translating","Memorizing"]',1,5,'CONTENT'),
(16,'"そして" dùng để làm gì trong đoạn văn?','["Đảo ngược ý","Nêu nguyên nhân","Nối tiếp ý / Và thêm nữa","Kết luận"]',2,6,'CONTENT'),
(16,'"なぜなら" dẫn đến loại thông tin nào tiếp theo?','["Kết luận","Ví dụ","Nguyên nhân / Lý do giải thích","Đảo ngược"]',2,7,'CONTENT'),
-- SEQUENCE
(16,'Video hướng dẫn chiến lược đọc hiểu N3 theo thứ tự nào?','["Đọc tiêu đề → Đọc câu đầu mỗi đoạn → Đọc chi tiết cần thiết","Đọc toàn bộ trước → Đọc câu hỏi → Đọc lại","Đọc câu hỏi trước → Tìm đáp án → Đọc toàn bộ","Dịch từng câu từ đầu đến cuối"]',0,8,'SEQUENCE'),
(16,'Khi gặp từ không biết trong bài đọc, chiến lược đúng theo thứ tự là?','["Tra từ điển ngay → Đọc tiếp","Đoán nghĩa từ văn cảnh → Nếu cần thiết mới tra → Tiếp tục đọc","Bỏ qua toàn bộ đoạn đó","Dừng đọc"]',1,9,'SEQUENCE'),
(16,'Phần luyện tập trong video được sắp xếp theo thứ tự độ khó?','["Khó → Trung bình → Dễ","Dễ → Trung bình → Khó","Ngẫu nhiên","Tất cả cùng độ khó"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 17 — にもかかわらず
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(17,'"にもかかわらず" biểu đạt ý gì?','["Vì vậy / Do đó","Mặc dù... vẫn... (bất chấp điều trái ngược)","Nếu như","Ngay khi"]',1,1,'VOCABULARY'),
(17,'"逆接" nghĩa là gì trong ngữ pháp?','["Mối quan hệ đảo ngược / tương phản","Mối quan hệ nhân quả","Mối quan hệ bổ sung","Mối quan hệ thời gian"]',0,2,'VOCABULARY'),
(17,'"予想" (よそう) nghĩa là gì?','["Dự đoán / Kỳ vọng","Kết quả","Nguyên nhân","Phương pháp"]',0,3,'VOCABULARY'),
(17,'"結果" (けっか) nghĩa là gì?','["Nguyên nhân","Kết quả","Phương pháp","Điều kiện"]',1,4,'VOCABULARY'),
-- CONTENT
(17,'"雨にもかかわらず、試合は続けられた" nghĩa là gì?','["Vì trời mưa nên trận đấu bị huỷ","Mặc dù trời mưa, trận đấu vẫn được tiếp tục","Trời tạnh mưa nên trận đấu tiếp tục","Trước khi mưa, trận đấu kết thúc"]',1,5,'CONTENT'),
(17,'にもかかわらず thường dùng trong văn phong nào?','["Hội thoại thân mật hằng ngày","Văn viết trang trọng / học thuật","Chỉ dùng trong thơ","Chỉ dùng trong tin nhắn"]',1,6,'CONTENT'),
(17,'Khác biệt giữa にもかかわらず và のに là gì?','["Không có khác biệt","にもかかわらず trang trọng hơn, thường dùng trong văn viết; のに thân mật hơn","のに trang trọng hơn","Hai mẫu dùng trong ngữ cảnh hoàn toàn khác nhau"]',1,7,'CONTENT'),
-- SEQUENCE
(17,'Video giới thiệu にもかかわらず theo trình tự nào?','["Nghĩa → Cấu trúc → Ví dụ → So sánh với のに","Ví dụ → Nghĩa → So sánh → Cấu trúc","So sánh → Cấu trúc → Nghĩa → Ví dụ","Cấu trúc → Ví dụ → Nghĩa → So sánh"]',0,8,'SEQUENCE'),
(17,'Trong câu [A にもかかわらず B], A và B xuất hiện theo thứ tự nào?','["B (kết quả bất ngờ) → にもかかわらず → A (tiền đề)","A (tiền đề/điều bình thường) → にもかかわらず → B (kết quả bất ngờ)","にもかかわらず → A → B","A → B → にもかかわらず"]',1,9,'SEQUENCE'),
(17,'Khi nhận ra câu có にもかかわらず trong bài đọc, xử lý theo thứ tự?','["Đọc B trước → Tìm にもかかわらず → Đọc A","Tìm にもかかわらず → Đọc A (tiền đề) → Xác định B (kết quả bất ngờ)","Bỏ qua cụm từ đó","Tra từ điển ngay"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 18 — に反して và に対して
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(18,'"に反して" (にはんして) nghĩa là gì?','["Theo đúng / Phù hợp với","Trái với / Bất chấp","Vì lý do","Dù sao đi nữa"]',1,1,'VOCABULARY'),
(18,'"に対して" (にたいして) biểu đạt gì?','["Nguyên nhân","Hướng đến đối tượng / So sánh tương phản","Điều kiện","Mục đích"]',1,2,'VOCABULARY'),
(18,'"予想" (よそう) nghĩa là gì?','["Kết quả","Dự đoán / Kỳ vọng","Nguyên nhân","Phương pháp"]',1,3,'VOCABULARY'),
(18,'"対象" (たいしょう) nghĩa là gì?','["Kết quả","Phương pháp","Đối tượng","Nguyên nhân"]',2,4,'VOCABULARY'),
-- CONTENT
(18,'"予想に反して、試験は簡単だった" nghĩa là gì?','["Như dự đoán, kỳ thi rất dễ","Trái với dự đoán, kỳ thi lại dễ","Vì dự đoán sai nên kỳ thi khó","Kỳ thi khó hơn dự đoán"]',1,5,'CONTENT'),
(18,'に対して dùng để diễn đạt điều gì?','["Chỉ dùng để so sánh hai vế","Hướng đến một đối tượng cụ thể hoặc tương phản hai sự vật","Chỉ dùng trong câu phủ định","Chỉ dùng trong văn hội thoại"]',1,6,'CONTENT'),
(18,'"若者に対して、老人は経験が豊富だ" — に対して ở đây biểu đạt gì?','["Hướng đến đối tượng là người trẻ","Tương phản giữa người trẻ và người già","Nguyên nhân người già có kinh nghiệm","Điều kiện"]',1,7,'CONTENT'),
-- SEQUENCE
(18,'Video trình bày hai mẫu ngữ pháp theo thứ tự nào?','["に反して → に対して","に対して → に反して","Cả hai cùng lúc","Ngẫu nhiên"]',0,8,'SEQUENCE'),
(18,'Khi phân tích câu có に反して, đọc và xử lý theo thứ tự nào?','["Đọc B trước → Tìm に反して → Đọc A","Tìm に反して → Đọc A (kỳ vọng ban đầu) → Xác định B (điều trái ngược)","Bỏ qua に反して","Tra từ điển"]',1,9,'SEQUENCE'),
(18,'Bài học kết thúc với phần nào?','["Học thêm mẫu ngữ pháp mới","Xem lại lý thuyết","Bài tập phân biệt に反して và に対して","Kiểm tra từ vựng"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 19 — Đọc email công việc N2
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(19,'"お世話になっております" dùng ở vị trí nào trong email?','["Phần kết email","Phần chữ ký","Phần mở đầu email (sau lời chào)","Phần nội dung chính"]',2,1,'VOCABULARY'),
(19,'"ご確認" (ごかくにん) nghĩa là gì?','["Xác nhận (kính ngữ)","Gửi đi","Nhận được","Trả lời"]',0,2,'VOCABULARY'),
(19,'"添付" (てんぷ) nghĩa là gì?','["Chữ ký","Đính kèm (file)","Tiêu đề","Nội dung"]',1,3,'VOCABULARY'),
(19,'"了解" (りょうかい) nghĩa là gì?','["Xin lỗi","Đã hiểu / Đồng ý","Cảm ơn","Từ chối"]',1,4,'VOCABULARY'),
-- CONTENT
(19,'Cấu trúc chuẩn của email công việc tiếng Nhật là?','["Chào hỏi → Nội dung chính → Lời kết → Chữ ký","Nội dung → Chào → Chữ ký","Chữ ký → Nội dung → Chào","Tùy ý người viết"]',0,5,'CONTENT'),
(19,'"ご確認のほど、よろしくお願いいたします" nghĩa là gì?','["Tôi đã xác nhận rồi","Xin vui lòng xác nhận giúp tôi","Tôi không cần xác nhận","Bạn đã xác nhận chưa?"]',1,6,'CONTENT'),
(19,'Văn phong nào phù hợp nhất trong email công việc N2?','["Văn nói thân mật (thể phổ thông)","Kính ngữ trang trọng (敬語)","Văn học thuật","Văn mạng xã hội"]',1,7,'CONTENT'),
-- SEQUENCE
(19,'Khi viết email xin phép nghỉ phép, thứ tự nội dung chuẩn là?','["Chào hỏi → Lý do → Ngày nghỉ cụ thể → Xin phép → Lời kết","Xin phép → Chào → Lý do → Ngày nghỉ","Ngày nghỉ → Lý do → Xin phép → Chào","Lý do → Ngày nghỉ → Chào → Xin phép"]',0,8,'SEQUENCE'),
(19,'Khi đọc email nhận được, xử lý theo thứ tự nào hiệu quả nhất?','["Người gửi → Tiêu đề → Nội dung chính → File đính kèm","File đính kèm → Tiêu đề → Người gửi → Nội dung","Nội dung → Tiêu đề → Người gửi","Đọc toàn bộ từ đầu đến cuối một lần"]',0,9,'SEQUENCE'),
(19,'Video giới thiệu các loại email công việc theo thứ tự nào?','["Email hỏi thông tin → Email xin phép → Email báo cáo","Email xin phép → Email báo cáo → Email hỏi thông tin","Email báo cáo → Email hỏi thông tin → Email xin phép","Không có thứ tự"]',1,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 20 — Kỹ thuật đọc báo N2
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(20,'"スキミング" (skimming) nghĩa là gì?','["Đọc từng chữ","Đọc lướt để nắm ý chính","Tìm thông tin cụ thể","Dịch toàn bộ"]',1,1,'VOCABULARY'),
(20,'"スキャニング" (scanning) nghĩa là gì?','["Đọc lướt","Tìm kiếm thông tin cụ thể trong văn bản","Đọc toàn bộ chi tiết","Ghi nhớ"]',1,2,'VOCABULARY'),
(20,'"主題" (しゅだい) nghĩa là gì?','["Chủ đề chính / Luận điểm","Ví dụ","Kết luận phụ","Tiêu đề phụ"]',0,3,'VOCABULARY'),
(20,'"段落" (だんらく) nghĩa là gì?','["Câu văn","Tiêu đề","Đoạn văn","Chương"]',2,4,'VOCABULARY'),
-- CONTENT
(20,'"一方で" trong văn bản có chức năng gì?','["Bổ sung thêm ý","Đối lập / Mặt khác","Kết luận","Nêu ví dụ"]',1,5,'CONTENT'),
(20,'"〜によると" thường dẫn đến loại thông tin nào?','["Ý kiến cá nhân của tác giả","Thông tin trích dẫn từ nguồn cụ thể","Kết luận của bài","Phủ định"]',1,6,'CONTENT'),
(20,'Cấu trúc đặc trưng của bài báo tiếng Nhật so với bài báo phương Tây?','["Giống hoàn toàn","Bài báo Nhật thường đặt kết luận/luận điểm chính lên đầu","Bài báo Nhật luôn để kết luận ở cuối","Không có cấu trúc nhất quán"]',1,7,'CONTENT'),
-- SEQUENCE
(20,'Video hướng dẫn kỹ thuật đọc N2 theo thứ tự nào?','["Skimming → Scanning → Đọc phân tích sâu","Scanning → Skimming → Dịch","Dịch → Skimming → Scanning","Đọc phân tích → Scanning → Skimming"]',0,8,'SEQUENCE'),
(20,'Khi đọc bài báo dài N2, thứ tự xử lý hiệu quả nhất là?','["Dịch từng câu","Tiêu đề → Đoạn mở đầu → Kết luận → Chi tiết cần thiết","Đọc từ cuối lên","Chỉ đọc tiêu đề"]',1,9,'SEQUENCE'),
(20,'Sau khi đọc và trả lời câu hỏi, bước cuối cùng trong quy trình là?','["Đọc lại toàn bộ","Tra từ mới","Kiểm tra lại đáp án với văn bản gốc","Học thuộc bài"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 21 — Ngữ pháp N1 văn phong trang trọng
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(21,'"をもって" biểu đạt ý gì?','["Bằng cách / Kể từ (thời điểm)","Vì vậy","Mặc dù","Khi nào đó"]',0,1,'VOCABULARY'),
(21,'"いかんによって" nghĩa là gì?','["Tuỳ thuộc vào","Mặc dù","Vì vậy","Bằng cách"]',0,2,'VOCABULARY'),
(21,'"ざるを得ない" biểu đạt điều gì?','["Không muốn nhưng buộc phải làm","Muốn làm nhưng không thể","Tự nguyện làm","Không cần làm"]',0,3,'VOCABULARY'),
(21,'"に他ならない" nghĩa là gì?','["Không phải vậy","Chính là / Không gì khác ngoài","Có thể là","Chưa chắc là"]',1,4,'VOCABULARY'),
-- CONTENT
(21,'"本日をもって退職いたします" nghĩa là gì?','["Tôi bắt đầu làm việc từ hôm nay","Tôi xin nghỉ việc kể từ hôm nay","Tôi sẽ nghỉ việc vào ngày mai","Tôi muốn nghỉ phép"]',1,5,'CONTENT'),
(21,'"結果いかんによって、対応が変わります" nghĩa là gì?','["Kết quả không thay đổi","Tuỳ thuộc vào kết quả mà cách xử lý sẽ thay đổi","Cách xử lý không phụ thuộc vào kết quả","Kết quả và cách xử lý giống nhau"]',1,6,'CONTENT'),
(21,'"認めざるを得ない" nghĩa là gì?','["Tôi không thể thừa nhận","Tôi tự nguyện thừa nhận","Buộc phải thừa nhận (dù không muốn)","Tôi muốn thừa nhận"]',2,7,'CONTENT'),
-- SEQUENCE
(21,'Video giới thiệu các mẫu ngữ pháp N1 theo thứ tự nào?','["をもって → いかんによって → ざるを得ない → に他ならない","に他ならない → をもって → いかんによって → ざるを得ない","Ngẫu nhiên","Tất cả cùng một lúc"]',0,8,'SEQUENCE'),
(21,'Khi viết văn bản trang trọng N1, bước suy nghĩ theo thứ tự nào?','["Chọn mẫu ngẫu nhiên","Xác định ngữ cảnh → Đánh giá mức độ trang trọng → Chọn mẫu phù hợp","Viết xong rồi chỉnh","Tra từ điển từng từ"]',1,9,'SEQUENCE'),
(21,'Phần ứng dụng thực hành cuối video luyện mẫu nào đầu tiên?','["ざるを得ない","に他ならない","いかんによって","をもって"]',3,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 22 — Thành ngữ và tục ngữ N1
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(22,'"七転び八起き" (ななころびやおき) nghĩa là gì?','["Ngã 7 lần đứng dậy 8 lần — kiên trì không bỏ cuộc","Làm 7-8 việc cùng lúc","Đi khắp 7-8 nơi","Thành công lần thứ 8"]',0,1,'VOCABULARY'),
(22,'"石の上にも三年" hàm ý gì?','["Đá rất cứng và lạnh","Kiên nhẫn và bền bỉ ắt sẽ thành công","Ngồi trên đá 3 năm sẽ lạnh","Thời gian trôi qua nhanh"]',1,2,'VOCABULARY'),
(22,'"猿も木から落ちる" hàm ý gì?','["Khỉ thích leo trèo","Ngay cả người giỏi cũng có lúc phạm sai lầm","Động vật rất nguy hiểm","Không nên leo cây"]',1,3,'VOCABULARY'),
(22,'"花より団子" nghĩa là gì?','["Hoa đẹp hơn bánh","Thực dụng hơn hình thức — thích cái thiết thực hơn cái đẹp","Mùa xuân có hoa và bánh","Thích hoa hơn là thích ăn"]',1,4,'VOCABULARY'),
-- CONTENT
(22,'"七転び八起き" thể hiện tinh thần nào đặc trưng của văn hoá Nhật?','["Cầu toàn","Kiên trì, không bỏ cuộc dù thất bại","Cạnh tranh","Tuân thủ quy tắc"]',1,5,'CONTENT'),
(22,'Thành ngữ nào phù hợp nhất để khuyến khích người mới bắt đầu học tiếng Nhật?','["花より団子","猿も木から落ちる","石の上にも三年","七転び八起き"]',2,6,'CONTENT'),
(22,'"花より団子" được dùng trong bối cảnh nào?','["Khi ngắm hoa anh đào","Khi chọn thực tế / tiện ích hơn vẻ đẹp hình thức","Khi ca ngợi thiên nhiên","Khi nói về ẩm thực"]',1,7,'CONTENT'),
-- SEQUENCE
(22,'Video giới thiệu thành ngữ theo nhóm chủ đề nào?','["Kiên trì / Nỗ lực → Thực dụng → Sai lầm","Sai lầm → Kiên trì → Thực dụng","Thực dụng → Sai lầm → Kiên trì","Ngẫu nhiên"]',0,8,'SEQUENCE'),
(22,'Để học thành ngữ tiếng Nhật hiệu quả, thứ tự nào đúng?','["Học thuộc từng chữ → Tra nghĩa → Dùng trong câu","Nghe ví dụ thực tế → Hiểu nghĩa và hoàn cảnh → Dùng trong câu","Dùng trong câu trước → Học nghĩa sau","Chỉ cần nhớ nghĩa"]',1,9,'SEQUENCE'),
(22,'Phần luyện tập cuối video yêu cầu điều gì đầu tiên?','["Dịch thành ngữ sang tiếng Anh","Viết chính tả","Ghép thành ngữ với tình huống phù hợp","Học thêm thành ngữ mới"]',2,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 23 — Nghe hiểu N1
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(23,'"概要理解" (がいようりかい) nghĩa là gì?','["Hiểu từng chi tiết nhỏ","Hiểu nội dung tổng quát / ý chính","Dịch toàn bộ","Ghi chép lại"]',1,1,'VOCABULARY'),
(23,'"話者の意図" (わしゃのいと) nghĩa là gì?','["Nội dung câu nói","Ý định / Mục đích của người nói","Cảm xúc của người nghe","Chủ đề cuộc trò chuyện"]',1,2,'VOCABULARY'),
(23,'"逆説" (ぎゃくせつ) nghĩa là gì?','["Đồng thuận","Nghịch lý / Điều trái ngược với kỳ vọng","Kết luận","Ví dụ"]',1,3,'VOCABULARY'),
(23,'"強調" (きょうちょう) nghĩa là gì?','["Phủ định","Bổ sung","Nhấn mạnh","Kết luận"]',2,4,'VOCABULARY'),
-- CONTENT
(23,'Chiến lược hiệu quả nhất khi nghe hội thoại tốc độ cao N1 là?','["Cố hiểu từng từ","Tập trung vào từ khoá và cấu trúc câu chính","Dịch trong đầu từng câu","Chờ nghe lại"]',1,5,'CONTENT'),
(23,'"それどころか" trong nghe hiểu N1 biểu đạt gì?','["Vì vậy","Không những thế... mà còn (tệ hơn / nhiều hơn)","Mặc dù","Ví dụ như"]',1,6,'CONTENT'),
(23,'Khi nghe không hiểu một phần, chiến lược đúng là?','["Dừng lại và nghe lại phần đó","Tiếp tục nghe, dùng văn cảnh để suy luận","Bỏ qua toàn bộ","Ghi lại và tra sau"]',1,7,'CONTENT'),
-- SEQUENCE
(23,'Video hướng dẫn chiến lược nghe N1 theo thứ tự nào?','["Chuẩn bị tâm lý → Nghe lần 1 (ý chính) → Nghe lần 2 (chi tiết)","Nghe chi tiết → Nghe ý chính → Chuẩn bị","Nghe lần 2 trước → Nghe lần 1 → Chuẩn bị","Không có thứ tự cụ thể"]',0,8,'SEQUENCE'),
(23,'Khi nghe đoạn hội thoại dài, xử lý theo thứ tự nào?','["Ghi chép tất cả → Đọc lại → Trả lời","Nắm ý chính → Nghe chi tiết cần thiết → Trả lời câu hỏi","Trả lời ngay → Nghe lại → Kiểm tra","Bỏ qua đoạn đầu → Nghe đoạn cuối → Trả lời"]',1,9,'SEQUENCE'),
(23,'Trong đề thi nghe N1, các dạng câu hỏi thường xuất hiện theo thứ tự nào?','["Câu hỏi ngắn → Hội thoại dài → Nghe và lấy thông tin","Hội thoại dài → Câu hỏi ngắn → Nghe ý kiến","Nghe ý kiến → Hội thoại dài → Câu hỏi ngắn","Ngẫu nhiên mỗi kỳ thi"]',0,10,'SEQUENCE'),

-- ══════════════════════════════════════════════════════════════
-- QUIZ 24 — Đọc văn học và văn nghị luận N1
-- ══════════════════════════════════════════════════════════════
-- VOCABULARY
(24,'"もののあわれ" là khái niệm mỹ học Nhật chỉ điều gì?','["Vẻ đẹp hùng vĩ","Nỗi buồn tinh tế trước sự vô thường của vạn vật","Sự hoàn hảo tuyệt đối","Niềm vui sống"]',1,1,'VOCABULARY'),
(24,'"間" (ま) trong nghệ thuật Nhật chỉ điều gì?','["Khoảng lặng / Khoảng trống mang ý nghĩa sâu sắc","Thời gian dài","Không gian vật lý lớn","Sự ồn ào"]',0,2,'VOCABULARY'),
(24,'"筆者の主張" (ひっしゃのしゅちょう) nghĩa là gì?','["Ví dụ của tác giả","Luận điểm / Quan điểm của tác giả","Kết luận của độc giả","Câu hỏi đặt ra"]',1,3,'VOCABULARY'),
(24,'"逆接" (ぎゃくせつ) trong phân tích văn bản là?','["Mối quan hệ nhân quả","Mối quan hệ bổ sung","Mối quan hệ tương phản / đảo ngược","Mối quan hệ thời gian"]',2,4,'VOCABULARY'),
-- CONTENT
(24,'Khái niệm "もののあわれ" thường được thể hiện trong thể loại văn học nào?','["Tiểu thuyết hiện đại","Thơ Waka và văn xuôi Heian (cung đình)","Truyện tranh Manga","Kịch bản phim"]',1,5,'CONTENT'),
(24,'"間" (ま) trong kịch Noh được thể hiện như thế nào?','["Âm nhạc ồn ào liên tục","Khoảng lặng và động tác chậm mang ý nghĩa","Lời thoại nhanh và nhiều","Sân khấu hoành tráng"]',1,6,'CONTENT'),
(24,'Khi đọc văn nghị luận N1, kỹ năng quan trọng nhất là?','["Đọc thật nhanh","Phân biệt sự kiện khách quan và quan điểm của tác giả","Dịch từng câu","Ghi nhớ toàn bộ"]',1,7,'CONTENT'),
-- SEQUENCE
(24,'Video phân tích văn bản văn học N1 theo thứ tự nào?','["Đọc tổng thể → Phân tích từng đoạn → Tổng kết luận điểm","Tổng kết → Phân tích → Đọc tổng thể","Phân tích → Đọc → Tổng kết","Không có thứ tự"]',0,8,'SEQUENCE'),
(24,'Khi đọc văn nghị luận N1, thứ tự phân tích hiệu quả là?','["Ghi nhớ chi tiết → Xác định luận điểm → Đánh giá","Xác định luận điểm của tác giả → Tìm bằng chứng hỗ trợ → Đánh giá tính thuyết phục","Đánh giá trước → Đọc → Xác định","Đọc kết luận → Đọc mở đầu → Bỏ qua giữa"]',1,9,'SEQUENCE'),
(24,'Phần luyện tập cuối bài yêu cầu học viên làm gì?','["Học thuộc văn bản","Dịch sang tiếng Anh","Viết tóm tắt luận điểm của tác giả bằng tiếng Nhật","Đọc to toàn bộ văn bản"]',2,10,'SEQUENCE');

-- ── Tóm tắt ─────────────────────────────────────────────────
SELECT 'Seed data inserted successfully!' AS status;
SELECT COUNT(*) AS total_levels    FROM levels;
SELECT COUNT(*) AS total_courses   FROM courses;
SELECT COUNT(*) AS total_lessons   FROM lessons;
SELECT COUNT(*) AS total_quizzes   FROM quizzes;
SELECT COUNT(*) AS total_questions FROM questions;
SELECT question_type, COUNT(*) AS count FROM questions GROUP BY question_type;
