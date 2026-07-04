-- ============================================================
-- NihongoFlow — Seed data đầy đủ N5 → N1
-- Video YouTube thật, nội dung quiz từ transcript thực tế
-- Cấu trúc quiz: 4 VOCABULARY + 3 CONTENT + 3 SEQUENCE mỗi bài
-- Chạy: cmd /c "mysql.exe -u nihongo -p123456 nihongoflow < seed-data.sql"
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE user_lesson_progress;
TRUNCATE TABLE user_course_enrollments;
TRUNCATE TABLE payments;
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
(1, 1, 'Hội thoại chào hỏi & giới thiệu bản thân',
 'Luyện tập các tình huống giao tiếp cơ bản: chào hỏi qua điện thoại, nói về sở thích, giới thiệu bản thân và trao đổi về thức ăn yêu thích.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400', 1),
(2, 1, 'Hội thoại mua sắm & cuộc sống hàng ngày',
 'Các hội thoại thực tế: phỏng vấn xin việc làm thêm, xử lý đồ thất lạc và giao tiếp buổi sáng về thời tiết và kế hoạch trong ngày.',
 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=400', 2),
(3, 2, 'Hội thoại du lịch & khám phá',
 'Thực hành qua các tình huống du lịch: giới thiệu danh lam thắng cảnh Okinawa, cuộc sống hàng ngày ở Yokohama và câu chuyện nuôi cá thú vị.',
 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400', 1),
(4, 2, 'Hội thoại cuộc sống hàng ngày',
 'Luyện nghe và nói qua các chủ đề gần gũi: ý nghĩa của hoa anh đào, bắt đầu cuộc sống mới và luyện tập từ vựng N4 qua câu ví dụ thực tế.',
 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400', 2),
(5, 3, 'Hội thoại xã hội & cảm xúc',
 'Hội thoại về các chủ đề xã hội: sự kiện hôn hoạt, câu chuyện bị ốm khi đi du lịch nước ngoài và thảo luận về tiêu chuẩn người bạn đời lý tưởng.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', 1),
(6, 3, 'Hội thoại câu chuyện & du lịch',
 'Luyện kỹ năng nghe qua câu chuyện về lịch trình làm việc hàng ngày và hành trình khám phá thành phố Kofu — Yamanashi.',
 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=400', 2),
(7, 4, 'Hội thoại công việc & kinh doanh',
 'Tiếng Nhật văn phòng thực tế: văn hóa công sở Nhật Bản (報連相), kính ngữ vs ngôn ngữ thân mật với đồng nghiệp cấp dưới.',
 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400', 1),
(8, 4, 'Hội thoại phỏng vấn & hội họp',
 'Luyện tập hội thoại trong tình huống phỏng vấn xin việc và chuẩn bị cho cuộc họp online — email yêu cầu báo cáo và phân công ghi biên bản.',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400', 2),
(9, 5, 'Kính ngữ & văn phong trang trọng',
 'Nắm vững 4 loại kính ngữ (丁寧語・尊敬語・謙譲語・丁重語) và luyện nhận biết các mẫu hoa văn/họa tiết trong tiếng Nhật nâng cao.',
 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400', 1),
(10, 5, 'Hội thoại học thuật & phân tích',
 'Thực hành kính ngữ qua ví dụ động từ biến đổi và luyện ngữ pháp N1 trong hội thoại tự nhiên cùng sinh viên quốc tế.',
 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400', 2);

-- ── Lessons ─────────────────────────────────────────────────
INSERT INTO lessons (id, course_id, title, video_url, duration, order_index) VALUES
-- Course 1: N5 chào hỏi & giới thiệu (3 bài)
(1,  1, 'Mời bạn đi chơi & đặt bàn nhà hàng qua điện thoại',
 'https://www.youtube.com/watch?v=XQlTl30PIpw', 571, 1),
(2,  1, 'Nói về đồ ăn và thức uống yêu thích',
 'https://www.youtube.com/watch?v=ihdJ84esAMg', 169, 2),
(3,  1, 'Tự giới thiệu bản thân — quốc tịch, tuổi, nơi ở',
 'https://www.youtube.com/watch?v=ilsJ1F5u-QE', 152, 3),
-- Course 2: N5 mua sắm & cuộc sống (3 bài)
(4,  2, 'Phỏng vấn xin việc làm thêm tại quán cà phê',
 'https://www.youtube.com/watch?v=FPChrbGzntA', 599, 1),
(5,  2, 'Tìm đồ thất lạc tại cửa hàng',
 'https://www.youtube.com/watch?v=i2UEIUI3XRI', 672, 2),
(6,  2, 'Hội thoại buổi sáng — thời tiết, học tiếng Nhật và kế hoạch ngày',
 'https://www.youtube.com/watch?v=hVOvyR3fSrU', 267, 3),
-- Course 3: N4 du lịch & khám phá (3 bài)
(7,  3, 'Giới thiệu điểm du lịch Okinawa — thủy cung, lâu đài, đảo',
 'https://www.youtube.com/watch?v=uAgTIfWQ_Xs', 892, 1),
(8,  3, 'Cuộc sống hàng ngày ở Yokohama — thay bóng đèn, đi tàu SeaBus',
 'https://www.youtube.com/watch?v=8z49u-tul5Y', 487, 2),
(9,  3, 'Câu chuyện Takeshi và con cá vàng đặc biệt',
 'https://www.youtube.com/watch?v=tfeebeFRpuY', 624, 3),
-- Course 4: N4 cuộc sống hàng ngày (2 bài)
(10, 4, 'Hoa anh đào và ý nghĩa của những khởi đầu mới',
 'https://www.youtube.com/watch?v=4poj4-3MS0M', 636, 1),
(11, 4, 'Luyện tập từ vựng N4 qua câu ví dụ thực tế',
 'https://www.youtube.com/watch?v=q2YKfqz6JkY', 660, 2),
-- Course 5: N3 xã hội & cảm xúc (3 bài)
(12, 5, 'Hôn hoạt — sự kiện tìm kiếm bạn đời ở Nhật Bản',
 'https://www.youtube.com/watch?v=hKj9cI1QhcE', 375, 1),
(13, 5, 'Câu chuyện bị ốm nặng khi du lịch ở Malaysia',
 'https://www.youtube.com/watch?v=sCZ8-NN-Utg', 485, 2),
(14, 5, 'Thảo luận về tiêu chuẩn người bạn đời lý tưởng',
 'https://www.youtube.com/watch?v=X7AmvtO6pEE', 875, 3),
-- Course 6: N3 câu chuyện & du lịch (2 bài)
(15, 6, 'Lịch trình một ngày làm việc của Yamada-san',
 'https://www.youtube.com/watch?v=3o2Sc6cyVDY', 725, 1),
(16, 6, 'Khám phá thành phố Kofu — Yamanashi và cảm nhận hạnh phúc',
 'https://www.youtube.com/watch?v=L43GiFQMQrU', 720, 2),
-- Course 7: N2 công việc & kinh doanh (2 bài)
(17, 7, 'Văn hóa công sở Nhật Bản — 報連相 và 空気を読む',
 'https://www.youtube.com/watch?v=Nu80ZB0ugmw', 585, 1),
(18, 7, 'Lắp ráp studio mới — kính ngữ và ngôn ngữ thân mật với đồng nghiệp',
 'https://www.youtube.com/watch?v=GnJT6a1yUes', 973, 2),
-- Course 8: N2 phỏng vấn & hội họp (2 bài)
(19, 8, 'Phỏng vấn xin việc làm thêm tại nhà hàng',
 'https://www.youtube.com/watch?v=c9v9shoem50', 720, 1),
(20, 8, 'Tiếng Nhật kinh doanh — email báo cáo và họp online',
 'https://www.youtube.com/watch?v=4carvK20fUU', 720, 2),
-- Course 9: N1 kính ngữ & văn phong trang trọng (2 bài)
(21, 9, 'Bốn loại kính ngữ tiếng Nhật — phân tích chi tiết',
 'https://www.youtube.com/watch?v=SnmEXprKUqs', 655, 1),
(22, 9, 'Từ vựng mô tả hoa văn và họa tiết vải — thực hành nâng cao',
 'https://www.youtube.com/watch?v=oJO9LesSxWo', 586, 2),
-- Course 10: N1 học thuật & phân tích (2 bài)
(23, 10, 'Kính ngữ qua ví dụ động từ biến đổi — 尊敬語 vs 謙譲語',
 'https://www.youtube.com/watch?v=G6yzK93EbAk', 720, 1),
(24, 10, 'Ngữ pháp N1 trong hội thoại tự nhiên',
 'https://www.youtube.com/watch?v=UzVU72roWrA', 720, 2);

-- ── Quizzes ─────────────────────────────────────────────────
INSERT INTO quizzes (id, lesson_id, pass_score) VALUES
(1,  1,  70), (2,  2,  70), (3,  3,  70),
(4,  4,  70), (5,  5,  70), (6,  6,  70),
(7,  7,  70), (8,  8,  70), (9,  9,  70),
(10, 10, 70), (11, 11, 70),
(12, 12, 70), (13, 13, 70), (14, 14, 70),
(15, 15, 70), (16, 16, 70),
(17, 17, 75), (18, 18, 75), (19, 19, 75), (20, 20, 75),
(21, 21, 80), (22, 22, 80), (23, 23, 80), (24, 24, 80);

-- ── Questions ───────────────────────────────────────────────
-- 10 câu/quiz: order_index 1-4 = VOCABULARY, 5-7 = CONTENT, 8-10 = SEQUENCE
-- VOCABULARY: correct_option = index đúng trong options, correct_answer_text = từ cần điền
-- CONTENT:    correct_option = index đúng, correct_answer_text = NULL
-- SEQUENCE:   correct_option = 0, correct_answer_text = NULL,
--             correct_order = [a,b,c,d] — index trong options theo thứ tự đúng

-- ════════════════════════════════════════════════════════════
-- QUIZ 1: Mời bạn đi chơi & đặt bàn nhà hàng (XQlTl30PIpw)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(1, 1,
 'Khi gọi điện thoại trong hội thoại, nhân vật mở đầu cuộc gọi bằng từ "___". Hãy điền từ tiếng Nhật phù hợp.',
 '["もしもし", "ありがとう", "すみません", "おはよう"]',
 0, 'もしもし', NULL, 1, 'VOCABULARY'),

(2, 1,
 'Nhân vật dùng từ "___" để nói về môn thể thao yêu thích của mình trong hội thoại.',
 '["サッカー", "テニス", "バスケット", "ゴルフ"]',
 0, 'サッカー', NULL, 2, 'VOCABULARY'),

(3, 1,
 'Khi đặt bàn tại nhà hàng qua điện thoại, nhân vật nói "___をしたいんですが". Hãy điền từ còn thiếu.',
 '["予約", "注文", "確認", "相談"]',
 0, '予約', NULL, 3, 'VOCABULARY'),

(4, 1,
 'Nhân vật kể về sở thích xem "___" (phim). Hãy điền từ tiếng Nhật đúng.',
 '["映画", "ドラマ", "アニメ", "バラエティ"]',
 0, '映画', NULL, 4, 'VOCABULARY'),

(5, 1,
 'Nhân vật gọi điện cho bạn với mục đích chính là gì?',
 '["Rủ bạn đi uống rượu ở quán bar", "Hỏi thăm sức khỏe", "Thông báo việc học", "Đặt hàng online"]',
 0, NULL, NULL, 5, 'CONTENT'),

(6, 1,
 'Khi đặt bàn nhà hàng qua điện thoại, nhân vật hỏi điều gì đầu tiên?',
 '["Hỏi còn bàn trống không", "Hỏi thực đơn có gì", "Hỏi giá cả thế nào", "Hỏi địa chỉ ở đâu"]',
 0, NULL, NULL, 6, 'CONTENT'),

(7, 1,
 'Sở thích của nhân vật được đề cập trong hội thoại là gì?',
 '["Xem phim và chơi bóng đá", "Đọc sách và nấu ăn", "Du lịch và chụp ảnh", "Nghe nhạc và vẽ tranh"]',
 0, NULL, NULL, 7, 'CONTENT'),

(8, 1,
 'Sắp xếp các bước trong cuộc gọi đặt bàn nhà hàng theo đúng thứ tự:',
 '["Hỏi xem còn bàn trống không", "Chào và bắt đầu cuộc gọi (もしもし)", "Xác nhận ngày giờ đặt bàn", "Cảm ơn và kết thúc cuộc gọi"]',
 0, NULL, '[1,0,2,3]', 8, 'SEQUENCE'),

(9, 1,
 'Sắp xếp các chủ đề được đề cập trong hội thoại theo đúng thứ tự:',
 '["Bàn về môn thể thao yêu thích", "Rủ nhau đi uống rượu", "Đặt bàn nhà hàng qua điện thoại", "Nói về sở thích xem phim"]',
 0, NULL, '[1,0,2,3]', 9, 'SEQUENCE'),

(10, 1,
 'Sắp xếp các sự kiện theo đúng thứ tự xảy ra trong toàn bộ hội thoại:',
 '["Đặt bàn nhà hàng và xác nhận lịch hẹn", "Hai người chào nhau qua điện thoại", "Nói chuyện về sở thích cá nhân", "Hẹn gặp nhau vào dịp cụ thể"]',
 0, NULL, '[1,2,0,3]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 2: Nói về đồ ăn và thức uống yêu thích (ihdJ84esAMg)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(11, 2,
 'Trong hội thoại, Kevin nói món ăn yêu thích của anh là "___". Hãy điền từ tiếng Nhật đúng.',
 '["ハンバーガー", "ラーメン", "カレー", "ピザ"]',
 0, 'ハンバーガー', NULL, 1, 'VOCABULARY'),

(12, 2,
 'Hanako nói cô ấy thích "___" nhất trong các món ăn Nhật. Hãy điền từ còn thiếu.',
 '["寿司", "天ぷら", "うどん", "そば"]',
 0, '寿司', NULL, 2, 'VOCABULARY'),

(13, 2,
 'Từ "___" trong tiếng Nhật có nghĩa là "trái cây" — được nhắc đến trong hội thoại.',
 '["くだもの", "やさい", "にく", "さかな"]',
 0, 'くだもの', NULL, 3, 'VOCABULARY'),

(14, 2,
 'Khi hỏi về đồ uống yêu thích, nhân vật dùng từ "___" (đồ uống). Hãy điền từ tiếng Nhật.',
 '["のみもの", "たべもの", "おかし", "りょうり"]',
 0, 'のみもの', NULL, 4, 'VOCABULARY'),

(15, 2,
 'Trong hội thoại, Kevin và Hanako đang nói về chủ đề gì?',
 '["Món ăn và đồ uống yêu thích", "Kế hoạch du lịch cuối tuần", "Học tiếng Nhật tại trường", "Cuộc sống du học ở Nhật"]',
 0, NULL, NULL, 5, 'CONTENT'),

(16, 2,
 'Kevin thích loại đồ ăn nào hơn theo nội dung hội thoại?',
 '["Đồ ăn phương Tây hơn đồ ăn Nhật", "Đồ ăn Nhật hơn đồ ăn phương Tây", "Cả hai như nhau, không phân biệt", "Không được đề cập rõ trong hội thoại"]',
 0, NULL, NULL, 6, 'CONTENT'),

(17, 2,
 'Hanako hỏi Kevin điều gì về đồ ăn trong phần đầu hội thoại?',
 '["Món ăn yêu thích là gì", "Có biết nấu ăn không", "Hay ăn ở đâu mỗi ngày", "Có bị dị ứng thức ăn không"]',
 0, NULL, NULL, 7, 'CONTENT'),

(18, 2,
 'Sắp xếp các nội dung hội thoại theo đúng thứ tự xuất hiện:',
 '["Nói về đồ uống yêu thích", "Hỏi về món ăn Nhật yêu thích", "Kevin trả lời thích hamburger", "Nói về các loại trái cây"]',
 0, NULL, '[1,2,3,0]', 8, 'SEQUENCE'),

(19, 2,
 'Sắp xếp các bước trong hội thoại hỏi-đáp về ẩm thực theo đúng thứ tự:',
 '["Cả hai kết thúc hội thoại", "Hanako đặt câu hỏi về sở thích ăn uống", "Kevin hỏi lại Hanako về sở thích", "Hanako trả lời thích món ăn Nhật"]',
 0, NULL, '[1,2,3,0]', 9, 'SEQUENCE'),

(20, 2,
 'Sắp xếp các nhóm thực phẩm được nhắc đến theo thứ tự xuất hiện trong hội thoại:',
 '["Đồ uống (のみもの)", "Món ăn chính (食べもの)", "Trái cây (くだもの)", "Đồ ăn nhẹ (おかし)"]',
 0, NULL, '[1,2,0,3]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 3: Tự giới thiệu bản thân (ilsJ1F5u-QE)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(21, 3,
 'Kevin dùng từ "___" để nói về nơi mình đang sống (ký túc xá). Hãy điền từ tiếng Nhật đúng.',
 '["りょう", "アパート", "うち", "ホテル"]',
 0, 'りょう', NULL, 1, 'VOCABULARY'),

(22, 3,
 'Từ "___" có nghĩa là "quốc tịch" trong tiếng Nhật — được dùng khi Kevin giới thiệu bản thân.',
 '["こくせき", "じゅうしょ", "なまえ", "しごと"]',
 0, 'こくせき', NULL, 2, 'VOCABULARY'),

(23, 3,
 'Khi tự giới thiệu lần đầu, Kevin dùng cụm "___" (lần đầu được gặp). Hãy điền từ còn thiếu.',
 '["はじめまして", "よろしく", "おねがいします", "すみません"]',
 0, 'はじめまして', NULL, 3, 'VOCABULARY'),

(24, 3,
 'Từ "___" trong tiếng Nhật có nghĩa là "tuổi" — được Kevin dùng khi nói về độ tuổi của mình.',
 '["さい", "ねん", "かい", "まい"]',
 0, 'さい', NULL, 4, 'VOCABULARY'),

(25, 3,
 'Kevin bao nhiêu tuổi trong hội thoại?',
 '["22 tuổi", "20 tuổi", "25 tuổi", "18 tuổi"]',
 0, NULL, NULL, 5, 'CONTENT'),

(26, 3,
 'Kevin đang sống ở đâu tại Nhật Bản?',
 '["Ký túc xá ở Tokyo", "Căn hộ ở Osaka", "Nhà trọ ở Kyoto", "Nhà gia đình người quen"]',
 0, NULL, NULL, 6, 'CONTENT'),

(27, 3,
 'Mục đích chính của hội thoại này là gì?',
 '["Kevin đang phỏng vấn và giới thiệu bản thân", "Kevin hỏi thăm bạn bè quen biết", "Kevin xin việc tại công ty Nhật", "Kevin đăng ký học tiếng Nhật"]',
 0, NULL, NULL, 7, 'CONTENT'),

(28, 3,
 'Sắp xếp các thông tin Kevin giới thiệu theo đúng thứ tự trong hội thoại:',
 '["Nói về nơi ở — ký túc xá Tokyo", "Chào hỏi — はじめまして", "Nói tuổi — 22 tuổi", "Giới thiệu tên và quốc tịch"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(29, 3,
 'Sắp xếp các phần trong bài tự giới thiệu của Kevin theo đúng thứ tự:',
 '["Nói về hoàn cảnh sống hiện tại", "Chào hỏi ban đầu", "Nêu quốc tịch và xuất xứ", "Nói về tuổi và học vấn"]',
 0, NULL, '[1,2,0,3]', 9, 'SEQUENCE'),

(30, 3,
 'Sắp xếp các câu hỏi được đặt ra cho Kevin theo đúng thứ tự trong cuộc phỏng vấn:',
 '["Hỏi về nơi ở hiện tại", "Hỏi về tên và xuất xứ", "Hỏi về tuổi tác", "Hỏi về mục đích đến Nhật"]',
 0, NULL, '[1,2,0,3]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 4: Phỏng vấn xin việc tại quán cà phê (FPChrbGzntA)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(31, 4,
 'Chủ quán nói ngày "___" là ngày nghỉ hàng tuần của quán cà phê. Hãy điền từ tiếng Nhật.',
 '["かようび", "もくようび", "どようび", "にちようび"]',
 0, 'かようび', NULL, 1, 'VOCABULARY'),

(32, 4,
 'Hashimoto Mai dùng từ xưng hô "___" khi nói chuyện lịch sự với chủ quán (tôi — nữ).',
 '["わたし", "ぼく", "おれ", "うち"]',
 0, 'わたし', NULL, 2, 'VOCABULARY'),

(33, 4,
 'Chủ quán hỏi về "___" (kinh nghiệm làm việc) của ứng viên. Hãy điền từ còn thiếu.',
 '["けいけん", "しゅみ", "せいかく", "がくれき"]',
 0, 'けいけん', NULL, 3, 'VOCABULARY'),

(34, 4,
 'Quán cà phê mở cửa đến "___" (17 giờ) mỗi ngày theo thông tin chủ quán cung cấp.',
 '["じゅうしちじ", "じゅうごじ", "じゅうはちじ", "じゅうろくじ"]',
 0, 'じゅうしちじ', NULL, 4, 'VOCABULARY'),

(35, 4,
 'Hashimoto Mai đến gặp chủ quán cà phê với mục đích gì?',
 '["Phỏng vấn xin việc làm thêm", "Uống cà phê và hỏi thực đơn", "Đặt tiệc sinh nhật cho nhóm bạn", "Hỏi về giờ mở cửa của quán"]',
 0, NULL, NULL, 5, 'CONTENT'),

(36, 4,
 'Quán cà phê trong hội thoại nghỉ vào ngày nào trong tuần?',
 '["Thứ Ba", "Thứ Tư", "Thứ Bảy", "Chủ Nhật"]',
 0, NULL, NULL, 6, 'CONTENT'),

(37, 4,
 'Thái độ của chủ quán đối với Hashimoto Mai trong buổi phỏng vấn như thế nào?',
 '["Tích cực và sẵn sàng xem xét", "Từ chối ngay vì thiếu kinh nghiệm", "Yêu cầu thêm giấy tờ bổ sung", "Bảo quay lại vào hôm khác"]',
 0, NULL, NULL, 7, 'CONTENT'),

(38, 4,
 'Sắp xếp các sự kiện trong buổi phỏng vấn theo đúng thứ tự:',
 '["Chủ quán giải thích lịch làm và ngày nghỉ", "Hashimoto Mai tự giới thiệu và nêu lý do muốn làm", "Chủ quán chào đón và mời ngồi", "Hai bên thống nhất và kết thúc buổi gặp"]',
 0, NULL, '[2,1,0,3]', 8, 'SEQUENCE'),

(39, 4,
 'Sắp xếp các nội dung được trao đổi trong buổi phỏng vấn theo đúng thứ tự:',
 '["Hỏi về kinh nghiệm làm việc trước đây", "Chào hỏi và giới thiệu đôi bên", "Thảo luận về ngày và giờ làm việc", "Kết thúc và hẹn liên lạc lại"]',
 0, NULL, '[1,0,2,3]', 9, 'SEQUENCE'),

(40, 4,
 'Sắp xếp thông tin về điều kiện làm việc tại quán theo thứ tự chủ quán trình bày:',
 '["Mức lương và phúc lợi", "Ngày nghỉ hàng tuần (thứ Ba)", "Giờ làm việc (10 giờ đến 17 giờ)", "Yêu cầu về trang phục"]',
 0, NULL, '[1,2,0,3]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 5: Tìm đồ thất lạc tại cửa hàng (i2UEIUI3XRI)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(41, 5,
 'Trong hội thoại, nhân vật đang tìm chiếc "___" (ô/dù) bị bỏ quên. Hãy điền từ tiếng Nhật.',
 '["かさ", "かばん", "さいふ", "けいたい"]',
 0, 'かさ', NULL, 1, 'VOCABULARY'),

(42, 5,
 'Chiếc ô có đặc điểm làm bằng "___" (nhựa trong suốt). Hãy điền từ đúng.',
 '["ビニール", "プラスチック", "アルミ", "ガラス"]',
 0, 'ビニール', NULL, 2, 'VOCABULARY'),

(43, 5,
 'Nhân vật biên tập viên manga dùng ứng dụng "___" để gặp giáo viên trực tuyến.',
 '["ズーム", "ライン", "スカイプ", "チャット"]',
 0, 'ズーム', NULL, 3, 'VOCABULARY'),

(44, 5,
 'Chiếc ô có móc khoá hình "___" (nhân vật nổi tiếng). Hãy điền từ tiếng Nhật.',
 '["キティちゃん", "ミッキー", "ドラえもん", "ピカチュウ"]',
 0, 'キティちゃん', NULL, 4, 'VOCABULARY'),

(45, 5,
 'Nhân vật đến đâu để tìm chiếc ô bị bỏ quên?',
 '["Cửa hàng nơi bị quên ô", "Đồn cảnh sát gần nhất", "Bến xe bus", "Ga tàu điện"]',
 0, NULL, NULL, 5, 'CONTENT'),

(46, 5,
 'Đặc điểm nhận dạng chiếc ô bị mất là gì?',
 '["Ô nhựa trong suốt có móc khoá hình Kitty-chan", "Ô đen có tên chủ viết trên tay cầm", "Ô màu đỏ cỡ lớn dùng khi mưa to", "Ô gấp màu xanh có hoa văn"]',
 0, NULL, NULL, 6, 'CONTENT'),

(47, 5,
 'Nhân vật thứ hai trong hội thoại làm nghề gì?',
 '["Biên tập viên manga", "Giáo viên dạy tiếng Nhật", "Nhân viên cửa hàng", "Phóng viên báo chí"]',
 0, NULL, NULL, 7, 'CONTENT'),

(48, 5,
 'Sắp xếp các sự kiện trong hội thoại tìm đồ thất lạc theo đúng thứ tự:',
 '["Nhân viên kiểm tra kho đồ thất lạc", "Nhân vật phát hiện mất ô và đến cửa hàng", "Nhân vật mô tả đặc điểm chiếc ô", "Chiếc ô được tìm thấy và trả lại"]',
 0, NULL, '[1,0,2,3]', 8, 'SEQUENCE'),

(49, 5,
 'Sắp xếp thứ tự các thông tin nhân vật cung cấp khi báo đồ thất lạc:',
 '["Mô tả chi tiết phân biệt (móc khoá Kitty)", "Cho biết tên đồ vật (ô — かさ)", "Giải thích chất liệu (ビニール)", "Nêu thời gian và địa điểm bỏ quên"]',
 0, NULL, '[1,2,0,3]', 9, 'SEQUENCE'),

(50, 5,
 'Sắp xếp các phần trong hội thoại biên tập viên manga theo đúng thứ tự:',
 '["Kết thúc buổi gặp trực tuyến", "Chào hỏi và bắt đầu kết nối Zoom", "Thảo luận về nội dung công việc", "Giới thiệu đôi bên và mục đích gặp"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 6: Hội thoại buổi sáng (hVOvyR3fSrU)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(51, 6,
 'Nhân vật hỏi về "___" (thời tiết) trong hội thoại buổi sáng. Hãy điền từ tiếng Nhật.',
 '["てんき", "きおん", "きせつ", "くうき"]',
 0, 'てんき', NULL, 1, 'VOCABULARY'),

(52, 6,
 'Trong hội thoại, nhân vật nói đang học "___" (tiếng Nhật). Hãy điền từ đúng.',
 '["にほんご", "えいご", "ちゅうごくご", "かんこくご"]',
 0, 'にほんご', NULL, 2, 'VOCABULARY'),

(53, 6,
 'Nhân vật dùng từ "___" để hỏi kế hoạch trong ngày (今日の___は？). Hãy điền từ còn thiếu.',
 '["よてい", "しごと", "べんきょう", "けいかく"]',
 0, 'よてい', NULL, 3, 'VOCABULARY'),

(54, 6,
 'Từ "___" trong tiếng Nhật có nghĩa là "buổi sáng" — được dùng trong lời chào đầu hội thoại.',
 '["あさ", "ひる", "よる", "ゆうがた"]',
 0, 'あさ', NULL, 4, 'VOCABULARY'),

(55, 6,
 'Hội thoại này xảy ra vào thời điểm nào trong ngày?',
 '["Buổi sáng", "Buổi trưa", "Buổi chiều", "Buổi tối"]',
 0, NULL, NULL, 5, 'CONTENT'),

(56, 6,
 'Nhân vật trong hội thoại đang học ngôn ngữ nào?',
 '["Tiếng Nhật", "Tiếng Anh", "Tiếng Trung", "Tiếng Hàn"]',
 0, NULL, NULL, 6, 'CONTENT'),

(57, 6,
 'Nội dung chính của hội thoại buổi sáng này là gì?',
 '["Nói chuyện về thời tiết, việc học và kế hoạch trong ngày", "Bàn về công việc và dự án mới", "Hỏi thăm sức khỏe và gia đình", "Lên kế hoạch đi du lịch cuối tuần"]',
 0, NULL, NULL, 7, 'CONTENT'),

(58, 6,
 'Sắp xếp các chủ đề được đề cập trong hội thoại buổi sáng theo đúng thứ tự:',
 '["Kế hoạch trong ngày hôm nay", "Chào buổi sáng (おはよう)", "Nói về việc học tiếng Nhật", "Hỏi về thời tiết bên ngoài"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(59, 6,
 'Sắp xếp các câu hỏi được đặt ra trong hội thoại theo đúng thứ tự:',
 '["Kế hoạch trong ngày là gì?", "Thời tiết hôm nay thế nào?", "Đang học tiếng Nhật đến đâu rồi?", "Tối nay có rảnh không?"]',
 0, NULL, '[1,2,0,3]', 9, 'SEQUENCE'),

(60, 6,
 'Sắp xếp cấu trúc của một hội thoại buổi sáng điển hình theo đúng thứ tự:',
 '["Hỏi thăm và chia sẻ thông tin ngắn", "Chào hỏi ban đầu", "Bàn về kế hoạch và chia tay", "Nói về thời tiết hoặc tin tức"]',
 0, NULL, '[1,3,0,2]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 7: Giới thiệu điểm du lịch Okinawa (uAgTIfWQ_Xs)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(61, 7,
 'Kiki giới thiệu "___" (thủy cung nổi tiếng ở Okinawa). Hãy điền tên tiếng Nhật.',
 '["ちゅらうみすいぞくかん", "うえのどうぶつえん", "おきなわこうえん", "なはすいぞくかん"]',
 0, 'ちゅらうみすいぞくかん', NULL, 1, 'VOCABULARY'),

(62, 7,
 'Kiki nói từ sân bay đến trung tâm thành phố Naha mất khoảng "___" phút. Hãy điền từ đúng.',
 '["よんじっぷん", "にじっぷん", "さんじっぷん", "ごじっぷん"]',
 0, 'よんじっぷん', NULL, 2, 'VOCABULARY'),

(63, 7,
 'Di tích lịch sử nổi tiếng Kiki giới thiệu là "___" (Lâu đài Shuri). Hãy điền từ tiếng Nhật.',
 '["しゅりじょう", "おおさかじょう", "ひめじじょう", "なごやじょう"]',
 0, 'しゅりじょう', NULL, 3, 'VOCABULARY'),

(64, 7,
 'Kiki giới thiệu "___" (đảo Kouri) là điểm đến lãng mạn ở Okinawa. Hãy điền từ đúng.',
 '["こうりじま", "いしがきじま", "みやこじま", "くめじま"]',
 0, 'こうりじま', NULL, 4, 'VOCABULARY'),

(65, 7,
 'Kiki đang giới thiệu các địa điểm du lịch ở tỉnh/vùng nào của Nhật Bản?',
 '["Okinawa", "Kyoto", "Hokkaido", "Tokyo"]',
 0, NULL, NULL, 5, 'CONTENT'),

(66, 7,
 'Từ sân bay Naha, mất bao lâu để vào trung tâm thành phố?',
 '["Khoảng 40 phút", "Khoảng 20 phút", "Khoảng 1 tiếng", "Khoảng 10 phút"]',
 0, NULL, NULL, 6, 'CONTENT'),

(67, 7,
 'Kiki giới thiệu những địa điểm nào trong video về Okinawa?',
 '["Thủy cung Churaumi, Lâu đài Shuri, bãi biển Hyakuna, đảo Kouri", "Núi Fuji, đền Asakusa, vịnh Tokyo, công viên Ueno", "Khu phố cổ Kyoto, chùa vàng Kinkakuji, đền Fushimi Inari", "Vườn thú Asahiyama, đầm Toya, núi lửa Showa, hoa lavender"]',
 0, NULL, NULL, 7, 'CONTENT'),

(68, 7,
 'Sắp xếp các địa điểm theo thứ tự Kiki giới thiệu trong video:',
 '["Lâu đài Shuri (首里城)", "Sân bay Naha và khoảng cách vào trung tâm", "Đảo Kouri (古宇利島)", "Thủy cung Churaumi (美ら海水族館)"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(69, 7,
 'Sắp xếp theo thứ tự loại hình địa điểm du lịch được giới thiệu:',
 '["Di tích lịch sử — lâu đài", "Thông tin giao thông — sân bay", "Thiên nhiên — đảo và bãi biển", "Tham quan — thủy cung"]',
 0, NULL, '[1,3,0,2]', 9, 'SEQUENCE'),

(70, 7,
 'Sắp xếp hành trình tham quan Okinawa theo thứ tự hợp lý được gợi ý trong video:',
 '["Nghỉ ngơi và tắm biển tại bãi biển Hyakuna", "Hạ cánh xuống sân bay Naha", "Tham quan Lâu đài Shuri", "Ghé thủy cung Churaumi xem cá voi mập"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 8: Cuộc sống hàng ngày ở Yokohama (8z49u-tul5Y)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(71, 8,
 'Nhân vật cần thay "___" (bóng đèn) bị hỏng trong nhà. Hãy điền từ tiếng Nhật.',
 '["でんきゅう", "でんち", "コンセント", "スイッチ"]',
 0, 'でんきゅう', NULL, 1, 'VOCABULARY'),

(72, 8,
 'Nhân vật đi "___" (tàu thủy/phà) để di chuyển tham quan cảng Yokohama.',
 '["シーバス", "でんしゃ", "バス", "タクシー"]',
 0, 'シーバス', NULL, 2, 'VOCABULARY'),

(73, 8,
 'Khu vực kho tàu lịch sử nổi tiếng ở Yokohama được gọi là "___". Hãy điền từ tiếng Nhật.',
 '["あかれんがそうこ", "みなとみらい", "ちゅかがい", "さんけいえん"]',
 0, 'あかれんがそうこ', NULL, 3, 'VOCABULARY'),

(74, 8,
 'Nhân vật dùng từ "___" (thay/đổi) khi nói về việc xử lý bóng đèn hỏng. Hãy điền từ đúng.',
 '["とりかえる", "なおす", "つける", "けす"]',
 0, 'とりかえる', NULL, 4, 'VOCABULARY'),

(75, 8,
 'Video ghi lại cuộc sống hàng ngày ở thành phố nào của Nhật Bản?',
 '["Yokohama", "Tokyo", "Osaka", "Kobe"]',
 0, NULL, NULL, 5, 'CONTENT'),

(76, 8,
 'Nhân vật dùng phương tiện gì để tham quan cảng Yokohama?',
 '["Tàu thủy SeaBus", "Xe điện monorail", "Xe đạp thuê", "Đi bộ dọc bờ biển"]',
 0, NULL, NULL, 6, 'CONTENT'),

(77, 8,
 'Khu Akarenga (赤レンガ倉庫 — kho gạch đỏ) có đặc điểm gì theo video?',
 '["Khu nhà kho cổ được cải tạo thành nơi mua sắm và ăn uống", "Khu phố nhà hàng Trung Hoa nổi tiếng", "Công viên bên bờ biển có nhiều hoa đẹp", "Bảo tàng lịch sử cảng Yokohama"]',
 0, NULL, NULL, 7, 'CONTENT'),

(78, 8,
 'Sắp xếp các hoạt động trong ngày ở Yokohama theo đúng thứ tự:',
 '["Khám phá khu Akarenga (赤レンガ倉庫)", "Thay bóng đèn hỏng trong nhà", "Đi SeaBus trên cảng Yokohama", "Ra ngoài và đến bến tàu thủy"]',
 0, NULL, '[1,3,2,0]', 8, 'SEQUENCE'),

(79, 8,
 'Sắp xếp các địa điểm theo thứ tự nhân vật đến trong video:',
 '["Khu mua sắm Akarenga", "Xuất phát từ nhà", "Bến tàu SeaBus", "Cảng Yokohama Minato Mirai"]',
 0, NULL, '[1,2,3,0]', 9, 'SEQUENCE'),

(80, 8,
 'Sắp xếp các công việc nhà và hoạt động bên ngoài theo thứ tự xuất hiện trong video:',
 '["Chụp ảnh phong cảnh cảng biển", "Phát hiện bóng đèn hỏng", "Mua bóng đèn mới ở cửa hàng", "Lắp bóng đèn và kiểm tra"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 9: Câu chuyện Takeshi và con cá vàng (tfeebeFRpuY)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(81, 9,
 'Nhân vật chính Takeshi có sở thích đặc biệt là thích "___" (cá). Hãy điền từ tiếng Nhật.',
 '["さかな", "とり", "むし", "どうぶつ"]',
 0, 'さかな', NULL, 1, 'VOCABULARY'),

(82, 9,
 'Takeshi tìm thấy con "___" (cá vàng) đẹp ở một cái ao. Hãy điền từ đúng.',
 '["きんぎょ", "こい", "めだか", "フナ"]',
 0, 'きんぎょ', NULL, 2, 'VOCABULARY'),

(83, 9,
 'Người cho Takeshi con cá trong câu chuyện là "___" (ông lão). Hãy điền từ tiếng Nhật.',
 '["おじいさん", "おばあさん", "おじさん", "おにいさん"]',
 0, 'おじいさん', NULL, 3, 'VOCABULARY'),

(84, 9,
 'Takeshi bao nhiêu tuổi trong câu chuyện? Hãy điền từ tiếng Nhật chỉ độ tuổi đó.',
 '["じゅうにさい", "じゅっさい", "じゅうさんさい", "じゅうごさい"]',
 0, 'じゅうにさい', NULL, 4, 'VOCABULARY'),

(85, 9,
 'Takeshi đã làm gì khi thấy con cá vàng đẹp ở ao?',
 '["Xin ông lão cho con cá về nuôi", "Mua cá ở cửa hàng cá cảnh gần đó", "Bắt cá bằng vợt tự làm", "Nhờ bạn bè cùng đến bắt giúp"]',
 0, NULL, NULL, 5, 'CONTENT'),

(86, 9,
 'Ông lão phản ứng như thế nào với yêu cầu của Takeshi?',
 '["Vui vẻ đồng ý cho Takeshi con cá", "Từ chối vì cá rất quý giá", "Yêu cầu Takeshi làm việc để đổi lấy cá", "Không trả lời và bỏ đi"]',
 0, NULL, NULL, 6, 'CONTENT'),

(87, 9,
 'Điều gì đặc biệt về con cá vàng mà Takeshi tìm thấy?',
 '["Rất đẹp, Takeshi chưa từng thấy loại cá như vậy", "Cá có khả năng phát sáng trong bóng tối", "Cá biết nhảy lên khỏi mặt nước theo lệnh", "Cá có nhiều màu sắc khác thường"]',
 0, NULL, NULL, 7, 'CONTENT'),

(88, 9,
 'Sắp xếp các sự kiện trong câu chuyện về Takeshi theo đúng thứ tự:',
 '["Ông lão đồng ý cho Takeshi con cá", "Takeshi tìm thấy con cá vàng đẹp ở ao", "Takeshi đưa cá về nhà và nuôi", "Giới thiệu Takeshi 12 tuổi, rất thích cá"]',
 0, NULL, '[3,1,0,2]', 8, 'SEQUENCE'),

(89, 9,
 'Sắp xếp diễn biến cảm xúc của Takeshi theo đúng thứ tự trong câu chuyện:',
 '["Hạnh phúc khi được nuôi cá ở nhà", "Ngạc nhiên và mê đắm khi nhìn thấy cá vàng", "Hồi hộp khi xin ông lão cho cá", "Vui mừng khi ông lão đồng ý"]',
 0, NULL, '[1,2,3,0]', 9, 'SEQUENCE'),

(90, 9,
 'Sắp xếp các yếu tố cấu thành câu chuyện theo đúng thứ tự xuất hiện:',
 '["Kết thúc — Takeshi nuôi cá và hạnh phúc", "Mở đầu — giới thiệu Takeshi và sở thích", "Cao trào — xin ông lão cho cá", "Phát triển — Takeshi phát hiện cá vàng đẹp"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 10: Hoa anh đào và khởi đầu mới (4poj4-3MS0M)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(91, 10,
 'Nhân vật nói về mùa "___" (hoa anh đào nở) ở Nhật Bản. Hãy điền từ tiếng Nhật.',
 '["さくら", "ゆき", "あじさい", "こうよう"]',
 0, 'さくら', NULL, 1, 'VOCABULARY'),

(92, 10,
 'Miku chuyển đến thành phố "___" để bắt đầu cuộc sống mới. Hãy điền từ tiếng Nhật.',
 '["きょうと", "とうきょう", "おおさか", "なごや"]',
 0, 'きょうと', NULL, 2, 'VOCABULARY'),

(93, 10,
 'Nhân vật dùng từ "___" (khởi đầu/bắt đầu mới) để nói về ý nghĩa của hoa anh đào.',
 '["はじまり", "おわり", "かわり", "つづき"]',
 0, 'はじまり', NULL, 3, 'VOCABULARY'),

(94, 10,
 'Kiki hiện đang sống ở thành phố "___" (Vancouver — Canada). Hãy điền từ tiếng Nhật.',
 '["バンクーバー", "ニューヨーク", "ロンドン", "シドニー"]',
 0, 'バンクーバー', NULL, 4, 'VOCABULARY'),

(95, 10,
 'Miku và Kiki đang nói chuyện về chủ đề gì?',
 '["Hoa anh đào và ý nghĩa của nó với những khởi đầu mới", "Kế hoạch đi xem hoa anh đào cùng nhau", "Lịch sử và nguồn gốc của hoa anh đào Nhật", "Cách chụp ảnh hoa anh đào đẹp nhất"]',
 0, NULL, NULL, 5, 'CONTENT'),

(96, 10,
 'Tại sao Miku chuyển đến Kyoto theo nội dung hội thoại?',
 '["Để bắt đầu cuộc sống mới (công việc/học tập)", "Để thăm gia đình đang sống ở Kyoto", "Vì muốn xem hoa anh đào ở Kyoto", "Vì giá thuê nhà ở Tokyo quá đắt"]',
 0, NULL, NULL, 6, 'CONTENT'),

(97, 10,
 'Hoa anh đào có ý nghĩa gì theo nội dung hội thoại giữa Miku và Kiki?',
 '["Biểu tượng của những khởi đầu mới trong cuộc sống", "Biểu tượng của tình yêu và sự lãng mạn", "Biểu tượng của mùa xuân và thời tiết đẹp", "Biểu tượng văn hóa truyền thống Nhật Bản"]',
 0, NULL, NULL, 7, 'CONTENT'),

(98, 10,
 'Sắp xếp các nội dung hội thoại giữa Miku và Kiki theo đúng thứ tự:',
 '["Bàn về ý nghĩa hoa anh đào — biểu tượng khởi đầu mới", "Miku thông báo đã chuyển đến Kyoto", "Cả hai chia sẻ cảm xúc khi sống xa nhau", "Kiki hỏi Miku về cuộc sống mới ở Kyoto"]',
 0, NULL, '[1,3,2,0]', 8, 'SEQUENCE'),

(99, 10,
 'Sắp xếp các chủ đề được đề cập trong hội thoại theo đúng thứ tự:',
 '["Triết lý về sự thay đổi và khởi đầu mới", "Tin tức chuyển nhà đến Kyoto", "Cuộc sống của Kiki ở Vancouver", "Mùa hoa anh đào và cảnh sắc Nhật Bản"]',
 0, NULL, '[1,2,3,0]', 9, 'SEQUENCE'),

(100, 10,
 'Sắp xếp diễn biến cảm xúc trong hội thoại theo đúng thứ tự:',
 '["Hy vọng và lạc quan về tương lai phía trước", "Ngạc nhiên khi nghe tin Miku chuyển nhà", "Nhớ nhung và tiếc nuối vì xa cách", "Chia sẻ suy nghĩ về ý nghĩa của hoa anh đào"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 11: Luyện tập từ vựng N4 (q2YKfqz6JkY)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(101, 11,
 'Từ "___" có nghĩa là "thư viện" trong tiếng Nhật — được dùng trong câu ví dụ đầu tiên của video.',
 '["としょかん", "びょういん", "ゆうびんきょく", "こうばん"]',
 0, 'としょかん', NULL, 1, 'VOCABULARY'),

(102, 11,
 'Từ "___" có nghĩa là "đối phương/người kia" trong hội thoại — xuất hiện trong phần luyện N4.',
 '["あいて", "ともだち", "かれし", "かのじょ"]',
 0, 'あいて', NULL, 2, 'VOCABULARY'),

(103, 11,
 'Từ "___" (bong bóng) được dùng trong câu ví dụ về trẻ em vui chơi. Hãy điền từ tiếng Nhật.',
 '["ふうせん", "おもちゃ", "えほん", "つみき"]',
 0, 'ふうせん', NULL, 3, 'VOCABULARY'),

(104, 11,
 'Từ "___" có nghĩa là "hương vị/mùi vị" trong tiếng Nhật — được dùng trong câu ví dụ về ẩm thực.',
 '["あじ", "におい", "いろ", "おと"]',
 0, 'あじ', NULL, 4, 'VOCABULARY'),

(105, 11,
 'Video N4 này tập trung vào hình thức học tập nào?',
 '["Luyện tập từ vựng N4 qua câu ví dụ thực tế", "Dạy ngữ pháp N4 qua bài giảng lý thuyết", "Giới thiệu văn hóa Nhật Bản qua từ khóa", "Luyện nghe hội thoại tốc độ tự nhiên"]',
 0, NULL, NULL, 5, 'CONTENT'),

(106, 11,
 'Trong câu ví dụ về 図書館 (としょかん — thư viện), nhân vật làm gì ở thư viện?',
 '["Mượn sách và đọc sách", "Gặp bạn bè để học nhóm", "Tìm tài liệu cho bài báo cáo", "Trả sách và gia hạn thẻ thư viện"]',
 0, NULL, NULL, 6, 'CONTENT'),

(107, 11,
 'Phương pháp học từ vựng được sử dụng trong video N4 này là gì?',
 '["Học từ vựng qua câu ví dụ đặt trong ngữ cảnh thực tế", "Học thuộc bảng từ vựng theo chủ đề riêng biệt", "Học qua hình ảnh minh họa màu sắc sinh động", "Học qua so sánh từng từ với tiếng Anh tương đương"]',
 0, NULL, NULL, 7, 'CONTENT'),

(108, 11,
 'Sắp xếp các nhóm từ vựng theo thứ tự xuất hiện trong video:',
 '["Từ về phụ kiện thời trang (アクセサリー)", "Từ về địa điểm (図書館)", "Từ về ẩm thực và mùi vị (味)", "Từ về thiên nhiên và màu sắc (青空)"]',
 0, NULL, '[1,3,2,0]', 8, 'SEQUENCE'),

(109, 11,
 'Sắp xếp các bước học từ vựng theo thứ tự được trình bày trong video:',
 '["Nghe câu ví dụ có dùng từ đó", "Giới thiệu từ mới và cách đọc", "Hiểu nghĩa qua ngữ cảnh câu ví dụ", "Lặp lại và ghi nhớ từ"]',
 0, NULL, '[1,0,2,3]', 9, 'SEQUENCE'),

(110, 11,
 'Sắp xếp các loại từ vựng N4 theo thứ tự được giới thiệu trong video:',
 '["Danh từ chỉ đồ vật (風船 — bong bóng)", "Danh từ chỉ địa điểm (図書館 — thư viện)", "Danh từ trừu tượng (相手 — đối phương)", "Danh từ chỉ giác quan (味 — mùi vị)"]',
 0, NULL, '[1,2,0,3]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 12: Hôn hoạt — sự kiện tìm kiếm bạn đời (hKj9cI1QhcE)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(111, 12,
 'Nhân vật kể về việc đi "___" (hoạt động tìm kiếm bạn đời). Hãy điền từ tiếng Nhật.',
 '["こんかつ", "しゅうかつ", "かつどう", "けっこん"]',
 0, 'こんかつ', NULL, 1, 'VOCABULARY'),

(112, 12,
 'Ở sự kiện, nam và nữ nói chuyện luân phiên mỗi "___" phút (10 phút). Hãy điền từ đúng.',
 '["じっぷん", "ごふん", "じゅうごふん", "さんじっぷん"]',
 0, 'じっぷん', NULL, 2, 'VOCABULARY'),

(113, 12,
 'Sau sự kiện, người tham gia viết tên người mình thích lên "___" (tờ giấy). Hãy điền từ tiếng Nhật.',
 '["かみ", "カード", "ノート", "メモ"]',
 0, 'かみ', NULL, 3, 'VOCABULARY'),

(114, 12,
 'Sự kiện có "___" (10) nam và 10 nữ tham gia. Hãy điền từ tiếng Nhật chỉ số lượng đó.',
 '["じゅうにん", "ごにん", "じゅうごにん", "にじゅうにん"]',
 0, 'じゅうにん', NULL, 4, 'VOCABULARY'),

(115, 12,
 'Nhân vật trong hội thoại đã trải nghiệm sự kiện gì?',
 '["Tham gia sự kiện hôn hoạt (こんかつ) tìm bạn đời", "Tham gia hội chợ tuyển dụng việc làm", "Tham gia cuộc thi nấu ăn", "Tham gia câu lạc bộ thể thao mới"]',
 0, NULL, NULL, 5, 'CONTENT'),

(116, 12,
 'Số lượng người tham gia sự kiện hôn hoạt được đề cập là bao nhiêu?',
 '["10 nam và 10 nữ", "5 nam và 5 nữ", "20 nam và 20 nữ", "15 nam và 15 nữ"]',
 0, NULL, NULL, 6, 'CONTENT'),

(117, 12,
 'Sau khi nói chuyện với tất cả mọi người, người tham gia làm gì để chọn người mình thích?',
 '["Viết tên người muốn gặp lại lên giấy nộp cho ban tổ chức", "Trực tiếp trao đổi số điện thoại", "Bình chọn qua ứng dụng điện thoại", "Nói thẳng trực tiếp với người mình thích"]',
 0, NULL, NULL, 7, 'CONTENT'),

(118, 12,
 'Sắp xếp các bước trong sự kiện hôn hoạt theo đúng thứ tự:',
 '["Nộp giấy ghi tên người mình thích", "Đăng ký và đến địa điểm sự kiện", "Lần lượt nói chuyện với từng người 10 phút", "Ban tổ chức thông báo kết quả ghép đôi"]',
 0, NULL, '[1,2,3,0]', 8, 'SEQUENCE'),

(119, 12,
 'Sắp xếp cảm nhận của nhân vật trước và sau sự kiện theo đúng thứ tự:',
 '["Hồi tưởng và chia sẻ cảm nhận với bạn bè", "Hồi hộp và kỳ vọng trước khi tham dự", "Ngạc nhiên vì cách thức sự kiện được tổ chức", "Hài lòng hoặc thất vọng sau kết quả"]',
 0, NULL, '[1,2,3,0]', 9, 'SEQUENCE'),

(120, 12,
 'Sắp xếp các thông tin về sự kiện theo thứ tự nhân vật kể lại:',
 '["Cách chọn người — viết tên lên giấy", "Giới thiệu về sự kiện hôn hoạt", "Số người tham gia (10 nam + 10 nữ)", "Cách thức nói chuyện — luân phiên 10 phút"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 13: Câu chuyện bị ốm ở Malaysia (sCZ8-NN-Utg)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(121, 13,
 'Nhân vật bị "___" (đau họng) khi ở Malaysia. Hãy điền cụm từ tiếng Nhật đúng.',
 '["のどがいたい", "ずつう", "はきけ", "めまい"]',
 0, 'のどがいたい', NULL, 1, 'VOCABULARY'),

(122, 13,
 'Triệu chứng tiếp theo sau đau họng là "___" (ớn lạnh/rét run). Hãy điền từ tiếng Nhật.',
 '["さむけ", "ねつ", "せき", "はなみず"]',
 0, 'さむけ', NULL, 2, 'VOCABULARY'),

(123, 13,
 'Cuối cùng bác sĩ cho "___" (tiêm/chích) và nhân vật mới khỏi bệnh. Hãy điền từ đúng.',
 '["ちゅうしゃ", "くすり", "てあて", "にゅういん"]',
 0, 'ちゅうしゃ', NULL, 3, 'VOCABULARY'),

(124, 13,
 'Bài học rút ra là không nên "___" (cố gắng quá mức). Hãy điền cụm từ tiếng Nhật.',
 '["むりをする", "はたらく", "たべすぎる", "ねすぎる"]',
 0, 'むりをする', NULL, 4, 'VOCABULARY'),

(125, 13,
 'Giáo viên Mochi bị ốm ở đất nước nào?',
 '["Malaysia", "Thailand", "Indonesia", "Philippines"]',
 0, NULL, NULL, 5, 'CONTENT'),

(126, 13,
 'Triệu chứng bệnh của Mochi diễn biến theo thứ tự nào?',
 '["Đau họng → ớn lạnh → uống thuốc không khỏi → tiêm mới khỏi", "Sốt cao → đau đầu → nhập viện → phẫu thuật", "Ho khan → khó thở → đến bác sĩ → nghỉ ngơi khỏi", "Đau bụng → nôn mửa → truyền nước biển → ra viện"]',
 0, NULL, NULL, 6, 'CONTENT'),

(127, 13,
 'Bài học Mochi muốn truyền đạt qua câu chuyện bị ốm là gì?',
 '["Không nên cố gắng quá sức, cần chú ý sức khỏe bản thân", "Nên mua bảo hiểm du lịch trước khi đi nước ngoài", "Học tiếng địa phương để giao tiếp với bác sĩ khi cần", "Nên đến khám bác sĩ ngay khi có triệu chứng đầu tiên"]',
 0, NULL, NULL, 7, 'CONTENT'),

(128, 13,
 'Sắp xếp các giai đoạn bệnh tình của Mochi theo đúng thứ tự:',
 '["Uống thuốc nhưng không có tác dụng", "Bắt đầu bị đau họng", "Được tiêm và khỏi bệnh hoàn toàn", "Xuất hiện thêm triệu chứng ớn lạnh"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(129, 13,
 'Sắp xếp hành trình chữa bệnh của Mochi theo đúng thứ tự:',
 '["Bác sĩ quyết định tiêm thay vì thuốc uống", "Đến phòng khám gặp bác sĩ", "Uống thuốc theo đơn nhưng không khỏi", "Xuất phát điểm — bị bệnh khi đang ở Malaysia"]',
 0, NULL, '[3,1,2,0]', 9, 'SEQUENCE'),

(130, 13,
 'Sắp xếp cấu trúc câu chuyện của Mochi theo đúng thứ tự:',
 '["Bài học rút ra — không nên cố sức", "Mở đầu — kể về chuyến đi Malaysia", "Đỉnh điểm — bệnh nặng hơn dù đã uống thuốc", "Phát triển — bị đau họng và ớn lạnh"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 14: Thảo luận về người bạn đời lý tưởng (X7AmvtO6pEE)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(131, 14,
 'Nhân vật nói muốn tìm người bạn đời "___" (tốt bụng/ân cần). Hãy điền từ tiếng Nhật.',
 '["やさしい", "かっこいい", "おもしろい", "まじめ"]',
 0, 'やさしい', NULL, 1, 'VOCABULARY'),

(132, 14,
 'Một nhân vật thích người có tính cách "___" (thong thả/bình tĩnh không vội). Hãy điền từ đúng.',
 '["のんびりした", "にぎやかな", "きびしい", "いそがしい"]',
 0, 'のんびりした', NULL, 2, 'VOCABULARY'),

(133, 14,
 'Nhân vật dùng từ "___" (chia tay) khi nhắc đến mối quan hệ trong quá khứ. Hãy điền từ tiếng Nhật.',
 '["わかれる", "つきあう", "けっこん", "であう"]',
 0, 'わかれる', NULL, 3, 'VOCABULARY'),

(134, 14,
 'Người bạn thứ ba thích người có sở thích "___" (nuôi/trồng cây). Hãy điền cụm từ tiếng Nhật.',
 '["しょくぶつをそだてる", "りょうりがとくい", "スポーツがすき", "おんがくができる"]',
 0, 'しょくぶつをそだてる', NULL, 4, 'VOCABULARY'),

(135, 14,
 'Ba người bạn trong hội thoại đang thảo luận về chủ đề gì?',
 '["Tiêu chuẩn chọn người bạn đời lý tưởng", "Kế hoạch tổ chức đám cưới cùng nhau", "Kinh nghiệm dùng ứng dụng hẹn hò", "Lời khuyên từ cha mẹ về hôn nhân"]',
 0, NULL, NULL, 5, 'CONTENT'),

(136, 14,
 'Điểm chung trong tiêu chuẩn chọn bạn đời của các nhân vật là gì?',
 '["Đều coi trọng tính cách và sự ân cần hơn ngoại hình", "Đều muốn người bạn đời có điều kiện tài chính tốt", "Đều muốn kết hôn sớm trước 30 tuổi", "Đều tìm người cùng sở thích âm nhạc"]',
 0, NULL, NULL, 6, 'CONTENT'),

(137, 14,
 'Nhân vật nào đề cập đến mối quan hệ tình cảm cũ trong hội thoại?',
 '["Một trong ba người kể về mối tình cũ đã kết thúc", "Không ai đề cập đến chuyện tình cũ", "Cả ba người đều kể về người yêu cũ của mình", "Chỉ nhân vật vắng mặt được nhắc đến"]',
 0, NULL, NULL, 7, 'CONTENT'),

(138, 14,
 'Sắp xếp các nội dung trong hội thoại ba người bạn theo đúng thứ tự:',
 '["Người thứ ba nói về sở thích nuôi cây của người lý tưởng", "Bắt đầu hỏi nhau về tiêu chuẩn người yêu", "Người thứ hai kể về mối tình cũ", "Người đầu tiên nói muốn tìm người tốt bụng, thong thả"]',
 0, NULL, '[1,3,2,0]', 8, 'SEQUENCE'),

(139, 14,
 'Sắp xếp các tiêu chuẩn chọn bạn đời theo thứ tự được đề cập trong hội thoại:',
 '["Có sở thích nuôi/trồng cây (người thứ ba)", "Tốt bụng và ân cần (やさしい)", "Tính cách bình tĩnh thong thả (のんびり)", "Không đề cập đến tiêu chí tài chính"]',
 0, NULL, '[1,2,0,3]', 9, 'SEQUENCE'),

(140, 14,
 'Sắp xếp cấu trúc hội thoại nhóm bạn theo đúng thứ tự:',
 '["Mỗi người chia sẻ tiêu chuẩn cụ thể của mình", "Đặt câu hỏi mở — người lý tưởng của bạn thế nào?", "Một người kể chuyện tình cũ làm ví dụ", "Kết thúc — tính cách quan trọng hơn ngoại hình"]',
 0, NULL, '[1,0,2,3]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 15: Lịch trình một ngày của Yamada-san (3o2Sc6cyVDY)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(141, 15,
 'Yamada-san thức dậy lúc "___" mỗi sáng theo thói quen được mô tả trong video.',
 '["しちじ", "ろくじ", "はちじ", "くじ"]',
 0, 'しちじ', NULL, 1, 'VOCABULARY'),

(142, 15,
 'Anh ấy đi làm bằng cách đi "___" rồi đổi sang tàu điện. Hãy điền phương tiện đầu tiên.',
 '["バス", "じてんしゃ", "タクシー", "とほ"]',
 0, 'バス', NULL, 2, 'VOCABULARY'),

(143, 15,
 'Buổi trưa Yamada-san dùng bữa cùng "___" (đồng nghiệp). Hãy điền từ tiếng Nhật.',
 '["どうりょう", "じょうし", "ぶか", "とりひきさき"]',
 0, 'どうりょう', NULL, 3, 'VOCABULARY'),

(144, 15,
 'Anh ấy rời công ty lúc "___" buổi chiều (5 giờ rưỡi). Hãy điền từ tiếng Nhật.',
 '["ごじはん", "よじ", "ろくじ", "しちじ"]',
 0, 'ごじはん', NULL, 4, 'VOCABULARY'),

(145, 15,
 'Yamada-san làm gì đầu tiên sau khi thức dậy lúc 7 giờ sáng?',
 '["Ăn sáng", "Tập thể dục", "Đọc báo buổi sáng", "Kiểm tra email công việc"]',
 0, NULL, NULL, 5, 'CONTENT'),

(146, 15,
 'Yamada-san đến công ty lúc mấy giờ theo lịch trình thường ngày?',
 '["9 giờ sáng", "8 giờ sáng", "8 giờ 30 sáng", "10 giờ sáng"]',
 0, NULL, NULL, 6, 'CONTENT'),

(147, 15,
 'Yamada-san thường đi ngủ lúc mấy giờ mỗi tối?',
 '["10 giờ tối", "11 giờ tối", "9 giờ tối", "12 giờ đêm"]',
 0, NULL, NULL, 7, 'CONTENT'),

(148, 15,
 'Sắp xếp các hoạt động trong ngày của Yamada-san theo đúng thứ tự:',
 '["Ăn trưa với đồng nghiệp", "Thức dậy và ăn sáng", "Đi ngủ lúc 10 giờ tối", "Đi xe buýt và tàu đến công ty"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(149, 15,
 'Sắp xếp các mốc thời gian trong ngày của Yamada-san theo đúng thứ tự:',
 '["Rời công ty về nhà lúc 5:30 chiều", "Thức dậy lúc 7 giờ sáng", "Ăn trưa khoảng 12 giờ trưa", "Đến công ty lúc 9 giờ sáng"]',
 0, NULL, '[1,3,2,0]', 9, 'SEQUENCE'),

(150, 15,
 'Sắp xếp các hoạt động tại công ty của Yamada-san theo đúng thứ tự:',
 '["Về nhà và nghỉ ngơi", "Bắt đầu công việc và họp hành buổi sáng", "Ăn trưa với đồng nghiệp", "Tiếp tục làm việc buổi chiều đến 5:30"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 16: Khám phá Kofu — Yamanashi (L43GiFQMQrU)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(151, 16,
 'Nhân vật đang thăm thành phố "___" ở tỉnh Yamanashi. Hãy điền từ tiếng Nhật.',
 '["こうふ", "まつもと", "ながの", "みと"]',
 0, 'こうふ', NULL, 1, 'VOCABULARY'),

(152, 16,
 'Vùng Yamanashi nổi tiếng với núi "___" (Phú Sĩ) có thể nhìn thấy từ xa. Hãy điền từ.',
 '["ふじさん", "あさまやま", "たてやま", "おんたけさん"]',
 0, 'ふじさん', NULL, 2, 'VOCABULARY'),

(153, 16,
 'Nhân vật dùng từ "___" (lần đầu tiên đến nơi này) khi giới thiệu về chuyến thăm Kofu.',
 '["はじめて", "またきた", "なんどもきた", "おひさしぶり"]',
 0, 'はじめて', NULL, 3, 'VOCABULARY'),

(154, 16,
 'Yamanashi nổi tiếng với các loại "___" (trái cây) địa phương đặc sản. Hãy điền từ đúng.',
 '["くだもの", "やさい", "おかし", "とくさんひん"]',
 0, 'くだもの', NULL, 4, 'VOCABULARY'),

(155, 16,
 'Ba nhân vật trong video đang ở tỉnh nào của Nhật Bản?',
 '["Yamanashi", "Nagano", "Shizuoka", "Gunma"]',
 0, NULL, NULL, 5, 'CONTENT'),

(156, 16,
 'Đây có phải lần đầu tiên họ đến thành phố Kofu không?',
 '["Có, đây là lần đầu tiên đến Kofu", "Không, họ đã đến nhiều lần trước", "Chỉ một người trong nhóm là lần đầu", "Không được đề cập rõ trong video"]',
 0, NULL, NULL, 6, 'CONTENT'),

(157, 16,
 'Điều gì làm cho các nhân vật cảm thấy hạnh phúc trong chuyến đi này?',
 '["Trải nghiệm vẻ đẹp thiên nhiên và thưởng thức đặc sản địa phương", "Được gặp gỡ những người bạn mới thú vị", "Được mua sắm tại các cửa hàng địa phương", "Được nghỉ ngơi hoàn toàn khỏi cuộc sống đô thị"]',
 0, NULL, NULL, 7, 'CONTENT'),

(158, 16,
 'Sắp xếp các hoạt động trong chuyến thăm Kofu theo đúng thứ tự:',
 '["Chia sẻ cảm nhận về hạnh phúc và vẻ đẹp thiên nhiên", "Đến Kofu và giới thiệu đây là lần đầu tiên", "Thưởng thức trái cây đặc sản địa phương", "Ngắm nhìn núi Fuji từ thành phố Kofu"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(159, 16,
 'Sắp xếp các điểm đến và hoạt động theo thứ tự trong video:',
 '["Nói về hạnh phúc và ý nghĩa của chuyến đi", "Đến ga/điểm xuất phát ở Kofu", "Thử đặc sản trái cây Yamanashi", "Ngắm núi Fuji từ xa"]',
 0, NULL, '[1,3,2,0]', 9, 'SEQUENCE'),

(160, 16,
 'Sắp xếp các cảm xúc của nhân vật theo thứ tự xuất hiện trong video:',
 '["Biết ơn vì được trải nghiệm vẻ đẹp của Nhật Bản", "Tò mò và hào hứng khi đến nơi mới lần đầu", "Ngạc nhiên trước vẻ đẹp của núi Fuji", "Thỏa mãn sau khi thưởng thức đặc sản địa phương"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 17: Văn hóa công sở Nhật — 報連相 (Nu80ZB0ugmw)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(161, 17,
 'Trong văn hóa công sở Nhật, "___" là từ viết tắt của 報告・連絡・相談. Hãy điền từ tiếng Nhật.',
 '["ほうれんそう", "けいごたいしゃく", "ぎょうむれんらく", "かいぎほうこく"]',
 0, 'ほうれんそう', NULL, 1, 'VOCABULARY'),

(162, 17,
 'Nhân viên Nhật thường đến công ty trước giờ làm "___" phút (30 phút). Hãy điền từ đúng.',
 '["さんじっぷん", "じっぷん", "よんじっぷん", "じゅうごふん"]',
 0, 'さんじっぷん', NULL, 2, 'VOCABULARY'),

(163, 17,
 'Trong cuộc họp, kỹ năng "___" (đọc không khí/hiểu ý ngầm) được coi là rất quan trọng.',
 '["くうきをよむ", "はなしをする", "いけんをいう", "ほうこくする"]',
 0, 'くうきをよむ', NULL, 3, 'VOCABULARY'),

(164, 17,
 'Từ "___" (báo cáo) là thành phần đầu tiên trong bộ ba 報連相. Hãy điền từ tiếng Nhật.',
 '["ほうこく", "れんらく", "そうだん", "かいぎ"]',
 0, 'ほうこく', NULL, 4, 'VOCABULARY'),

(165, 17,
 'Khái niệm "報連相" (ほうれんそう) trong môi trường công sở Nhật bao gồm những gì?',
 '["Báo cáo (報告), Liên lạc (連絡), Thảo luận/xin ý kiến (相談)", "Gặp gỡ, Lắng nghe, Thực hiện theo chỉ thị", "Lên kế hoạch, Thực hiện, Đánh giá kết quả", "Đúng giờ, Chuyên nghiệp, Cẩn thận"]',
 0, NULL, NULL, 5, 'CONTENT'),

(166, 17,
 'Nhân viên Nhật thường đến công ty trước giờ làm bao lâu theo chuẩn mực văn hóa?',
 '["30 phút (8:30 nếu giờ làm là 9:00)", "15 phút trước giờ làm chính thức", "Đúng giờ là đủ, không cần đến sớm", "5 đến 10 phút trước giờ làm"]',
 0, NULL, NULL, 6, 'CONTENT'),

(167, 17,
 'Kỹ năng "空気を読む" (くうきをよむ) trong môi trường làm việc có nghĩa là gì?',
 '["Đọc được không khí — hiểu ý ngầm mà không cần nói thẳng", "Biết cách mở cửa sổ thông gió phòng họp", "Phát biểu ý kiến thẳng thắn và rõ ràng", "Lắng nghe chăm chú và ghi chép đầy đủ"]',
 0, NULL, NULL, 7, 'CONTENT'),

(168, 17,
 'Sắp xếp các khái niệm văn hóa công sở theo thứ tự được giới thiệu trong video:',
 '["Kỹ năng đọc không khí trong cuộc họp (空気を読む)", "Giới thiệu khái niệm 報連相", "Giải thích từng thành phần: báo cáo, liên lạc, thảo luận", "Văn hóa đến sớm 30 phút trước giờ làm"]',
 0, NULL, '[1,2,3,0]', 8, 'SEQUENCE'),

(169, 17,
 'Sắp xếp ba thành phần của 報連相 theo thứ tự chữ cái (tên tiếng Nhật):',
 '["相談 (そうだん) — xin ý kiến", "報告 (ほうこく) — báo cáo", "連絡 (れんらく) — liên lạc", "確認 (かくにん) — xác nhận"]',
 0, NULL, '[1,2,0,3]', 9, 'SEQUENCE'),

(170, 17,
 'Sắp xếp các tình huống ứng dụng văn hóa công sở theo thứ tự quan trọng được nhấn mạnh:',
 '["Đọc không khí trong cuộc họp nhóm (空気を読む)", "Báo cáo tiến độ cho cấp trên (報告)", "Đến sớm trước giờ làm để chuẩn bị", "Liên lạc kịp thời khi có thay đổi (連絡)"]',
 0, NULL, '[2,1,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 18: Lắp ráp studio & kính ngữ với đồng nghiệp (GnJT6a1yUes)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(171, 18,
 'Nhân vật đang lắp ráp "___" (bàn/bàn ăn) trong studio mới. Hãy điền từ tiếng Nhật.',
 '["テーブル", "たんす", "ほんだな", "ソファ"]',
 0, 'テーブル', NULL, 1, 'VOCABULARY'),

(172, 18,
 'Để chuẩn bị bề mặt gỗ, nhân vật dùng "___" (giấy nhám) trước tiên. Hãy điền từ đúng.',
 '["ヤスリ", "ニス", "のり", "ペンキ"]',
 0, 'ヤスリ', NULL, 2, 'VOCABULARY'),

(173, 18,
 'Sau khi dùng giấy nhám, nhân vật bôi "___" (vecni/sơn bóng) lên bề mặt gỗ.',
 '["ニス", "ペンキ", "シール", "テープ"]',
 0, 'ニス', NULL, 3, 'VOCABULARY'),

(174, 18,
 'Nhân vật giải thích sự khác biệt giữa kính ngữ và "___" (ngôn ngữ thông thường/thân mật).',
 '["くだけたことば", "ていねいご", "けいご", "にほんご"]',
 0, 'くだけたことば', NULL, 4, 'VOCABULARY'),

(175, 18,
 'Nhân vật đang làm gì song song trong video này?',
 '["Lắp ráp đồ nội thất và giải thích kính ngữ vs ngôn ngữ thân mật", "Dạy bài học ngữ pháp N2 trên bảng trắng", "Phỏng vấn nghệ nhân làm đồ gỗ truyền thống", "Hướng dẫn trang trí nhà theo phong cách Nhật"]',
 0, NULL, NULL, 5, 'CONTENT'),

(176, 18,
 'Khi nào thì nên dùng kính ngữ (keigo) thay vì ngôn ngữ thân mật?',
 '["Khi nói với cấp trên, khách hàng hoặc người chưa quen biết", "Khi nói chuyện với bạn bè thân thiết cùng tuổi", "Chỉ khi viết email chính thức cho đối tác", "Chỉ trong các buổi lễ nghi trang trọng"]',
 0, NULL, NULL, 6, 'CONTENT'),

(177, 18,
 'Quy trình lắp ráp và hoàn thiện bàn gỗ trong video diễn ra theo thứ tự nào?',
 '["Lắp ráp khung → dùng giấy nhám mài → bôi vecni → để khô", "Bôi vecni trước rồi mới lắp ráp → dùng giấy nhám hoàn thiện", "Dùng giấy nhám trước → lắp ráp → sơn màu trang trí", "Lắp ráp → sơn màu → dùng giấy nhám → bôi vecni"]',
 0, NULL, NULL, 7, 'CONTENT'),

(178, 18,
 'Sắp xếp các bước làm bàn gỗ theo đúng thứ tự:',
 '["Bôi vecni (ニス) lên toàn bộ bề mặt", "Lắp ráp các bộ phận của bàn với nhau", "Chờ khô hoàn toàn và kiểm tra thành phẩm", "Dùng giấy nhám (ヤスリ) mài cho nhẵn bề mặt"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(179, 18,
 'Sắp xếp các tình huống sử dụng kính ngữ theo mức độ trang trọng tăng dần:',
 '["Nói chuyện với khách hàng doanh nghiệp quan trọng", "Nói chuyện với bạn bè thân (không cần keigo)", "Nói chuyện với cấp trên trực tiếp tại công ty", "Nói chuyện với đồng nghiệp cùng cấp mới quen"]',
 0, NULL, '[1,3,2,0]', 9, 'SEQUENCE'),

(180, 18,
 'Sắp xếp nội dung bài giảng về kính ngữ theo thứ tự được trình bày:',
 '["Ví dụ thực hành trong hội thoại với đồng nghiệp", "Giới thiệu khái niệm — keigo vs ngôn ngữ thân mật", "Giải thích khi nào dùng keigo", "Phân biệt các loại keigo cơ bản"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 19: Phỏng vấn xin việc tại nhà hàng (c9v9shoem50)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(181, 19,
 'Alex nộp "___" (CV/hồ sơ xin việc) cho quản lý trong buổi phỏng vấn. Hãy điền từ tiếng Nhật.',
 '["りれきしょ", "しゅうろうきょか", "めいし", "しょうめいしょ"]',
 0, 'りれきしょ', NULL, 1, 'VOCABULARY'),

(182, 19,
 'Quản lý mời Alex vào "___" (văn phòng/phòng làm việc) để tiến hành phỏng vấn.',
 '["じむしつ", "きゅうけいしつ", "かいぎしつ", "しょくどう"]',
 0, 'じむしつ', NULL, 2, 'VOCABULARY'),

(183, 19,
 'Tên quản lý của nhà hàng trong hội thoại là "___". Hãy điền họ của quản lý bằng tiếng Nhật.',
 '["すずき", "たなか", "さとう", "やまだ"]',
 0, 'すずき', NULL, 3, 'VOCABULARY'),

(184, 19,
 'Alex đến nhà hàng để phỏng vấn xin làm "___" (công việc bán thời gian). Hãy điền từ đúng.',
 '["アルバイト", "せいしゃいん", "けいやくしゃいん", "はけんしゃいん"]',
 0, 'アルバイト', NULL, 4, 'VOCABULARY'),

(185, 19,
 'Alex đến nhà hàng với mục đích gì?',
 '["Phỏng vấn xin việc làm thêm bán thời gian", "Ăn trưa và gặp bạn bè tại nhà hàng", "Nộp đơn khiếu nại về dịch vụ", "Giao hàng cho bếp của nhà hàng"]',
 0, NULL, NULL, 5, 'CONTENT'),

(186, 19,
 'Quản lý Suzuki làm gì sau khi Alex đến nhà hàng?',
 '["Dẫn Alex vào văn phòng để bắt đầu phỏng vấn", "Bảo Alex ngồi đợi vì đang bận việc", "Từ chối gặp mặt và yêu cầu hẹn ngày khác", "Giới thiệu Alex với tất cả nhân viên"]',
 0, NULL, NULL, 6, 'CONTENT'),

(187, 19,
 'Điều gì xảy ra khi Alex nộp 履歴書 cho quản lý Suzuki?',
 '["Quản lý xem qua và bắt đầu buổi phỏng vấn chính thức", "Quản lý nói sẽ xem sau và hẹn ngày khác liên lạc", "Quản lý từ chối vì hồ sơ không đầy đủ", "Quản lý photo lại và trả bản gốc cho Alex"]',
 0, NULL, NULL, 7, 'CONTENT'),

(188, 19,
 'Sắp xếp các sự kiện trong buổi phỏng vấn của Alex theo đúng thứ tự:',
 '["Alex nộp 履歴書 cho quản lý Suzuki", "Alex đến nhà hàng và gặp nhân viên tại quầy", "Buổi phỏng vấn chính thức bắt đầu", "Quản lý Suzuki xuất hiện và dẫn Alex vào phòng"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(189, 19,
 'Sắp xếp các bước chuẩn bị và tiến hành phỏng vấn theo đúng thứ tự:',
 '["Trả lời các câu hỏi phỏng vấn của quản lý", "Đặt lịch hẹn phỏng vấn trước", "Đến nhà hàng đúng giờ hẹn", "Chuẩn bị 履歴書 và tài liệu cần thiết"]',
 0, NULL, '[3,1,2,0]', 9, 'SEQUENCE'),

(190, 19,
 'Sắp xếp các yếu tố tạo ấn tượng tốt trong buổi phỏng vấn theo thứ tự quan trọng:',
 '["Trả lời câu hỏi tự tin và rõ ràng", "Đến đúng giờ hẹn hoặc sớm hơn", "Nộp 履歴書 sạch sẽ và đầy đủ thông tin", "Ăn mặc lịch sự và phù hợp"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 20: Tiếng Nhật kinh doanh — email & họp online (4carvK20fUU)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(191, 20,
 'Trong email công việc, nhân vật yêu cầu "___" (báo cáo hàng tháng). Hãy điền từ tiếng Nhật.',
 '["げつじレポート", "しゅうじレポート", "ねんじレポート", "きはんレポート"]',
 0, 'げつじレポート', NULL, 1, 'VOCABULARY'),

(192, 20,
 'Trước cuộc họp online, nhân vật cần kiểm tra "___" (kết nối internet). Hãy điền từ đúng.',
 '["せつぞくテスト", "マイクテスト", "カメラチェック", "ソフトウェア"]',
 0, 'せつぞくテスト', NULL, 2, 'VOCABULARY'),

(193, 20,
 'Trong cuộc họp, người ghi "___" (biên bản cuộc họp) giữ vai trò quan trọng. Hãy điền từ tiếng Nhật.',
 '["ぎじろく", "しりょう", "アジェンダ", "ほうこくしょ"]',
 0, 'ぎじろく', NULL, 3, 'VOCABULARY'),

(194, 20,
 'Khi trình bày, nhân vật dùng chức năng "___" (chia sẻ tài liệu/màn hình). Hãy điền từ đúng.',
 '["しりょうきょうゆう", "がめんきょうゆう", "ファイルそうしん", "プレゼン"]',
 0, 'しりょうきょうゆう', NULL, 4, 'VOCABULARY'),

(195, 20,
 'Video này dạy về lĩnh vực tiếng Nhật nào?',
 '["Tiếng Nhật thương mại và môi trường văn phòng", "Tiếng Nhật học thuật và nghiên cứu", "Tiếng Nhật giao tiếp hàng ngày thân mật", "Tiếng Nhật dành cho du lịch"]',
 0, NULL, NULL, 5, 'CONTENT'),

(196, 20,
 'Khi gửi email yêu cầu báo cáo tháng, điều nào cần được nêu rõ ràng?',
 '["Loại báo cáo cần (月次レポート), thời hạn nộp và định dạng file", "Chỉ cần nêu tên báo cáo, không cần thêm chi tiết", "Yêu cầu trực tiếp bằng lời là đủ, không cần email", "Gửi mẫu báo cáo trước rồi mới yêu cầu điền"]',
 0, NULL, NULL, 6, 'CONTENT'),

(197, 20,
 'Chuẩn bị cho cuộc họp online bao gồm những bước nào?',
 '["Kiểm tra kết nối, micro, chuẩn bị tài liệu chia sẻ và phân công ghi biên bản", "Chỉ cần có laptop và đường truyền internet ổn định", "Gửi email mời họp và đợi xác nhận từ người tham dự", "In tài liệu và mang đến phòng họp vật lý"]',
 0, NULL, NULL, 7, 'CONTENT'),

(198, 20,
 'Sắp xếp các bước chuẩn bị cuộc họp online theo đúng thứ tự:',
 '["Phân công người ghi biên bản và người chia sẻ tài liệu", "Kiểm tra đường truyền internet (接続テスト)", "Chuẩn bị và upload tài liệu trình bày", "Kiểm tra micro và camera (マイクテスト)"]',
 0, NULL, '[1,3,2,0]', 8, 'SEQUENCE'),

(199, 20,
 'Sắp xếp các bước soạn và gửi email yêu cầu báo cáo theo đúng thứ tự:',
 '["Gửi email và đợi phản hồi", "Xác định loại báo cáo và thời hạn cần", "Soạn email bằng ngôn ngữ kinh doanh lịch sự", "Nêu rõ định dạng file và cách gửi"]',
 0, NULL, '[1,2,3,0]', 9, 'SEQUENCE'),

(200, 20,
 'Sắp xếp các giai đoạn của một cuộc họp online điển hình theo đúng thứ tự:',
 '["Tổng kết và phân công công việc sau họp", "Kiểm tra kỹ thuật trước khi vào phòng họp", "Trình bày nội dung với tài liệu chia sẻ màn hình", "Điểm danh và xác nhận người tham dự"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 21: Bốn loại kính ngữ tiếng Nhật (SnmEXprKUqs)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(201, 21,
 'Giáo viên Sachi giải thích "___" (tôn kính ngữ — đề cao hành động của người khác). Hãy điền từ.',
 '["そんけいご", "けんじょうご", "ていねいご", "ていちょうご"]',
 0, 'そんけいご', NULL, 1, 'VOCABULARY'),

(202, 21,
 'Loại kính ngữ dùng để hạ thấp bản thân mình gọi là "___" (khiêm nhường ngữ). Hãy điền từ đúng.',
 '["けんじょうご", "そんけいご", "ていねいご", "ていちょうご"]',
 0, 'けんじょうご', NULL, 2, 'VOCABULARY'),

(203, 21,
 'Dạng kính ngữ lịch sự cơ bản nhất — dùng です/ます — gọi là "___". Hãy điền từ tiếng Nhật.',
 '["ていねいご", "そんけいご", "けんじょうご", "ていちょうご"]',
 0, 'ていねいご', NULL, 3, 'VOCABULARY'),

(204, 21,
 'Khi dùng tôn kính ngữ (尊敬語), động từ 食べる (ăn) của người khác đổi thành "___".',
 '["めしあがる", "いただく", "たべます", "くださる"]',
 0, 'めしあがる', NULL, 4, 'VOCABULARY'),

(205, 21,
 'Giáo viên Sachi giải thích tiếng Nhật kính ngữ có bao nhiêu loại chính?',
 '["4 loại: 丁寧語, 尊敬語, 謙譲語, 丁重語", "2 loại: lịch sự (formal) và thông thường (informal)", "3 loại theo ba cấp độ trang trọng", "5 loại theo cấp bậc xã hội"]',
 0, NULL, NULL, 5, 'CONTENT'),

(206, 21,
 'Khi nào nên dùng 謙譲語 (けんじょうご — khiêm nhường ngữ)?',
 '["Khi nói về hành động của bản thân với người trên để tỏ thái độ khiêm tốn", "Khi khen ngợi hành động tốt đẹp của người khác", "Khi từ chối lịch sự một yêu cầu từ người khác", "Khi hỏi ý kiến cấp trên về vấn đề công việc"]',
 0, NULL, NULL, 6, 'CONTENT'),

(207, 21,
 'Trong tôn kính ngữ (尊敬語), động từ いる (ở/có mặt) của người khác đổi thành gì?',
 '["いらっしゃる", "おる", "おります", "ございます"]',
 0, NULL, NULL, 7, 'CONTENT'),

(208, 21,
 'Sắp xếp thứ tự Sachi giới thiệu các loại kính ngữ trong video:',
 '["謙譲語 (けんじょうご — hạ thấp bản thân)", "丁寧語 (ていねいご — lịch sự cơ bản: です/ます)", "丁重語 (ていちょうご — lịch sự trang trọng: いたす/おる)", "尊敬語 (そんけいご — đề cao người khác)"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(209, 21,
 'Sắp xếp các ví dụ động từ từ dạng thông thường sang kính ngữ theo thứ tự được giới thiệu:',
 '["いる → いらっしゃる (tôn kính ngữ)", "食べる → めしあがる (tôn kính ngữ)", "する → いたす (khiêm nhường ngữ)", "もらう → いただく (khiêm nhường ngữ)"]',
 0, NULL, '[1,0,3,2]', 9, 'SEQUENCE'),

(210, 21,
 'Sắp xếp cấu trúc bài giảng của Sachi về kính ngữ theo đúng thứ tự:',
 '["Luyện tập ứng dụng trong hội thoại thực tế", "Giới thiệu tổng quan — kính ngữ là gì và có mấy loại", "Giải thích chi tiết từng loại với ví dụ động từ", "Tóm tắt và mẹo ghi nhớ cách phân biệt các loại"]',
 0, NULL, '[1,2,3,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 22: Từ vựng hoa văn và họa tiết vải (oJO9LesSxWo)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(211, 22,
 'Mẫu vải có sọc kẻ (ngang và dọc xen kẽ nhau) gọi là "___". Hãy điền từ tiếng Nhật.',
 '["しましま", "ストライプ", "チェック", "ボーダー"]',
 0, 'しましま', NULL, 1, 'VOCABULARY'),

(212, 22,
 'Vải không có hoa văn — một màu đồng nhất — gọi là "___" (trơn). Hãy điền từ tiếng Nhật.',
 '["むじ", "もようあり", "はながら", "ドット"]',
 0, 'むじ', NULL, 2, 'VOCABULARY'),

(213, 22,
 'Mẫu hoa văn có hình bông hoa trên vải gọi là "___". Hãy điền từ tiếng Nhật.',
 '["はながら", "しましま", "むじ", "チェック"]',
 0, 'はながら', NULL, 3, 'VOCABULARY'),

(214, 22,
 'Đường kẻ chéo góc trên vải hoặc hoa văn gọi là "___". Hãy điền từ tiếng Nhật.',
 '["ななめ", "たて", "よこ", "ストライプ"]',
 0, 'ななめ', NULL, 4, 'VOCABULARY'),

(215, 22,
 'Video này tập trung dạy từ vựng thuộc lĩnh vực nào?',
 '["Mô tả hoa văn và họa tiết trên vải/quần áo", "Mua sắm quần áo tại cửa hàng thời trang", "Lịch sử thời trang truyền thống Nhật Bản", "Cách may và thiết kế trang phục"]',
 0, NULL, NULL, 5, 'CONTENT'),

(216, 22,
 'Trong tiếng Nhật, 縦 (たて) và 横 (よこ) khi nói về kẻ sọc có nghĩa là gì?',
 '["縦 = sọc dọc (vertical), 横 = sọc ngang (horizontal)", "縦 = sọc ngang, 横 = sọc dọc", "縦 = sọc to, 横 = sọc nhỏ mảnh", "縦 = sọc màu đậm, 横 = sọc màu nhạt"]',
 0, NULL, NULL, 6, 'CONTENT'),

(217, 22,
 'Phương pháp học từ vựng trong video N1 này là gì?',
 '["Xem hình ảnh minh họa và đặt câu ví dụ với từng từ về hoa văn", "Nghe hội thoại mua sắm và phân tích từ vựng xuất hiện", "Học thuộc danh sách từ không có ngữ cảnh minh họa", "Làm bài tập điền từ vào câu có sẵn"]',
 0, NULL, NULL, 7, 'CONTENT'),

(218, 22,
 'Sắp xếp các loại họa tiết theo thứ tự được giới thiệu trong video:',
 '["Hoa văn đường chéo (斜め — ななめ)", "Kẻ sọc (しましま/ストライプ)", "Họa tiết hoa (花柄 — はながら)", "Vải trơn một màu (無地 — むじ)"]',
 0, NULL, '[1,3,2,0]', 8, 'SEQUENCE'),

(219, 22,
 'Sắp xếp các bước học và ghi nhớ từ vựng về hoa văn theo đúng thứ tự:',
 '["Luyện dùng từ trong câu mô tả trang phục", "Xem hình ảnh minh họa hoa văn cụ thể", "Nghe và đọc tên tiếng Nhật của hoa văn", "Thực hành nhận biết hoa văn trong thực tế"]',
 0, NULL, '[1,2,0,3]', 9, 'SEQUENCE'),

(220, 22,
 'Sắp xếp các nhóm từ vựng mô tả sọc theo thứ tự được phân loại trong video:',
 '["Sọc chéo (斜め)", "Sọc dọc (縦ストライプ)", "Kẻ ô vuông (チェック)", "Sọc ngang (横ボーダー)"]',
 0, NULL, '[1,3,0,2]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 23: Kính ngữ qua ví dụ động từ biến đổi (G6yzK93EbAk)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(221, 23,
 'Động từ 食べる (ăn) — khi nói về hành động của BẢN THÂN mình trong 謙譲語 là "___".',
 '["いただく", "めしあがる", "たべます", "くださる"]',
 0, 'いただく', NULL, 1, 'VOCABULARY'),

(222, 23,
 'Động từ する (làm) trong 謙譲語 — khi nói về hành động của mình với người trên — đổi thành "___".',
 '["いたす", "なさる", "します", "される"]',
 0, 'いたす', NULL, 2, 'VOCABULARY'),

(223, 23,
 'Động từ もらう (nhận) trong 謙譲語 — khi mình nhận từ người trên — đổi thành "___".',
 '["いただく", "くださる", "さしあげる", "やる"]',
 0, 'いただく', NULL, 3, 'VOCABULARY'),

(224, 23,
 'Để biến động từ thông thường thành 尊敬語, ta thêm tiền tố "___" rồi đổi sang dạng に + なる.',
 '["お", "ご", "ます", "られ"]',
 0, 'お', NULL, 4, 'VOCABULARY'),

(225, 23,
 'Video này tập trung dạy về loại ngôn ngữ nào trong tiếng Nhật?',
 '["Kính ngữ tiếng Nhật (敬語) qua ví dụ động từ biến đổi", "Tiếng Nhật thông thường dùng hàng ngày", "Tiếng Nhật trong tin tức và báo chí", "Tiếng Nhật học thuật và luận văn"]',
 0, NULL, NULL, 5, 'CONTENT'),

(226, 23,
 'Sự khác biệt chính giữa 尊敬語 (そんけいご) và 謙譲語 (けんじょうご) là gì?',
 '["尊敬語 đề cao hành động của người khác, 謙譲語 hạ thấp hành động của bản thân", "尊敬語 dùng trong văn viết, 謙譲語 chỉ dùng trong văn nói", "尊敬語 lịch sự hơn 謙譲語 về mức độ trang trọng", "Hai loại hoàn toàn giống nhau, chỉ khác theo vùng địa phương"]',
 0, NULL, NULL, 6, 'CONTENT'),

(227, 23,
 'Khi muốn hỏi khách "Quý khách dùng gì ạ?" bằng 尊敬語 trong nhà hàng, dùng cách nói nào?',
 '["何を召し上がりますか", "何をいただきますか", "何を食べますか", "何をお食べになりたいですか"]',
 0, NULL, NULL, 7, 'CONTENT'),

(228, 23,
 'Sắp xếp thứ tự nội dung được giới thiệu trong bài học kính ngữ này:',
 '["Ví dụ động từ 謙譲語 (いただく, いたす, まいる)", "Giới thiệu tổng quan về 敬語 và mục đích sử dụng", "Giải thích 尊敬語 với ví dụ (召し上がる, いらっしゃる)", "Chuyển sang giải thích 謙譲語 — mục đích và cách dùng"]',
 0, NULL, '[1,2,3,0]', 8, 'SEQUENCE'),

(229, 23,
 'Sắp xếp các ví dụ chuyển đổi động từ từ thường sang kính ngữ theo thứ tự được trình bày:',
 '["する → いたす (謙譲語)", "食べる → めしあがる (尊敬語)", "もらう → いただく (謙譲語)", "いる → いらっしゃる (尊敬語)"]',
 0, NULL, '[1,3,0,2]', 9, 'SEQUENCE'),

(230, 23,
 'Sắp xếp các bước học kính ngữ hiệu quả theo thứ tự được giới thiệu trong video:',
 '["Luyện dùng trong hội thoại mẫu", "Hiểu mục đích và khi nào dùng mỗi loại", "Ghi nhớ các động từ đặc biệt không theo quy tắc", "Nắm quy tắc chung: thêm お/ご hoặc thêm られる"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- QUIZ 24: Ngữ pháp N1 trong hội thoại tự nhiên (UzVU72roWrA)
-- ════════════════════════════════════════════════════════════
INSERT INTO questions (id, quiz_id, content, options, correct_option, correct_answer_text, correct_order, order_index, question_type) VALUES
(231, 24,
 'Cấu trúc N1 "___" diễn đạt ý nghĩa "mặc dù... nhưng vẫn...". Hãy điền từ tiếng Nhật.',
 '["にもかかわらず", "にたいして", "をめぐって", "にそって"]',
 0, 'にもかかわらず', NULL, 1, 'VOCABULARY'),

(232, 24,
 'Cấu trúc N1 "___" trong tiếng Nhật diễn đạt ý "đối với/hướng về phía". Hãy điền từ đúng.',
 '["にたいして", "によって", "にとって", "において"]',
 0, 'にたいして', NULL, 2, 'VOCABULARY'),

(233, 24,
 'Biểu đạt N1 "___" có nghĩa là "dù thế nào đi nữa/bất kể hoàn cảnh nào". Hãy điền từ tiếng Nhật.',
 '["いかんにかかわらず", "おかげで", "せいで", "ものの"]',
 0, 'いかんにかかわらず', NULL, 3, 'VOCABULARY'),

(234, 24,
 'Cấu trúc "___" diễn đạt ý "tuy nhiên/mặc dù vậy" — thường dùng trong văn viết trang trọng N1.',
 '["ものの", "けれども", "でも", "が"]',
 0, 'ものの', NULL, 4, 'VOCABULARY'),

(235, 24,
 'Buổi livestream N1 này tập trung vào hình thức học tập nào?',
 '["Thực hành ngữ pháp N1 trong hội thoại tự nhiên", "Ôn tập từ vựng N1 theo từng chủ đề", "Luyện kỹ năng đọc hiểu văn bản N1 khó", "Hướng dẫn chiến lược làm bài thi N1"]',
 0, NULL, NULL, 5, 'CONTENT'),

(236, 24,
 'Điểm đặc biệt của cách học ngữ pháp N1 trong video này là gì?',
 '["Học ngữ pháp qua hội thoại thực tế — không học công thức khô khan", "Học qua bài kiểm tra và sửa từng lỗi sai", "Học qua so sánh với ngữ pháp tiếng Anh tương đương", "Học qua đọc sách giáo khoa N1 truyền thống"]',
 0, NULL, NULL, 6, 'CONTENT'),

(237, 24,
 'Đối tượng hướng đến của buổi livestream này là ai?',
 '["Người học tiếng Nhật trình độ nâng cao muốn chinh phục N1", "Người mới bắt đầu học tiếng Nhật từ con số 0", "Giáo viên dạy tiếng Nhật muốn cập nhật phương pháp", "Học sinh trung học Nhật Bản học ngữ pháp"]',
 0, NULL, NULL, 7, 'CONTENT'),

(238, 24,
 'Sắp xếp các phần trong buổi livestream N1 theo đúng thứ tự:',
 '["Luyện tập cấu trúc ngữ pháp qua câu hội thoại ví dụ", "Chào hỏi và giới thiệu chủ đề ngữ pháp N1 hôm nay", "Tổng kết và trả lời câu hỏi từ người xem", "Giải thích ý nghĩa và cách dùng các cấu trúc N1"]',
 0, NULL, '[1,3,0,2]', 8, 'SEQUENCE'),

(239, 24,
 'Sắp xếp các cấu trúc ngữ pháp N1 theo thứ tự được giới thiệu trong video:',
 '["いかんにかかわらず (bất kể hoàn cảnh nào)", "にもかかわらず (mặc dù... nhưng)", "ものの (tuy nhiên/dù vậy)", "にたいして (đối với/hướng về)"]',
 0, NULL, '[1,3,0,2]', 9, 'SEQUENCE'),

(240, 24,
 'Sắp xếp các giai đoạn học ngữ pháp N1 hiệu quả theo thứ tự được đề xuất:',
 '["Sử dụng tự nhiên trong hội thoại thực tế", "Hiểu nghĩa và ngữ cảnh dùng cấu trúc", "Luyện đặt câu ví dụ theo chủ đề quen thuộc", "Ghi nhớ hình thức và ví dụ điển hình"]',
 0, NULL, '[1,3,2,0]', 10, 'SEQUENCE');

-- ════════════════════════════════════════════════════════════
-- Kết thúc seed data
-- 5 levels, 10 courses, 24 lessons, 24 quizzes, 240 questions
-- Video: 24 YouTube videos thật (N5 → N1)
-- Quiz: 4 VOCABULARY + 3 CONTENT + 3 SEQUENCE mỗi bài
-- Pass: N5/N4/N3 = 70%, N2 = 75%, N1 = 80%
-- ════════════════════════════════════════════════════════════
