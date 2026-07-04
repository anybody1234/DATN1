export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  getOptions(module: string): string[];
  getOption(module: string, option: string): unknown;
  setOption(module: string, option: string, value: unknown): void;
  loadModule(module: string): void;
  destroy(): void;
}

interface YTPlayerOptions {
  videoId?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    rel?: 0 | 1;
    disablekb?: 0 | 1;
    iv_load_policy?: 1 | 3;
    cc_load_policy?: 0 | 1;
    cc_lang_pref?: string;
    fs?: 0 | 1;
    start?: number;
    playsinline?: 0 | 1;
  };
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number; target: YTPlayer }) => void;
    onApiChange?: (e: { target: YTPlayer }) => void;
    onError?: (e: { data: number }) => void;
  };
}

declare global {
  interface Window {
    YT: {
      Player: new (id: string | HTMLElement, opts: YTPlayerOptions) => YTPlayer;
      PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function isYouTube(url: string): boolean {
  return /youtube\.com\/watch|youtu\.be\//.test(url);
}

export function extractYouTubeId(url: string): string | null {
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&/]+)/);
  return m ? m[1] : null;
}

export function toEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

// Singleton — chỉ load YouTube IFrame API một lần duy nhất
let ytApiReady: Promise<void> | null = null;

const YT_API_URL = "https://www.youtube.com/iframe_api";

export function loadYouTubeAPI(): Promise<void> {
  if (ytApiReady) return ytApiReady;
  ytApiReady = new Promise<void>((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    // Script đã trong DOM nhưng chưa load xong (ví dụ hot-reload) —
    // poll thay vì inject thêm script và ghi đè onYouTubeIframeAPIReady
    if (document.querySelector(`script[src="${YT_API_URL}"]`)) {
      let attempts = 0;
      const check = setInterval(() => {
        attempts++;
        if (window.YT?.Player) {
          clearInterval(check);
          resolve();
          return;
        }
        if (attempts > 100) {
          clearInterval(check);
          ytApiReady = null; // cho phép retry
          resolve(); // resolve để không block mãi, YTPlayer sẽ báo error riêng
        }
      }, 100);
      return;
    }
    window.onYouTubeIframeAPIReady = resolve;
    const s = document.createElement("script");
    s.src = YT_API_URL;
    document.head.appendChild(s);
  });
  return ytApiReady;
}

/**
 * Tự động đọc thời lượng từ YouTube URL hoặc MP4 URL trực tiếp.
 * Trả về Promise<number> — caller nên dùng cancel flag để tránh leak khi unmount.
 */
export async function detectDuration(
  url: string,
  signal?: { cancelled: boolean },
): Promise<number> {
  if (!url.trim()) return 0;

  if (isYouTube(url)) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return 0;
    await loadYouTubeAPI();
    return new Promise<number>((resolve) => {
      if (signal?.cancelled) {
        resolve(0);
        return;
      }
      const containerId = `yt-probe-${Date.now()}`;
      const div = document.createElement("div");
      div.id = containerId;
      div.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;";
      document.body.appendChild(div);

      // Fallback timeout — dọn div nếu onReady/onError không bao giờ fire
      const cleanup = setTimeout(() => {
        div.remove();
        resolve(0);
      }, 15000);

      new window.YT.Player(containerId, {
        videoId,
        playerVars: { autoplay: 0 },
        events: {
          onReady: (e) => {
            clearTimeout(cleanup);
            const dur = Math.round(e.target.getDuration());
            e.target.destroy();
            div.remove();
            resolve(signal?.cancelled ? 0 : dur);
          },
          onError: () => {
            clearTimeout(cleanup);
            div.remove();
            resolve(0);
          },
        },
      });
    });
  }

  // MP4 / direct video URL
  return new Promise<number>((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;";
    video.onloadedmetadata = () => {
      const dur = isFinite(video.duration) ? Math.round(video.duration) : 0;
      video.remove();
      resolve(dur);
    };
    video.onerror = () => {
      video.remove();
      resolve(0);
    };
    document.body.appendChild(video);
    video.src = url;
  });
}
