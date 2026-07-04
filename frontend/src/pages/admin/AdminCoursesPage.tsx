import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Course, Level } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Pencil,
  Trash2,
  ListVideo,
  Eye,
  EyeOff,
  BookOpen,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAdminCourses,
  useAdminLevels,
  useSaveCourseMutation,
  useDeleteCourseMutation,
  useToggleVisibilityMutation,
} from "@/hooks/useAdminCourse";

// ── Course Form Modal ─────────────────────────────────────────────────────────

function CourseFormModal({
  course,
  levels,
  onClose,
  onSaved,
}: {
  course?: Course;
  levels: Level[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!course;
  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnailUrl ?? "");
  const [levelId, setLevelId] = useState<number>(
    course?.levelId ?? levels[0]?.id ?? 0,
  );
  const [orderIndex, setOrderIndex] = useState(course?.order ?? 1);
  const [price, setPrice] = useState(course?.price ?? 0);
  const [error, setError] = useState("");

  const mutation = useSaveCourseMutation(isEdit ? course!.id : undefined);

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-surface relative w-full max-w-[520px] rounded-2xl border border-b2 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-t1 font-bold text-base">
            {isEdit ? "Chỉnh sửa khoá học" : "Tạo khoá học mới"}
          </h2>
          <button onClick={onClose} className="text-t3 hover:text-t2">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              Tên khoá học *
            </label>
            <input
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
              placeholder="Nhập tên khoá học"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              Mô tả *
            </label>
            <textarea
              rows={3}
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors resize-none"
              placeholder="Nhập mô tả khoá học"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              URL Thumbnail
            </label>
            <input
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
              placeholder="https://..."
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border border-b1"
                onError={(e) => ((e.target as HTMLImageElement).hidden = true)}
              />
            )}
          </div>

          <div className={isEdit ? "grid grid-cols-2 gap-3" : ""}>
            <div>
              <label className="text-t2 text-xs font-medium mb-1.5 block">
                Cấp độ *
              </label>
              <select
                className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
                value={levelId}
                onChange={(e) => setLevelId(Number(e.target.value))}
              >
                {levels.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.name} — {lv.description.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="text-t2 text-xs font-medium mb-1.5 block">
                  Thứ tự
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-t2 text-xs font-medium mb-1.5 block">
              Giá khoá học (VND) — để 0 nếu miễn phí
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              className="w-full bg-s2 border border-b1 rounded-lg px-3 py-2 text-t1 text-sm outline-none focus:border-acc transition-colors"
              placeholder="0"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <p className="text-t3 text-xs mt-1">
              {price > 0 ? `${price.toLocaleString("vi-VN")}₫` : "Miễn phí"}
            </p>
          </div>

          {error && (
            <p className="text-acc text-xs flex items-center gap-1.5">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1"
              loading={mutation.isPending}
              disabled={!title.trim() || !description.trim()}
              onClick={() => {
                setError("");
                mutation.mutate(
                  {
                    title,
                    description,
                    thumbnailUrl,
                    levelId,
                    orderIndex,
                    price,
                  },
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
              {isEdit ? "Lưu thay đổi" : "Tạo khoá học"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Huỷ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirmModal({
  course,
  onClose,
  onDeleted,
}: {
  course: Course;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const mutation = useDeleteCourseMutation();

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-surface w-full max-w-[400px] rounded-2xl border border-b2 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-acc-muted border border-acc-bd flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-acc" />
        </div>
        <h2 className="text-t1 font-bold text-base mb-2">Xoá khoá học?</h2>
        <p className="text-t3 text-sm mb-6">
          Khoá học <span className="text-t1 font-medium">"{course.title}"</span>{" "}
          sẽ bị xoá vĩnh viễn cùng toàn bộ bài học và quiz liên quan.
        </p>
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-acc hover:bg-acc-hover border-acc"
            loading={mutation.isPending}
            onClick={() =>
              mutation.mutate(course.id, {
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

export function AdminCoursesPage() {
  const navigate = useNavigate();
  const [formTarget, setFormTarget] = useState<Course | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const { data: courses = [], isLoading } = useAdminCourses();
  const { data: levels = [] } = useAdminLevels();
  const toggleVisibility = useToggleVisibilityMutation();

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10">
      {formTarget !== null && (
        <CourseFormModal
          course={formTarget === "new" ? undefined : formTarget}
          levels={levels}
          onClose={() => setFormTarget(null)}
          onSaved={() => setFormTarget(null)} // hooks invalidate tự động
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          course={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-t1 text-2xl font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Quản lý khoá học
          </h1>
          <p className="text-t3 text-sm mt-1">
            {courses.length} khoá học ·{" "}
            {courses.filter((c) => !c.hidden).length} đang hiển thị
          </p>
        </div>
        <Button onClick={() => setFormTarget("new")}>
          <Plus size={14} /> Tạo khoá học
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-s1 border border-b1 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="border border-b1 rounded-xl bg-s1 p-20 text-center">
          <BookOpen size={36} className="text-t3 mx-auto mb-3" />
          <p className="text-t2 font-medium mb-1">Chưa có khoá học nào</p>
          <p className="text-t3 text-sm mb-5">
            Bắt đầu bằng cách tạo khoá học đầu tiên.
          </p>
          <Button onClick={() => setFormTarget("new")}>
            <Plus size={14} /> Tạo khoá học
          </Button>
        </div>
      ) : (
        <div className="border border-b1 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_80px_80px_130px] gap-4 px-4 py-2.5 border-b border-b1 bg-s2">
            <span className="text-t3 text-xs font-medium">Khoá học</span>
            <span className="text-t3 text-xs font-medium">Cấp độ</span>
            <span className="text-t3 text-xs font-medium text-center">
              Bài học
            </span>
            <span className="text-t3 text-xs font-medium text-center">
              Thứ tự
            </span>
            <span className="text-t3 text-xs font-medium text-right">
              Thao tác
            </span>
          </div>

          {courses.map((course) => (
            <div
              key={course.id}
              className={cn(
                "grid grid-cols-[2fr_1fr_80px_80px_130px] gap-4 px-4 py-3 border-b border-b1 last:border-b-0 items-center transition-colors hover:bg-s2/50",
                course.hidden && "opacity-50",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-b1 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-s2 border border-b1 flex items-center justify-center shrink-0">
                    <BookOpen size={14} className="text-t3" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-t1 text-sm font-medium truncate">
                    {course.title}
                  </div>
                  {/* line-clamp thay vì JS slice để tránh cắt giữa ký tự đa byte */}
                  <div className="text-t3 text-xs line-clamp-1">
                    {course.description}
                  </div>
                </div>
              </div>

              <Badge variant="muted" className="font-jp w-fit">
                {course.levelName}
              </Badge>

              <span className="text-t2 text-sm text-center">
                {course.lessonCount ?? 0}
              </span>

              <span className="text-t3 text-sm text-center">
                {course.order}
              </span>

              <div className="flex items-center justify-end gap-1">
                <button
                  title="Quản lý bài học"
                  onClick={() =>
                    navigate(`/admin/khoa-hoc/${course.id}/bai-hoc`)
                  }
                  className="p-1.5 rounded-md text-t3 hover:text-t1 hover:bg-s2 transition-colors"
                >
                  <ListVideo size={14} />
                </button>
                <button
                  title={course.hidden ? "Hiện khoá học" : "Ẩn khoá học"}
                  onClick={() => toggleVisibility.mutate(course.id)}
                  className="p-1.5 rounded-md text-t3 hover:text-t1 hover:bg-s2 transition-colors"
                >
                  {course.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  title="Chỉnh sửa"
                  onClick={() => setFormTarget(course)}
                  className="p-1.5 rounded-md text-t3 hover:text-t1 hover:bg-s2 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  title="Xoá"
                  onClick={() => setDeleteTarget(course)}
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
