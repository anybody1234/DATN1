import { useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/VideoPlayer";
import {
  VideoOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { loadYouTubeAPI } from "@/lib/youtube";
import { useEnrollment, useCourseLessons } from "@/hooks/useCourse";
import { useLessonDetail, useProgressMutation } from "@/hooks/useLesson";

export function LessonPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const navigatedRef = useRef(false);
  const wasCompletedRef = useRef(false);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: isEnrolled } = useEnrollment(courseId);
  const {
    data: lesson,
    isLoading: lessonLoading,
    isError: lessonError,
  } = useLessonDetail(lessonId);
  const { data: lessons = [] } = useCourseLessons(courseId);
  const progressMutation = useProgressMutation(lessonId, courseId);

  // Stable ref — tránh stale closure trong callbacks
  const progressMutationRef = useRef(progressMutation);
  useEffect(() => {
    progressMutationRef.current = progressMutation;
  }, [progressMutation]);

  // ── Guards ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isEnrolled === false) {
      navigate(`/khoa-hoc/${courseId}`, { replace: true });
    }
  }, [isEnrolled, courseId, navigate]);

  // Reset khi chuyển sang bài học khác trong cùng trang (M-5 bug fix)
  useEffect(() => {
    navigatedRef.current = false;
    wasCompletedRef.current = false;
  }, [lessonId]);

  // Preload YouTube IFrame API ngay khi vào trang, không chờ lesson load xong
  useEffect(() => {
    loadYouTubeAPI();
  }, []);

  // Theo dõi trạng thái completed ban đầu để phân biệt lần đầu và xem lại
  useEffect(() => {
    if (lesson?.completed) wasCompletedRef.current = true;
  }, [lesson?.completed]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleProgress = useCallback((seconds: number) => {
    progressMutationRef.current.mutate({ watchedSeconds: seconds });
  }, []);

  const handleComplete = useCallback(
    (finalSeconds: number) => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      progressMutationRef.current.mutate({
        watchedSeconds: finalSeconds,
        completed: true,
      });
      if (!wasCompletedRef.current) {
        navigate(`/khoa-hoc/${courseId}/bai-hoc/${lessonId}/quiz`);
      }
    },
    [navigate, courseId, lessonId],
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentIdx = lessons.findIndex((l) => l.id === Number(lessonId));
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  // ── Render ────────────────────────────────────────────────────────────────
  if (lessonError) {
    return (
      <div className="max-w-[1120px] mx-auto px-6 py-20 text-center">
        <AlertCircle size={36} className="text-t3 mx-auto mb-4" />
        <p className="text-t1 font-semibold mb-2">Không tìm thấy bài học</p>
        <p className="text-t3 text-sm mb-6">
          Bài học này không tồn tại hoặc đã bị xoá.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate(`/khoa-hoc/${courseId}`)}
        >
          <ChevronLeft size={14} /> Quay lại khoá học
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-8">
      <button
        onClick={() => navigate(`/khoa-hoc/${courseId}`)}
        className="flex items-center gap-1.5 text-t3 text-xs hover:text-t2 transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Quay lại khoá học
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {lessonLoading || !lesson ? (
            <div className="aspect-video bg-s1 border border-b1 rounded-xl animate-pulse" />
          ) : (
            <>
              {lesson.videoUrl ? (
                <VideoPlayer
                  key={lesson.id}
                  videoUrl={lesson.videoUrl}
                  lessonId={lesson.id}
                  duration={lesson.duration}
                  initialSeconds={lesson.watchedSeconds ?? 0}
                  onProgress={handleProgress}
                  onComplete={handleComplete}
                />
              ) : (
                <div className="w-full aspect-video bg-s1 rounded-xl border border-b1 flex flex-col items-center justify-center gap-3 text-t3">
                  <VideoOff size={32} />
                  <p className="text-sm">
                    Video đang được cập nhật. Vui lòng quay lại sau.
                  </p>
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mt-4 mb-2">
                <h1 className="text-t1 text-xl font-bold heading-tight">
                  {lesson.title}
                </h1>
                {lesson.completed && (
                  <Badge variant="success" className="shrink-0 mt-0.5">
                    <CheckCircle size={10} className="mr-1" /> Hoàn thành
                  </Badge>
                )}
              </div>

              <p className="text-t3 text-xs mb-5">
                {lesson.completed
                  ? "Bạn đã hoàn thành bài học này. Có thể xem lại tự do."
                  : "Xem hết video để mở khoá bài kiểm tra."}
              </p>

              <div className="flex items-center justify-between pt-5 border-t border-b1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() =>
                    prevLesson &&
                    navigate(`/khoa-hoc/${courseId}/bai-hoc/${prevLesson.id}`)
                  }
                >
                  <ChevronLeft size={14} /> Bài trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextLesson}
                  onClick={() =>
                    nextLesson &&
                    navigate(`/khoa-hoc/${courseId}/bai-hoc/${nextLesson.id}`)
                  }
                >
                  Bài tiếp theo <ChevronRight size={14} />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar: lesson list */}
        <div>
          <h2 className="text-t1 font-semibold text-sm mb-3">
            Bài học trong khoá
          </h2>
          <div className="flex flex-col gap-1.5 max-h-[600px] overflow-y-auto pr-1">
            {lessons.map((l, idx) => (
              <button
                key={l.id}
                onClick={() =>
                  navigate(`/khoa-hoc/${courseId}/bai-hoc/${l.id}`)
                }
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg border transition-all text-xs",
                  l.id === Number(lessonId)
                    ? "border-acc-bd bg-acc-muted text-t1"
                    : "border-b1 text-t2 hover:border-b2 hover:text-t1",
                )}
              >
                <div className="flex items-center gap-2">
                  {l.completed ? (
                    <CheckCircle size={12} className="text-acc shrink-0" />
                  ) : (
                    <span className="text-t3 font-mono w-3 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="truncate">{l.title}</span>
                  {l.completed && (
                    <span title="Có quiz" className="ml-auto shrink-0">
                      <ClipboardList size={11} className="text-t3" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
