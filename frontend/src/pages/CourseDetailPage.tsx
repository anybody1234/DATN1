import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Play,
  CheckCircle,
  ChevronLeft,
  Clock,
  BookOpen,
  AlertCircle,
  UserPlus,
  Lock,
  CreditCard,
} from "lucide-react";
import { formatDuration, cn } from "@/lib/utils";
import {
  useCourse,
  useEnrollment,
  useCourseLessons,
  useEnrollMutation,
} from "@/hooks/useCourse";
import { useCreatePaymentMutation } from "@/hooks/usePayment";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    data: course,
    isLoading: loadingCourse,
    isError: courseError,
  } = useCourse(courseId);
  const { data: isEnrolled = false } = useEnrollment(courseId);
  const { data: lessons = [], isLoading: loadingLessons } =
    useCourseLessons(courseId);
  const enrollMutation = useEnrollMutation(courseId);
  const paymentMutation = useCreatePaymentMutation();

  const isPaid = (course?.price ?? 0) > 0;

  // ── Derived ───────────────────────────────────────────────────────────────
  const completed = lessons.filter((l) => l.completed).length;
  const pct =
    lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;

  // ── Render ────────────────────────────────────────────────────────────────
  // Loading trước — tránh flash error state trong lúc TanStack Query retry
  if (loadingCourse || loadingLessons) {
    return (
      <div className="max-w-[1120px] mx-auto px-6 py-10 animate-pulse">
        <div className="h-4 bg-s1 rounded w-24 mb-6" />
        <div className="h-8 bg-s1 rounded w-1/2 mb-3" />
        <div className="h-4 bg-s1 rounded w-full mb-2" />
        <div className="h-4 bg-s1 rounded w-3/4" />
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="max-w-[1120px] mx-auto px-6 py-20 text-center">
        <AlertCircle size={36} className="text-t3 mx-auto mb-4" />
        <p className="text-t1 font-semibold mb-2">Không tìm thấy khoá học</p>
        <p className="text-t3 text-sm mb-6">
          Khoá học này không tồn tại hoặc đã bị xoá.
        </p>
        <button
          onClick={() => navigate("/khoa-hoc")}
          className="text-t3 text-xs hover:text-t2 transition-colors flex items-center gap-1 mx-auto"
        >
          <ChevronLeft size={14} /> Quay lại danh sách khoá học
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/khoa-hoc")}
        className="flex items-center gap-1.5 text-t3 text-xs hover:text-t2 transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Khoá học
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          {course?.levelName && (
            <Badge variant="acc" className="mb-3 font-jp">
              {course.levelName}
            </Badge>
          )}
          <h1
            className="text-t1 text-3xl font-bold mb-3"
            style={{ letterSpacing: "-0.03em" }}
          >
            {course?.title}
          </h1>
          <p className="text-t2 text-sm leading-relaxed mb-5">
            {course?.description}
          </p>
          <div className="flex items-center gap-5 text-t3 text-xs">
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} /> {lessons.length} bài học
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={13} /> {completed} hoàn thành
            </span>
          </div>
        </div>

        {/* Progress / Enrollment card */}
        <div className="border border-b1 rounded-xl bg-s1 p-5 h-fit">
          {!isEnrolled ? (
            <>
              {isPaid ? (
                <>
                  <p className="text-t1 text-2xl font-bold mb-1">
                    {course!.price.toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-t3 text-xs mb-4">
                    Thanh toán một lần, học không giới hạn.
                  </p>
                  <Button
                    className="w-full"
                    loading={paymentMutation.isPending}
                    onClick={() => {
                      paymentMutation.mutate(course!.id, {
                        onSuccess: (data) => {
                          if (data.paymentUrl) {
                            window.location.href = data.paymentUrl;
                          }
                        },
                      });
                    }}
                  >
                    <CreditCard size={14} /> Mua khoá học
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-t2 text-sm font-medium mb-1">Miễn phí</p>
                  <p className="text-t3 text-xs mb-4">
                    Đăng ký để bắt đầu học và theo dõi tiến độ của bạn.
                  </p>
                  <Button
                    className="w-full"
                    loading={enrollMutation.isPending}
                    onClick={() => enrollMutation.mutate()}
                  >
                    <UserPlus size={14} /> Đăng ký học
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-t2 text-sm font-medium">Tiến độ</span>
                <Badge variant={pct === 100 ? "success" : "default"}>
                  {pct}%
                </Badge>
              </div>
              <div className="w-full h-1.5 bg-s2 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-acc rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-t3 text-xs mb-4">
                {completed}/{lessons.length} bài học đã hoàn thành
              </p>
              {lessons.length > 0 && (
                <Button
                  className="w-full"
                  onClick={() => {
                    const next =
                      lessons.find((l) => !l.completed) ?? lessons[0];
                    navigate(`/khoa-hoc/${courseId}/bai-hoc/${next.id}`);
                  }}
                >
                  <Play size={14} />
                  {completed === 0 ? "Bắt đầu học" : "Tiếp tục học"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lesson list */}
      <h2 className="text-t1 font-semibold text-sm mb-4">Danh sách bài học</h2>

      {lessons.length === 0 ? (
        <div className="border border-b1 rounded-xl bg-s1 p-10 text-center">
          <p className="text-t3 text-sm">Khoá học chưa có bài học nào.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className={cn(
                "border border-b1 rounded-xl bg-s1 p-4 flex items-center gap-4 transition-all duration-150",
                isEnrolled
                  ? "cursor-pointer hover:border-b2"
                  : "opacity-50 cursor-not-allowed",
              )}
              onClick={() =>
                isEnrolled &&
                navigate(`/khoa-hoc/${courseId}/bai-hoc/${lesson.id}`)
              }
            >
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-b2">
                {lesson.completed ? (
                  <CheckCircle size={16} className="text-acc" />
                ) : (
                  <span className="text-t3 text-xs font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-t1 text-sm font-medium truncate">
                  {lesson.title}
                </div>
                {lesson.duration > 0 && (
                  <div className="flex items-center gap-1 text-t3 text-xs mt-0.5">
                    <Clock size={11} />
                    {formatDuration(lesson.duration)}
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <Play size={14} className="text-t3 shrink-0" />
              ) : (
                <Lock size={14} className="text-t3 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
