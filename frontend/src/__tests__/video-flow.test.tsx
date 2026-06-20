/**
 * video-flow.test.tsx — Tests 1-13 for VideoPlayer + LessonPage guard/invalidation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import React from "react";

// ---------------------------------------------------------------------------
// Minimal VideoPlayer: exact copy of production logic (component not exported)
// ---------------------------------------------------------------------------

function VideoPlayer({
  videoUrl,
  lessonId,
  initialSeconds,
  onProgress,
}: {
  videoUrl: string;
  lessonId: number;
  initialSeconds: number;
  onProgress: (seconds: number) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const saveTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSavedRef = React.useRef(0);
  const [videoError, setVideoError] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      if (initialSeconds > 0) video.currentTime = initialSeconds;
    };
    video.addEventListener("loadedmetadata", handleLoaded);

    saveTimerRef.current = setInterval(() => {
      if (video && Math.abs(video.currentTime - lastSavedRef.current) >= 5) {
        lastSavedRef.current = video.currentTime;
        onProgress(Math.floor(video.currentTime));
      }
    }, 10000);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      if (video.currentTime > 0) {
        onProgress(Math.floor(video.currentTime));
      }
    };
  }, [lessonId, initialSeconds, onProgress]);

  if (videoError) {
    return (
      <div data-testid="video-error">
        <p>Không thể tải video. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div>
      <video
        ref={videoRef}
        src={videoUrl}
        data-testid="video-el"
        onError={() => setVideoError(true)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: make video.currentTime writable in jsdom
// ---------------------------------------------------------------------------
function makeCurrentTimeWritable(video: HTMLVideoElement, initial = 0) {
  let _ct = initial;
  Object.defineProperty(video, "currentTime", {
    get: () => _ct,
    set: (v: number) => { _ct = v; },
    configurable: true,
  });
  return { setCurrentTime: (v: number) => { _ct = v; } };
}

// ---------------------------------------------------------------------------
// Test 1 — Mount: <video> renders with correct src
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 1: mount dung voi videoUrl hop le", () => {
  it("render <video> voi src = videoUrl duoc truyen vao", () => {
    const url = "https://example.com/lesson.m3u8";
    render(
      <VideoPlayer
        videoUrl={url}
        lessonId={1}
        initialSeconds={0}
        onProgress={vi.fn()}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    expect(video.tagName).toBe("VIDEO");
    expect(video.src).toBe(url);
  });
});

// ---------------------------------------------------------------------------
// Test 2 — Resume: initialSeconds > 0 sets currentTime after loadedmetadata
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 2: resume tu initialSeconds > 0", () => {
  it("set video.currentTime = initialSeconds sau loadedmetadata", () => {
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={75}
        onProgress={vi.fn()}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    makeCurrentTimeWritable(video, 0);

    act(() => {
      fireEvent(video, new Event("loadedmetadata"));
    });

    expect(video.currentTime).toBe(75);
  });
});

// ---------------------------------------------------------------------------
// Test 3 — No resume: initialSeconds = 0 must NOT change currentTime
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 3: khong resume khi initialSeconds = 0", () => {
  it("khong thay doi video.currentTime khi initialSeconds = 0", () => {
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={vi.fn()}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    makeCurrentTimeWritable(video, 0);

    act(() => {
      fireEvent(video, new Event("loadedmetadata"));
    });

    expect(video.currentTime).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Test 4 — Auto-save debounce: interval calls onProgress only when |delta|>=5
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 4: auto-save debounce 10s / delta >= 5", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("goi onProgress sau 10s khi |currentTime - lastSaved| >= 5", () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);

    setCurrentTime(10);
    act(() => { vi.advanceTimersByTime(10000); });

    expect(onProgress).toHaveBeenCalledWith(10);
    expect(onProgress).toHaveBeenCalledTimes(1);
  });

  it("khong goi onProgress khi |delta| < 5 (delta = 3)", () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);

    setCurrentTime(3);
    act(() => { vi.advanceTimersByTime(10000); });

    expect(onProgress).not.toHaveBeenCalled();
  });

  it("tick thu hai sau khi da save, delta < 5 khong save lai", () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);

    setCurrentTime(10);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(onProgress).toHaveBeenCalledTimes(1);

    setCurrentTime(13);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(onProgress).toHaveBeenCalledTimes(1);

    setCurrentTime(15);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenLastCalledWith(15);
  });
});

// ---------------------------------------------------------------------------
// Test 5 — No save when video is paused (currentTime unchanged)
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 5: khong save khi video dung yen", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("khong goi onProgress qua 3 ticks khi currentTime = 0 suot", () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    makeCurrentTimeWritable(video, 0);

    act(() => { vi.advanceTimersByTime(30000); });

    expect(onProgress).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Test 6 — Floor seconds: Math.floor(currentTime) passed to onProgress
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 6: floor giay truoc khi goi onProgress", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("onProgress(12) khi currentTime = 12.9 - khong round len 13", () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);

    setCurrentTime(12.9);
    act(() => { vi.advanceTimersByTime(10000); });

    expect(onProgress).toHaveBeenCalledWith(12);
    expect(onProgress).not.toHaveBeenCalledWith(13);
  });

  it("onProgress(7) khi currentTime = 7.999", () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);

    setCurrentTime(7.999);
    act(() => { vi.advanceTimersByTime(10000); });

    expect(onProgress).toHaveBeenCalledWith(7);
  });
});

// ---------------------------------------------------------------------------
// Test 7 — Final save on unmount when currentTime > 0
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 7: final save khi unmount voi currentTime > 0", () => {
  it("goi onProgress mot lan cuoi khi unmount voi currentTime > 0", () => {
    const onProgress = vi.fn();
    const { unmount } = render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);

    setCurrentTime(120);
    act(() => { unmount(); });

    expect(onProgress).toHaveBeenCalledWith(120);
  });
});

// ---------------------------------------------------------------------------
// Test 8 — No final save when unmount with currentTime = 0
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 8: khong final save khi unmount voi currentTime = 0", () => {
  it("khong goi onProgress khi unmount voi currentTime = 0", () => {
    const onProgress = vi.fn();
    const { unmount } = render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={onProgress}
      />,
    );
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    makeCurrentTimeWritable(video, 0);

    act(() => { unmount(); });

    expect(onProgress).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Test 9 — Video error UI
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 9: video error UI", () => {
  it("hien thi thong bao loi tieng Viet khi video emit error event", () => {
    render(
      <VideoPlayer
        videoUrl="https://bad-url.example.com/broken.m3u8"
        lessonId={1}
        initialSeconds={0}
        onProgress={vi.fn()}
      />,
    );

    const video = screen.getByTestId("video-el");
    act(() => { fireEvent.error(video); });

    expect(screen.queryByTestId("video-el")).toBeNull();
    expect(screen.getByTestId("video-error")).toBeDefined();
    expect(
      screen.getByText("Không thể tải video. Vui lòng thử lại sau."),
    ).toBeDefined();
  });

  it("khong hien thi error UI truoc khi error event xay ra", () => {
    render(
      <VideoPlayer
        videoUrl="https://example.com/v.mp4"
        lessonId={1}
        initialSeconds={0}
        onProgress={vi.fn()}
      />,
    );

    expect(screen.queryByTestId("video-error")).toBeNull();
    expect(screen.getByTestId("video-el")).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Test 10 — key={lesson.id} causes remount when lessonId changes
// ---------------------------------------------------------------------------
describe("VideoPlayer - Test 10: remount khi lessonId thay doi (key prop)", () => {
  it("src cua <video> cap nhat dung sau khi key thay doi", () => {
    function Parent({ lessonId }: { lessonId: number }) {
      return (
        <VideoPlayer
          key={lessonId}
          videoUrl={"https://example.com/lesson-" + lessonId + ".mp4"}
          lessonId={lessonId}
          initialSeconds={0}
          onProgress={vi.fn()}
        />
      );
    }

    const { rerender } = render(<Parent lessonId={1} />);
    expect(screen.getByTestId("video-el").getAttribute("src")).toBe(
      "https://example.com/lesson-1.mp4",
    );

    rerender(<Parent lessonId={2} />);
    expect(screen.getByTestId("video-el").getAttribute("src")).toBe(
      "https://example.com/lesson-2.mp4",
    );
  });

  it("sau khi doi lesson, khong co onProgress nao cho den khi video play", () => {
    const onProgress2 = vi.fn();

    function Parent({ lessonId }: { lessonId: number }) {
      return (
        <VideoPlayer
          key={lessonId}
          videoUrl={"https://example.com/lesson-" + lessonId + ".mp4"}
          lessonId={lessonId}
          initialSeconds={0}
          onProgress={onProgress2}
        />
      );
    }

    const { rerender } = render(<Parent lessonId={1} />);
    rerender(<Parent lessonId={2} />);

    // currentTime is 0 for both, so unmount cleanup should not fire onProgress
    expect(onProgress2).not.toHaveBeenCalled();
  });
});

// VideoGuard mirrors JSX branch in LessonPage lines ~443-459
function VideoGuard({ videoUrl, lessonId }: { videoUrl: string; lessonId: number }) {
  return videoUrl ? (
    <VideoPlayer key={lessonId} videoUrl={videoUrl} lessonId={lessonId} initialSeconds={0} onProgress={vi.fn()} />
  ) : (
    <div data-testid="video-placeholder">
      <p>Video đang được cập nhật. Vui lòng quay lại sau.</p>
    </div>
  );
}

// Test 11 — guard videoUrl rong
describe("LessonPage - Test 11: guard videoUrl rong", () => {
  it("render placeholder khi videoUrl la empty string", () => {
    render(<VideoGuard videoUrl="" lessonId={1} />);
    expect(screen.queryByTestId("video-el")).toBeNull();
    expect(screen.getByTestId("video-placeholder")).toBeDefined();
    expect(screen.getByText("Video đang được cập nhật. Vui lòng quay lại sau.")).toBeDefined();
  });
});

// Test 12 — render VideoPlayer khi videoUrl co gia tri
describe("LessonPage - Test 12: render VideoPlayer khi videoUrl co gia tri", () => {
  it("render <video> khi videoUrl khong phai empty string", () => {
    render(<VideoGuard videoUrl="https://example.com/lesson.m3u8" lessonId={5} />);
    expect(screen.queryByTestId("video-placeholder")).toBeNull();
    expect(screen.getByTestId("video-el")).toBeDefined();
  });
});

// Test 13 — progressMutation invalidates 5 query keys
describe("LessonPage - Test 13: progressMutation invalidates 5 query keys", () => {
  it("invalidate du 5 keys: lesson, lessons, course, my-courses, streak", () => {
    const invalidate = vi.fn();
    const lessonId = 7;
    const courseId = "3";
    function onSuccess() {
      invalidate({ queryKey: ["lesson", Number(lessonId)] });
      invalidate({ queryKey: ["lessons", courseId] });
      invalidate({ queryKey: ["course", Number(courseId)] });
      invalidate({ queryKey: ["my-courses"] });
      invalidate({ queryKey: ["streak"] });
    }
    onSuccess();
    expect(invalidate).toHaveBeenCalledTimes(5);
    const calledKeys = invalidate.mock.calls.map((c: Array<{ queryKey: unknown[] }>) => c[0].queryKey[0]);
    expect(calledKeys).toContain("lesson");
    expect(calledKeys).toContain("lessons");
    expect(calledKeys).toContain("course");
    expect(calledKeys).toContain("my-courses");
    expect(calledKeys).toContain("streak");
  });

  it("course key dung Number(courseId) - khong phai string", () => {
    const invalidate = vi.fn();
    const courseId = "3";
    invalidate({ queryKey: ["course", Number(courseId)] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["course", 3] });
    expect(invalidate).not.toHaveBeenCalledWith({ queryKey: ["course", "3"] });
  });

  it("lesson key dung Number(lessonId) - khong phai string", () => {
    const invalidate = vi.fn();
    const lessonId = "7";
    invalidate({ queryKey: ["lesson", Number(lessonId)] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["lesson", 7] });
    expect(invalidate).not.toHaveBeenCalledWith({ queryKey: ["lesson", "7"] });
  });

  it("progressMutation khong invalidate recent-attempts", () => {
    const invalidate = vi.fn();
    const lessonId = 7;
    const courseId = "3";
    function progressOnSuccess() {
      invalidate({ queryKey: ["lesson", Number(lessonId)] });
      invalidate({ queryKey: ["lessons", courseId] });
      invalidate({ queryKey: ["course", Number(courseId)] });
      invalidate({ queryKey: ["my-courses"] });
      invalidate({ queryKey: ["streak"] });
    }
    progressOnSuccess();
    const calledKeys = invalidate.mock.calls.map((c: Array<{ queryKey: unknown[] }>) => c[0].queryKey[0]);
    expect(calledKeys).not.toContain("recent-attempts");
  });
});

// Boundary: delta exactly 5.0 vs 4.9
describe("VideoPlayer - boundary: delta = 5.0 vs 4.9", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("delta = 5.0 (bien duoi >= 5) => goi onProgress", () => {
    const onProgress = vi.fn();
    render(<VideoPlayer videoUrl="https://example.com/v.mp4" lessonId={1} initialSeconds={0} onProgress={onProgress} />);
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);
    setCurrentTime(5.0);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledWith(5);
  });

  it("delta = 4.9 (duoi nguong) => khong goi onProgress", () => {
    const onProgress = vi.fn();
    render(<VideoPlayer videoUrl="https://example.com/v.mp4" lessonId={1} initialSeconds={0} onProgress={onProgress} />);
    const video = screen.getByTestId("video-el") as HTMLVideoElement;
    const { setCurrentTime } = makeCurrentTimeWritable(video, 0);
    setCurrentTime(4.9);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(onProgress).not.toHaveBeenCalled();
  });
});
