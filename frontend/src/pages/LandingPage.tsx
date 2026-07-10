import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import {
  MockLessonCard,
  MockQuizCard,
  MockStreakCard,
} from "@/features/landing/MockCards";
import { useLevels } from "@/hooks/useCourse";

const LEVELS = [
  {
    name: "N5",
    label: "Sơ cấp",
    desc: "Hiragana, Katakana, từ vựng cơ bản",
  },
  {
    name: "N4",
    label: "Sơ trung cấp",
    desc: "Ngữ pháp mở rộng, hội thoại đơn giản",
  },
  {
    name: "N3",
    label: "Trung cấp",
    desc: "Đọc hiểu, biểu đạt phức tạp",
  },
  {
    name: "N2",
    label: "Trung cao cấp",
    desc: "Văn phong trang trọng, chuyên ngành",
  },
  {
    name: "N1",
    label: "Cao cấp",
    desc: "Thành thạo toàn diện, bản địa hoá",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { data: levels = [], isLoading: levelsLoading } = useLevels();

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center px-6 pt-20 pb-28">
        {/* Hero glow */}
        <div
          className="pointer-events-none absolute inset-0 flex items-start justify-center pt-0"
          aria-hidden
        >
          <div
            style={{
              width: 800,
              height: 500,
              background:
                "radial-gradient(ellipse at center top, rgba(233,69,96,0.07) 0%, transparent 65%)",
            }}
          />
        </div>

        <div className="relative max-w-[680px] mx-auto text-center">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full text-xs text-t3 font-medium"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              background: "var(--s1)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-acc" />
            Chuẩn JLPT · N5 đến N1
          </div>

          {/* Main heading */}
          <h1
            className="text-t1 font-bold mb-6"
            style={{
              fontSize: "clamp(48px, 6vw, 76px)",
              letterSpacing: "-0.05em",
              lineHeight: 1.02,
            }}
          >
            Tiếng Nhật
            <br />
            <span className="text-acc">dễ hơn</span> bạn nghĩ.
          </h1>

          {/* Subheading */}
          <p
            className="text-t2 max-w-[460px] mx-auto mb-10"
            style={{ fontSize: 16, lineHeight: 1.75 }}
          >
            Video bài giảng, quiz tích hợp và theo dõi tiến độ.
            <br />
            Học mỗi ngày — tiến bộ mỗi ngày.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate("/khoa-hoc")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-t2 hover:text-t1 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.09)" }}
            >
              Xem khoá học
            </button>
          </div>
        </div>
      </section>

      {/* ── Lộ trình ── */}
      <section
        id="lo-trinh"
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1120px] mx-auto">
          <div className="max-w-[560px] mx-auto text-center mb-14">
            <p className="text-acc text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
              Lộ trình học tập
            </p>
            <h2
              className="text-t1 font-bold"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                letterSpacing: "-0.035em",
                lineHeight: 1.15,
              }}
            >
              Từ N5 đến N1, một hành trình rõ ràng
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {LEVELS.map((lv) => {
              const courseCount = levels.find(
                (l) => l.name === lv.name,
              )?.courseCount;
              return (
                <div
                  key={lv.name}
                  className="group cursor-pointer rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "var(--s1)",
                  }}
                  onClick={() => navigate(`/khoa-hoc?level=${lv.name}`)}
                >
                  <div
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--acc)" }}
                  >
                    {lv.name}
                  </div>
                  <div className="text-t1 text-sm font-medium mb-1.5">
                    {lv.label}
                  </div>
                  <div className="text-t3 text-xs leading-relaxed mb-3">
                    {lv.desc}
                  </div>
                  {levelsLoading ? (
                    <div className="h-3 w-16 rounded bg-b1 animate-pulse" />
                  ) : (
                    <div className="text-acc text-[11px] font-semibold">
                      {courseCount ?? 0} khoá học
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature 1: Video Player ── */}
      <section
        id="tinh-nang"
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-acc text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
              Video bài giảng
            </p>
            <h2
              className="text-t1 font-bold mb-5"
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                letterSpacing: "-0.035em",
                lineHeight: 1.2,
              }}
            >
              Học theo tốc độ của riêng bạn.
            </h2>
            <p
              className="text-t2 text-base leading-relaxed mb-6"
              style={{ maxWidth: 420 }}
            >
              Video bài giảng phát trực tiếp qua YouTube với trình điều khiển
              tuỳ biến riêng. Tự động lưu vị trí xem mỗi 10 giây — tiếp tục bất
              cứ lúc nào, trên bất kỳ thiết bị nào.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Trình phát YouTube tuỳ biến, không quảng cáo gây phân tâm",
                "Tự động lưu tiến độ 10 giây/lần",
                "Resume từ vị trí đã xem",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-t2"
                >
                  <CheckCircle size={14} className="text-acc shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <MockLessonCard />
        </div>
      </section>

      {/* ── Feature 2: Quiz ── */}
      <section
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <MockQuizCard />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-acc text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
              Quiz tích hợp
            </p>
            <h2
              className="text-t1 font-bold mb-5"
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                letterSpacing: "-0.035em",
                lineHeight: 1.2,
              }}
            >
              Kiểm tra ngay,
              <br />
              không chờ đợi.
            </h2>
            <p
              className="text-t2 text-base leading-relaxed mb-6"
              style={{ maxWidth: 420 }}
            >
              Sau mỗi bài giảng, quiz 10 câu xuất hiện ngay lập tức — từ vựng,
              nội dung và sắp xếp trình tự. Xem kết quả, đáp án đúng/sai, và
              luyện lại không giới hạn số lần.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "3 dạng câu hỏi: trắc nghiệm, điền từ, sắp xếp trình tự",
                "Ngưỡng đạt 70–80% theo từng cấp độ",
                "Lưu lịch sử tất cả lần làm bài",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-t2"
                >
                  <CheckCircle size={14} className="text-acc shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Feature 3: Streak ── */}
      <section
        className="py-28 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-acc text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
              Streak & Tiến độ
            </p>
            <h2
              className="text-t1 font-bold mb-5"
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                letterSpacing: "-0.035em",
                lineHeight: 1.2,
              }}
            >
              Xây thói quen học,
              <br />
              mỗi ngày một bước.
            </h2>
            <p
              className="text-t2 text-base leading-relaxed mb-6"
              style={{ maxWidth: 420 }}
            >
              Chuỗi ngày học liên tiếp (streak) tăng mỗi khi bạn hoàn thành ít
              nhất một bài học trong ngày. Theo dõi kỷ lục cá nhân và cảm nhận
              sự tiến bộ.
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Streak reset nếu nghỉ 24h+",
                "Hiển thị cả chuỗi hiện tại lẫn kỷ lục",
                "Dashboard tiến độ trực quan",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-t2"
                >
                  <CheckCircle size={14} className="text-acc shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <MockStreakCard />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-32 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-[560px] mx-auto text-center">
          <h2
            className="text-t1 font-bold mb-6"
            style={{
              fontSize: "clamp(36px, 4vw, 52px)",
              letterSpacing: "-0.045em",
              lineHeight: 1.08,
            }}
          >
            Tiếng Nhật,
            <br />
            <span className="text-acc">được thiết kế lại.</span>
            <br />
            Sẵn sàng hôm nay.
          </h2>
          <p
            className="text-t2 mb-8 mx-auto"
            style={{ fontSize: 15, lineHeight: 1.75, maxWidth: 400 }}
          >
            Không cần kinh nghiệm. Không cần giáo viên.
            <br />
            Chỉ cần bắt đầu.
          </p>
          <button
            onClick={() => navigate("/khoa-hoc")}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-t2 hover:text-t1 transition-colors mx-auto"
            style={{ border: "1px solid rgba(255,255,255,0.09)" }}
          >
            Khám phá khoá học
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
