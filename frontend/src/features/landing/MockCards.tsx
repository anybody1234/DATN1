import { Flame, Play } from "lucide-react";

const MACOS_DOT_RED = "#ff5f57";
const MACOS_DOT_YELLOW = "#febc2e";
const MACOS_DOT_GREEN = "#28c840";

export function MockLessonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden select-none"
      style={{ border: "1px solid rgba(255,255,255,0.09)", background: "#111" }}
    >
      {/* Window chrome — macOS-style dots */}
      <div
        className="flex items-center gap-1.5 px-4 py-2.5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#161616",
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: MACOS_DOT_RED }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: MACOS_DOT_YELLOW }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: MACOS_DOT_GREEN }}
        />
        <span className="text-[11px] text-t3 ml-3 flex-1 truncate">
          Bài 03: Chào hỏi cơ bản · NihongoFlow
        </span>
      </div>

      {/* Video thumbnail (simulated) */}
      <div
        className="w-full relative flex items-center justify-center"
        style={{
          height: "200px",
          background:
            "linear-gradient(135deg, #1a0a10 0%, #0d0d0d 40%, #0a0d1a 100%)",
        }}
      >
        <div
          className="absolute bottom-4 left-4 right-4 rounded-md px-3 py-1.5 text-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        >
          <span className="text-xs text-t1 font-jp">おはようございます！</span>
          <span className="text-xs text-t2 ml-2">— Chào buổi sáng!</span>
        </div>
        <div className="absolute top-3 right-3 text-[10px] text-t3 font-mono">
          03:24 / 12:50
        </div>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(233,69,96,0.15)",
            border: "1px solid rgba(233,69,96,0.4)",
          }}
        >
          <Play size={20} className="text-acc ml-1" />
        </div>
      </div>

      {/* Progress */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-t3">Tiến độ bài học</span>
          <span className="text-acc font-medium">68%</span>
        </div>
        <div
          className="w-full h-1 rounded-full"
          style={{ background: "#1f1f1f" }}
        >
          <div className="h-full w-[68%] rounded-full bg-acc" />
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[11px] text-t3">3 / 5 bài hoàn thành</span>
          <span className="text-[11px] text-acc">Tiếp tục →</span>
        </div>
      </div>
    </div>
  );
}

export function MockQuizCard() {
  const opts = ["おはようございます", "こんにちは", "こんばんは", "ありがとう"];
  return (
    <div
      className="rounded-xl overflow-hidden select-none"
      style={{ border: "1px solid rgba(255,255,255,0.09)", background: "#111" }}
    >
      <div className="px-5 pt-5 pb-4">
        <div className="text-[11px] text-t3 uppercase tracking-widest mb-3">
          Quiz · Câu 3/5
        </div>
        <p className="text-t1 text-sm font-medium mb-4">
          Cách chào buổi sáng trong tiếng Nhật là gì?
        </p>
        <div className="flex flex-col gap-2">
          {opts.map((o, i) => (
            <div
              key={o}
              className="px-3 py-2 rounded-lg text-xs font-jp"
              style={{
                border: `1px solid ${i === 0 ? "rgba(233,69,96,0.4)" : "#222"}`,
                background: i === 0 ? "rgba(233,69,96,0.08)" : "#0d0d0d",
                color: i === 0 ? "var(--acc)" : "var(--t3)",
              }}
            >
              {o}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MockStreakCard() {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const done = [true, true, true, true, true, false, false];
  return (
    <div
      className="rounded-xl p-5 select-none"
      style={{ border: "1px solid rgba(255,255,255,0.09)", background: "#111" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-acc/10 flex items-center justify-center">
          <Flame size={16} className="text-acc" />
        </div>
        <div>
          <div className="text-t1 text-sm font-semibold">
            5 ngày liên tiếp 🔥
          </div>
          <div className="text-t3 text-[11px]">Kỷ lục: 21 ngày</div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <div
              className="w-full h-6 rounded"
              style={{
                background: done[i] ? "rgba(233,69,96,0.7)" : "#1a1a1a",
              }}
            />
            <span className="text-[10px] text-t3">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
