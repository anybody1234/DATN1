import { useEffect, useRef, useState } from "react";
import { VideoOff } from "lucide-react";
import { extractYouTubeId, loadYouTubeAPI } from "@/lib/youtube";
import type { YTPlayer } from "@/lib/youtube";

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: number;
  duration: number;
  initialSeconds: number;
  onProgress: (seconds: number) => void;
  onComplete: (finalSeconds: number) => void;
}

// ── YouTube player (dùng control mặc định của YouTube) ────────────────────────
// Dùng controls native của YouTube thay vì tự vẽ overlay — tránh nền/nút play
// riêng của YouTube chồng lên UI tuỳ chỉnh. Chỉ cần theo dõi tiến trình xem
// (progress) và bắt sự kiện kết thúc video qua IFrame API.

function YouTubePlayer({
  videoUrl,
  lessonId,
  duration,
  initialSeconds,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const ytWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [videoError, setVideoError] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSavedRef = useRef(initialSeconds);
  const completedRef = useRef(false);
  // Player chỉ thực sự có getCurrentTime()/getDuration() sau onReady — cần ref
  // riêng vì state sẽ bị stale trong closure của cleanup.
  const readyRef = useRef(false);

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  }, [onProgress, onComplete]);

  // Chỉ dùng giá trị initialSeconds tại lần mount đầu tiên — prop này thay đổi
  // mỗi khi progress được lưu (query invalidation), nhưng không được phép
  // tạo lại player vì sẽ gây chồng iframe + lặp âm thanh.
  const initialSecondsRef = useRef(initialSeconds);

  const videoId = extractYouTubeId(videoUrl);

  useEffect(() => {
    if (!videoId || !ytWrapperRef.current) return;
    let cancelled = false;

    // Tạo container thủ công để tránh React reconcile xung đột với iframe YouTube inject vào
    const container = document.createElement("div");
    container.style.cssText = "width:100%;height:100%;";
    ytWrapperRef.current.appendChild(container);

    loadYouTubeAPI().then(() => {
      if (cancelled) {
        container.remove();
        return;
      }
      playerRef.current = new window.YT.Player(container, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 1,
          cc_lang_pref: "vi",
          start: Math.floor(initialSecondsRef.current),
          playsinline: 1,
          // Dừng video tại thời điểm duration — cho phép dùng video dài nhưng
          // chỉ yêu cầu học viên xem đến phần duration của bài học.
          ...(duration > 0 && { end: Math.floor(duration) }),
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            e.target.loadModule("captions");
            readyRef.current = true;
          },
          onApiChange: (e) => {
            if (cancelled) return;
            // Tracklist phụ đề chỉ sẵn sàng sau khi module "captions" báo
            // available qua onApiChange — ép về tiếng Việt (auto-translate
            // nếu video không có sẵn track "vi").
            const options = e.target.getOptions("captions");
            if (!options.includes("track")) return;
            const tracklist = e.target.getOption("captions", "tracklist") as
              { languageCode: string }[] | undefined;
            const viTrack = tracklist?.find((t) => t.languageCode === "vi");
            e.target.setOption(
              "captions",
              "track",
              viTrack ?? { languageCode: "vi" },
            );
          },
          onStateChange: (e) => {
            if (cancelled) return;
            if (e.data === 0 && !completedRef.current) {
              // ENDED
              completedRef.current = true;
              const finalDur = playerRef.current?.getDuration() ?? duration;
              onCompleteRef.current(Math.round(finalDur));
            }
          },
          onError: () => {
            if (!cancelled) setVideoError(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      if (playerRef.current && readyRef.current && !completedRef.current) {
        const ct = playerRef.current.getCurrentTime();
        if (ct > 0) onProgressRef.current(Math.floor(ct));
      }
      playerRef.current?.destroy();
      playerRef.current = null;
      container.remove();
    };
    // onProgress/onComplete đọc qua refs; initialSeconds đọc qua ref (chỉ dùng giá trị mount đầu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, lessonId]);

  // Auto-save mỗi 10 giây, chỉ khi delta >= 5s — dùng dep [] vì cleanup phụ
  // thuộc vào parent truyền key={lesson.id} để force-remount khi đổi bài.
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      if (!playerRef.current || !readyRef.current || completedRef.current)
        return;
      const ct = playerRef.current.getCurrentTime();
      if (Math.abs(ct - lastSavedRef.current) >= 5) {
        lastSavedRef.current = ct;
        onProgressRef.current(Math.floor(ct));
      }
    }, 10000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, []);

  if (videoError) {
    return (
      <div className="w-full aspect-video bg-s1 rounded-xl border border-b1 flex flex-col items-center justify-center gap-3 text-t3">
        <VideoOff size={32} />
        <p className="text-sm">Không thể tải video. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="yt-player-wrapper relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-b1">
      {/* YouTube player container — React không quản lý nội dung bên trong */}
      <div ref={ytWrapperRef} className="yt-wrapper absolute inset-0" />
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function VideoPlayer(props: VideoPlayerProps) {
  return <YouTubePlayer {...props} />;
}
