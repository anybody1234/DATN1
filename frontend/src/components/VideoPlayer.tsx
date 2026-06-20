import { useEffect, useRef, useState } from "react";
import {
  VideoOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Captions,
  CaptionsOff,
} from "lucide-react";
import { extractYouTubeId, loadYouTubeAPI } from "@/lib/youtube";
import type { YTPlayer } from "@/lib/youtube";
import { formatDuration } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: number;
  duration: number;
  initialSeconds: number;
  onProgress: (seconds: number) => void;
  onComplete: (finalSeconds: number) => void;
}

// ── YouTube custom player ─────────────────────────────────────────────────────

function YouTubeCustomPlayer({
  videoUrl,
  lessonId,
  duration,
  initialSeconds,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const ytWrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialSeconds);
  const [playerDuration, setPlayerDuration] = useState(duration);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSavedRef = useRef(initialSeconds);
  const completedRef = useRef(false);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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
          controls: 0,
          modestbranding: 1,
          rel: 0,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 1,
          cc_lang_pref: "vi",
          fs: 0,
          start: Math.floor(initialSecondsRef.current),
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            const dur = e.target.getDuration();
            if (dur > 0) setPlayerDuration(dur);
            e.target.loadModule("captions");
            setReady(true);
          },
          onStateChange: (e) => {
            if (cancelled) return;
            setPlaying(e.data === 1); // PLAYING
            if (e.data === 0 && !completedRef.current) {
              // ENDED
              completedRef.current = true;
              const finalDur =
                playerRef.current?.getDuration() ?? playerDuration;
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
      if (tickRef.current) clearInterval(tickRef.current);
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      if (playerRef.current && !completedRef.current) {
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

  // Hai interval dưới đây dùng dep [] vì cleanup hoàn toàn phụ thuộc vào việc
  // parent truyền key={lesson.id} để force-remount khi đổi bài — xóa key đó sẽ gây memory leak.
  useEffect(() => {
    tickRef.current = setInterval(() => {
      const ct = playerRef.current?.getCurrentTime() ?? 0;
      setCurrentTime(ct);
    }, 500);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Theo dõi trạng thái fullscreen — đồng bộ icon và xử lý cả khi user thoát bằng Esc
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Auto-save mỗi 10 giây, chỉ khi delta >= 5s
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      if (!playerRef.current || completedRef.current) return;
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

  const togglePlay = () => {
    if (!playerRef.current) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    playerRef.current?.seekTo(val, true);
    setCurrentTime(val);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement === wrapperRef.current) {
      document.exitFullscreen?.();
    } else {
      wrapperRef.current?.requestFullscreen?.();
    }
  };

  const toggleCaptions = () => {
    const player = playerRef.current;
    if (!player) return;
    if (captionsOn) {
      player.setOption("captions", "track", {});
      setCaptionsOn(false);
      return;
    }
    const tracklist = player.getOption("captions", "tracklist") as
      | { languageCode: string }[]
      | undefined;
    const preferred =
      tracklist?.find((t) => t.languageCode === "vi") ??
      tracklist?.find((t) => t.languageCode === "ja") ??
      tracklist?.[0];
    player.setOption("captions", "track", preferred ?? { languageCode: "ja" });
    setCaptionsOn(true);
  };

  const SEEK_MAX_FALLBACK = 100;
  const seekMax =
    playerDuration > 0 ? Math.floor(playerDuration) : SEEK_MAX_FALLBACK;
  const pct = playerDuration > 0 ? (currentTime / playerDuration) * 100 : 0;

  if (videoError) {
    return (
      <div className="w-full aspect-video bg-s1 rounded-xl border border-b1 flex flex-col items-center justify-center gap-3 text-t3">
        <VideoOff size={32} />
        <p className="text-sm">Không thể tải video. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="yt-player-wrapper relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-b1 group"
    >
      {/* YouTube player container — React không quản lý nội dung bên trong */}
      <div ref={ytWrapperRef} className="yt-wrapper absolute inset-0" />

      {/* Nút play trung tâm khi video đang dừng */}
      {!playing && ready && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Phát video"
        >
          <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center hover:bg-acc/70 transition-colors">
            <Play size={28} className="text-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls overlay — hiện khi hover, pointer-events-none trên container để click-through tới player */}
      <div className="yt-controls-gradient absolute inset-x-0 bottom-0 px-4 pb-3 pt-14 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={seekMax}
          step={1}
          value={Math.floor(currentTime)}
          onChange={handleSeek}
          disabled={!ready}
          className="yt-progress w-full mb-2.5 pointer-events-auto"
          style={{ "--yt-progress-pct": `${pct}%` } as React.CSSProperties}
        />

        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={togglePlay}
            disabled={!ready}
            className="text-white hover:text-acc transition-colors disabled:opacity-40"
            aria-label={playing ? "Dừng" : "Phát"}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <span className="text-white/70 text-xs font-mono tabular-nums">
            {formatDuration(Math.floor(currentTime))} /{" "}
            {formatDuration(Math.floor(playerDuration))}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleCaptions}
              disabled={!ready}
              className="text-white hover:text-acc transition-colors disabled:opacity-40"
              aria-label={captionsOn ? "Tắt phụ đề" : "Bật phụ đề"}
            >
              {captionsOn ? <Captions size={16} /> : <CaptionsOff size={16} />}
            </button>
            <button
              onClick={toggleMute}
              className="text-white hover:text-acc transition-colors"
              aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-acc transition-colors"
              aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function VideoPlayer(props: VideoPlayerProps) {
  return <YouTubeCustomPlayer {...props} />;
}
