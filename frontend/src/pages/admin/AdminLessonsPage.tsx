import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Lesson } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  VideoOff,
  MonitorPlay,
  X,
  AlertCircle,
  FileVideo,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { cn, formatDurationLong } from "@/lib/utils";
import { isYouTube, detectDuration } from "@/lib/youtube";
import { useAdminCourses } from "@/hooks/useAdminCourse";
import {
  useAdminLessons,
  useSaveLessonMutation,
  useDeleteLessonMutation,
} from "@/hooks/useAdminLesson";

// ── Lesson Form Modal ─────────────────────────────────────────────────────────

function LessonFormModal({
  lesson,
  courseId,
  nextOrder,
  onClose,
  onSaved,
}: {
  lesson?: Lesson;
  courseId: string;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!lesson;
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl ?? "");
  const [duration, setDuration] = useState(lesson?.duration ?? 0);
  const [orderIndex, setOrderIndex] = useState(lesson?.order ?? nextOrder);
  const [error, setError] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const urlRef = useRef(videoUrl);
  urlRef.current = videoUrl;

  const mutation = useSaveLessonMutation(
    courseId,
    isEdit ? lesson!.id : undefined,
  );

  const cancelRef = useRef({ cancelled: false });

  const handleUrlBlur = async () => {
    const url = urlRef.current.trim();
    if (!url) return;
    cancelRef.current.cancelled = false;
    setDetecting(true);
    setAutoDetected(false);
    try {
      const dur = await detectDuration(url, cancelRef.current);
      if (!cancelRef.current.cancelled && dur > 0) {
        setDuration(dur);
        setAutoDetected(true);
      }
    } finally {
      if (!cancelRef.current.cancelled) setDetecting(false);
    }
  };

  // Hủy detect khi modal đóng
  const handleClose = () => {
    cancelRef.current.cancelled = true;
    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full max-w-[520px] rounded-2xl border border-b2 p-6"
        style={{ background: "var(--s1)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-t1 font-bold text-base">
            {isEdit ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
          </h2>
          <button onClick={handleClose} className="text-t3 hover:text-t2">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              Tên bài học *
            </label>
            <input
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
              placeholder="Nhập tên bài học"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              URL Video
            </label>
            <input
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setAutoDetected(false);
              }}
              onBlur={handleUrlBlur}
            />
            {videoUrl && (
              <div className="mt-1.5 flex items-center gap-1.5">
                {isYouTube(videoUrl) ? (
                  <>
                    <MonitorPlay size={12} className="text-acc" />
                    <span className="text-xs text-acc">YouTube</span>
                  </>
                ) : (
                  <>
                    <FileVideo size={12} className="text-t3" />
                    <span className="text-xs text-t3">
                      Video trực tiếp (MP4)
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={isEdit ? "grid grid-cols-2 gap-3" : ""}>
            {/* Thời lượng */}
            <div>
              <label className="text-t2 text-xs font-medium mb-1.5 block">
                Thời lượng
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors pr-14"
                  placeholder="0"
                  value={duration || ""}
                  onChange={(e) => {
                    setDuration(Number(e.target.value));
                    setAutoDetected(false);
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {detecting ? (
                    <Loader2 size={12} className="animate-spin text-t3" />
                  ) : (
                    <span className="text-t3 text-xs">giây</span>
                  )}
                </span>
              </div>
              <p className="text-xs mt-1.5 h-4">
                {detecting ? (
                  <span className="text-t3">Đang đọc thời lượng…</span>
                ) : autoDetected && duration > 0 ? (
                  <span className="text-acc">
                    ✓ {formatDurationLong(duration)}
                  </span>
                ) : duration > 0 ? (
                  <span className="text-t3">
                    {formatDurationLong(duration)}
                  </span>
                ) : (
                  <span className="text-t3">Tự động đọc sau khi dán URL</span>
                )}
              </p>
            </div>

            {/* Thứ tự — chỉ hiện khi chỉnh sửa */}
            {isEdit && (
              <div>
                <label className="text-t2 text-xs font-medium mb-1.5 block">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                />
                <p className="text-t3 text-xs mt-1.5 h-4">
                  Thứ tự xuất hiện trong danh sách
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-acc text-xs flex items-center gap-1.5">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1"
              loading={mutation.isPending || detecting}
              disabled={!title.trim()}
              onClick={() => {
                setError("");
                mutation.mutate(
                  { title, videoUrl, duration, orderIndex },
                  {
                    onSuccess: () => {
                      onSaved();
                      onClose();
                    },
                    onError: () => setError("Lưu thất bại. Vui lòng thử lại."),
                  },
                );
              }}
            >
              {isEdit ? "Lưu thay đổi" : "Thêm bài học"}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Huỷ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteLessonModal({
  lesson,
  courseId,
  onClose,
  onDeleted,
}: {
  lesson: Lesson;
  courseId: string;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const mutation = useDeleteLessonMutation(courseId);

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl border border-b2 p-6 text-center"
        style={{ background: "var(--s1)" }}
      >
        <div className="w-12 h-12 rounded-full bg-acc-muted border border-acc-bd flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-acc" />
        </div>
        <h2 className="text-t1 font-bold text-base mb-2">Xoá bài học?</h2>
        <p className="text-t3 text-sm mb-6">
          Bài học <span className="text-t1 font-medium">"{lesson.title}"</span>{" "}
          sẽ bị xoá vĩnh viễn cùng toàn bộ quiz và dữ liệu liên quan.
        </p>
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-acc hover:bg-acc-hover border-acc"
            loading={mutation.isPending}
            onClick={() =>
              mutation.mutate(lesson.id, {
                onSuccess: () => {
                  onDeleted();
                  onClose();
                },
              })
            }
          >
            Xoá
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Huỷ
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function AdminLessonsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [formTarget, setFormTarget] = useState<Lesson | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);

  const { data: courses = [] } = useAdminCourses();
  const { data: lessons = [], isLoading } = useAdminLessons(courseId);

  const course = courses.find((c) => c.id === Number(courseId));
  const nextOrder =
    lessons.length > 0 ? lessons[lessons.length - 1].order + 1 : 1;

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10">
      {formTarget !== null && courseId && (
        <LessonFormModal
          lesson={formTarget === "new" ? undefined : formTarget}
          courseId={courseId}
          nextOrder={nextOrder}
          onClose={() => setFormTarget(null)}
          onSaved={() => setFormTarget(null)}
        />
      )}
      {deleteTarget && courseId && (
        <DeleteLessonModal
          lesson={deleteTarget}
          courseId={courseId}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => setDeleteTarget(null)}
        />
      )}

      <button
        onClick={() => navigate("/admin/khoa-hoc")}
        className="flex items-center gap-1.5 text-t3 text-xs hover:text-t2 transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Khoá học
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-t1 text-2xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            {course?.title ?? "Bài học"}
          </h1>
          <p className="text-t3 text-sm mt-1">{lessons.length} bài học</p>
        </div>
        <Button onClick={() => setFormTarget("new")}>
          <Plus size={14} /> Thêm bài học
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 bg-s1 border border-b1 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="border border-b1 rounded-xl bg-s1 p-20 text-center">
          <VideoOff size={36} className="text-t3 mx-auto mb-3" />
          <p className="text-t2 font-medium mb-1">Chưa có bài học nào</p>
          <p className="text-t3 text-sm mb-5">
            Thêm bài học đầu tiên cho khoá học này.
          </p>
          <Button onClick={() => setFormTarget("new")}>
            <Plus size={14} /> Thêm bài học
          </Button>
        </div>
      ) : (
        <div className="border border-b1 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_2fr_80px_100px] gap-4 px-4 py-2.5 border-b border-b1 bg-s2">
            <span className="text-t3 text-xs font-medium text-center">#</span>
            <span className="text-t3 text-xs font-medium">Tên bài học</span>
            <span className="text-t3 text-xs font-medium">URL Video</span>
            <span className="text-t3 text-xs font-medium text-center">
              Thời lượng
            </span>
            <span className="text-t3 text-xs font-medium text-right">
              Thao tác
            </span>
          </div>

          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="grid grid-cols-[40px_1fr_2fr_80px_100px] gap-4 px-4 py-3 border-b border-b1 last:border-b-0 items-center hover:bg-s2/50 transition-colors"
            >
              <span className="text-t3 text-xs font-mono text-center">
                {String(lesson.order).padStart(2, "0")}
              </span>

              <span className="text-t1 text-sm font-medium truncate">
                {lesson.title}
              </span>

              <div className="flex items-center gap-1.5 min-w-0">
                {lesson.videoUrl ? (
                  <>
                    {isYouTube(lesson.videoUrl) ? (
                      <MonitorPlay size={12} className="text-acc shrink-0" />
                    ) : (
                      <FileVideo size={12} className="text-t3 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-xs truncate",
                        isYouTube(lesson.videoUrl) ? "text-t2" : "text-t3",
                      )}
                    >
                      {lesson.videoUrl}
                    </span>
                  </>
                ) : (
                  <span className="text-t3 text-xs italic">Chưa có video</span>
                )}
              </div>

              <span className="text-t3 text-xs text-center">
                {formatDurationLong(lesson.duration)}
              </span>

              <div className="flex items-center justify-end gap-1">
                <button
                  title="Quản lý Quiz"
                  onClick={() =>
                    navigate(
                      `/admin/khoa-hoc/${courseId}/bai-hoc/${lesson.id}/quiz`,
                    )
                  }
                  className="p-1.5 rounded-md text-t3 hover:text-t1 hover:bg-s2 transition-colors"
                >
                  <ClipboardList size={14} />
                </button>
                <button
                  title="Chỉnh sửa"
                  onClick={() => setFormTarget(lesson)}
                  className="p-1.5 rounded-md text-t3 hover:text-t1 hover:bg-s2 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  title="Xoá"
                  onClick={() => setDeleteTarget(lesson)}
                  className="p-1.5 rounded-md text-t3 hover:text-acc hover:bg-acc-muted transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
