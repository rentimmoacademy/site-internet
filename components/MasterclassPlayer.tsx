"use client";

import { useEffect, useRef, useState } from "react";
import {
  MC_KEY,
  MC_THRESHOLD,
  MC_VIDEO_ID,
  isMasterclassWatched,
  markMasterclassWatched,
} from "@/lib/masterclass";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: Record<string, unknown>
      ) => YTPlayerInstance;
    };
  }
}

interface YTPlayerInstance {
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

export default function MasterclassPlayer({ onUnlock }: { onUnlock?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (isMasterclassWatched()) {
      setUnlocked(true);
      setProgress(1);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const initPlayer = () => {
      if (!window.YT || !containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: MC_VIDEO_ID,
        playerVars: {
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p || typeof p.getCurrentTime !== "function") return;
      try {
        const t = p.getCurrentTime();
        const d = p.getDuration();
        if (!d || d <= 0) return;
        const ratio = t / d;
        setProgress(ratio);
        if (ratio >= MC_THRESHOLD && !isMasterclassWatched()) {
          markMasterclassWatched();
          setUnlocked(true);
          onUnlock?.();
        }
      } catch {
        /* player not ready */
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
    };
  }, [onUnlock]);

  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black aspect-video">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-ink-soft/60 p-4 backdrop-blur">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-widest text-white/60">
            Progression
          </span>
          <span className="font-extrabold text-white">
            {pct}% · {unlocked ? "✓ Appel débloqué" : `Visionne ${Math.round(MC_THRESHOLD * 100)}% pour débloquer`}
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-dark via-brand-green to-brand-light transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Hidden state echo for CSS / debugging */}
      <span data-mc-key={MC_KEY} className="hidden">
        {unlocked ? "1" : "0"}
      </span>
    </div>
  );
}
