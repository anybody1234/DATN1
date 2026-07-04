import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Trophy,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AttemptReviewModal } from "@/components/dashboard/AttemptReviewModal";
import {
  useStreak,
  useMyCourses,
  useRecentAttempts,
} from "@/hooks/useDashboard";

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="border border-b1 rounded-xl bg-s1 p-5 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent ? "bg-acc-muted" : "bg-s2"}`}
      >
        <Icon size={18} className={accent ? "text-acc" : "text-t2"} />
      </div>
      <div>
        <div className="text-t1 text-xl font-bold">{value}</div>
        <div className="text-t3 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-s2 rounded-full overflow-hidden">
      <div
        className="h-full bg-acc rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [reviewAttemptId, setReviewAttemptId] = useState<number | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: streakData } = useStreak();
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useMyCourses();
  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
  } = useRecentAttempts();

  const streak = streakData ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
  };
  const courses = coursesData ?? [];
  const attempts = attemptsData ?? [];
  const totalCompleted = courses.reduce(
    (s, c) => s + (c.completedLessons ?? 0),
    0,
  );

  return (
    <>
      <div className="max-w-[1120px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-t1 text-2xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Xin chào,{" "}
            <span className="text-acc">{user?.email?.split("@")[0]}</span> 👋
          </h1>
          <p className="text-t3 text-sm mt-1">
            Hãy tiếp tục hành trình tiếng Nhật của bạn hôm nay.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Chuỗi ngày học"
            value={`${streak.currentStreak} ngày`}
            icon={Flame}
            accent
          />
          <StatCard
            label="Kỷ lục cá nhân"
            value={`${streak.longestStreak} ngày`}
            icon={Trophy}
          />
          <StatCard
            label="Bài học đã hoàn thành"
            value={totalCompleted}
            icon={CheckCircle}
          />
          <StatCard
            label="Khoá học đang học"
            value={courses.length}
            icon={BookOpen}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course progress */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-t1 font-semibold text-sm">
                Tiến độ khoá học
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/khoa-hoc")}
              >
                Xem tất cả <ArrowRight size={13} />
              </Button>
            </div>

            {coursesError ? (
              <div className="border border-b1 rounded-xl bg-s1 p-10 text-center">
                <AlertCircle size={32} className="text-t3 mx-auto mb-3" />
                <p className="text-t2 text-sm font-medium mb-1">
                  Không thể tải khoá học
                </p>
                <p className="text-t3 text-xs">
                  Đã xảy ra lỗi. Vui lòng thử lại.
                </p>
              </div>
            ) : coursesLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-b1 rounded-xl bg-s1 p-4 h-20 animate-pulse"
                  />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="border border-b1 rounded-xl bg-s1 p-10 text-center">
                <BookOpen size={32} className="text-t3 mx-auto mb-3" />
                <p className="text-t2 text-sm font-medium mb-1">
                  Chưa có khoá học nào
                </p>
                <p className="text-t3 text-xs mb-4">
                  Khám phá khoá học và bắt đầu học ngay hôm nay
                </p>
                <Button size="sm" onClick={() => navigate("/khoa-hoc")}>
                  Khám phá khoá học
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {courses.map((course) => {
                  const total = course.lessonCount ?? 0;
                  const done = course.completedLessons ?? 0;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div
                      key={course.id}
                      className="border border-b1 rounded-xl bg-s1 p-4 cursor-pointer hover:border-b2 transition-colors"
                      onClick={() => navigate(`/khoa-hoc/${course.id}`)}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="text-t1 text-sm font-medium">
                            {course.title}
                          </div>
                          <div className="text-t3 text-xs mt-0.5">
                            {done}/{total} bài học
                          </div>
                        </div>
                        <Badge variant={pct === 100 ? "success" : "default"}>
                          {pct}%
                        </Badge>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent quiz attempts */}
          <div>
            <h2 className="text-t1 font-semibold text-sm mb-4">Quiz gần đây</h2>

            {attemptsError ? (
              <div className="border border-b1 rounded-xl bg-s1 p-8 text-center">
                <AlertCircle size={28} className="text-t3 mx-auto mb-3" />
                <p className="text-t3 text-xs">Không thể tải lịch sử quiz.</p>
              </div>
            ) : attemptsLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-b1 rounded-xl bg-s1 p-4 h-16 animate-pulse"
                  />
                ))}
              </div>
            ) : attempts.length === 0 ? (
              <div className="border border-b1 rounded-xl bg-s1 p-8 text-center">
                <Clock size={28} className="text-t3 mx-auto mb-3" />
                <p className="text-t3 text-xs">Chưa có lần làm quiz nào</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    onClick={() => setReviewAttemptId(attempt.id)}
                    className="border border-b1 rounded-xl bg-s1 p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-b2 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-t1 text-sm font-medium truncate">
                        {attempt.lessonTitle ?? "Bài học"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-xs font-medium ${attempt.passed ? "text-ok" : "text-acc"}`}
                        >
                          {attempt.passed ? "✓ Đạt" : "✗ Chưa đạt"}
                        </span>
                        <span className="text-t3 text-xs">·</span>
                        <span className="text-t3 text-xs">
                          {formatDate(attempt.attemptedAt)}
                        </span>
                      </div>
                    </div>
                    <Badge variant={attempt.passed ? "success" : "acc"}>
                      {attempt.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewAttemptId !== null && (
        <AttemptReviewModal
          attemptId={reviewAttemptId}
          onClose={() => setReviewAttemptId(null)}
        />
      )}
    </>
  );
}
