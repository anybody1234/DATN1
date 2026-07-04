import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Layers, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";
import { useLevels, useAllCourses } from "@/hooks/useCourse";

// ── Course card ───────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();
  const total = course.lessonCount ?? 0;
  const completed = course.completedLessons ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="group border border-b1 rounded-xl bg-s1 overflow-hidden cursor-pointer hover:border-acc-bd transition-all duration-200 hover:-translate-y-0.5"
      onClick={() => navigate(`/khoa-hoc/${course.id}`)}
    >
      <div className="aspect-video bg-s2 relative overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-t3" />
          </div>
        )}
        {completed > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-s2">
            <div
              className="h-full bg-acc transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-t1 text-sm font-semibold leading-snug">
            {course.title}
          </h3>
          {pct === 100 && <Badge variant="success">Hoàn thành</Badge>}
        </div>
        <p className="text-t3 text-xs leading-relaxed line-clamp-2 mb-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-t3 text-xs">{total} bài học</span>
          {completed > 0 && pct < 100 && (
            <span className="text-t2 text-xs">
              {completed}/{total} hoàn thành
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CoursesPage() {
  const [searchParams] = useSearchParams();
  const levelName = searchParams.get("level");

  const { data: levels = [], isLoading: levelsLoading } = useLevels();

  // Filter từ URL param ?level=N3 (từ LandingPage) — derive trực tiếp từ URL + data,
  // override cục bộ khi người dùng tự bấm chọn level khác trong trang.
  const urlDerivedLevel = useMemo(() => {
    if (!levelName) return null;
    return levels.find((lv) => lv.name === levelName)?.id ?? null;
  }, [levelName, levels]);
  const [overrideLevel, setOverrideLevel] = useState<number | null | undefined>(
    undefined,
  );
  const activeLevel =
    overrideLevel !== undefined ? overrideLevel : urlDerivedLevel;

  const {
    data: courses = [],
    isLoading,
    isError: coursesError,
  } = useAllCourses(activeLevel);

  const handleLevelChange = (levelId: number | null) => {
    setOverrideLevel(levelId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10">
      <div className="mb-10">
        <Badge variant="acc" className="mb-3">
          <Layers size={11} className="mr-1" /> Khoá học
        </Badge>
        <h1
          className="text-t1 text-3xl font-bold mb-2"
          style={{ letterSpacing: "-0.03em" }}
        >
          Khoá học tiếng Nhật
        </h1>
        <p className="text-t3 text-sm">Học theo lộ trình JLPT từ N5 đến N1</p>
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => handleLevelChange(null)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
            activeLevel === null
              ? "bg-acc text-white border-acc"
              : "border-b1 text-t2 hover:text-t1 hover:border-b2",
          )}
        >
          Tất cả
        </button>
        {levelsLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-12 rounded-md bg-s1 border border-b1 animate-pulse"
              />
            ))
          : levels.map((lv) => (
              <button
                key={lv.id}
                onClick={() => handleLevelChange(lv.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                  activeLevel === lv.id
                    ? "bg-acc text-white border-acc"
                    : "border-b1 text-t2 hover:text-t1 hover:border-b2",
                )}
              >
                {lv.name}
              </button>
            ))}
      </div>

      {/* Grid */}
      {coursesError ? (
        <div className="text-center py-20 border border-b1 rounded-xl bg-s1">
          <AlertCircle size={32} className="text-t3 mx-auto mb-3" />
          <p className="text-t2 font-medium mb-1">Không thể tải khoá học</p>
          <p className="text-t3 text-sm">Đã xảy ra lỗi. Vui lòng thử lại.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-b1 rounded-xl bg-s1 overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-s2" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-s2 rounded w-3/4" />
                <div className="h-3 bg-s2 rounded w-full" />
                <div className="h-3 bg-s2 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 border border-b1 rounded-xl bg-s1">
          <BookOpen size={36} className="text-t3 mx-auto mb-3" />
          <p className="text-t2 font-medium mb-1">Không có khoá học nào</p>
          <p className="text-t3 text-sm">Chưa có khoá học cho cấp độ này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
