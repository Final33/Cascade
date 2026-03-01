"use client";

import { formatDay } from "@/lib/format";

interface TimelineScrubberProps {
  currentFrame: number;
  totalFrames: number;
  currentDay: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (frame: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function TimelineScrubber({
  currentFrame,
  totalFrames,
  currentDay,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onSeek,
  onSpeedChange,
}: TimelineScrubberProps) {
  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full px-4 py-2">
      {/* Play/Pause */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <rect x="2" y="1" width="3.5" height="12" rx="1" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
            <polygon points="3,1 13,7 3,13" />
          </svg>
        )}
      </button>

      {/* Day counter */}
      <span className="text-xs font-mono text-slate-300 w-16 text-center">
        {formatDay(currentDay)}
      </span>

      {/* Progress bar */}
      <div className="flex-1 relative h-6 flex items-center group cursor-pointer">
        <input
          type="range"
          min={0}
          max={Math.max(totalFrames - 1, 1)}
          value={currentFrame}
          onChange={(e) => onSeek(parseInt(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer
            group-hover:h-1.5 transition-all
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.4)]
            [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:group-hover:opacity-100
            [&::-webkit-slider-thumb]:transition-opacity"
          style={{
            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${progress}%, #334155 ${progress}%, #334155 100%)`,
          }}
        />
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-1">
        {[0.5, 1, 2, 5].map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
              speed === s
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Frame counter */}
      <span className="text-[10px] font-mono text-slate-500 w-20 text-right">
        {currentFrame}/{totalFrames}
      </span>
    </div>
  );
}
