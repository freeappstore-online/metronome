import { useState } from "react";
import type { PracticeMode as PracticeModeType } from "../lib/use-metronome";

interface PracticeModeProps {
  isActive: boolean;
  progress: number;
  currentBpm: number;
  onStart: (mode: PracticeModeType) => void;
  onStop: () => void;
}

export function PracticeMode({ isActive, progress, currentBpm, onStart, onStop }: PracticeModeProps) {
  const [startBpm, setStartBpm] = useState(80);
  const [endBpm, setEndBpm] = useState(140);
  const [durationMin, setDurationMin] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStart = () => {
    onStart({
      startBpm,
      endBpm,
      durationSec: durationMin * 60,
    });
  };

  if (isActive) {
    return (
      <div
        className="flex w-full max-w-sm flex-col gap-3 rounded-2xl p-4"
        style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            Practice Mode
          </span>
          <button
            onClick={onStop}
            className="text-xs font-semibold"
            style={{ color: "var(--error)" }}
          >
            Stop
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
          <span>Current: {currentBpm} BPM</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              background: "var(--accent)",
              width: `${progress * 100}%`,
            }}
          />
        </div>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {Math.round(progress * 100)}% complete
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-semibold transition-colors"
        style={{ color: "var(--muted)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M5 3l4 4-4 4" />
        </svg>
        Practice Mode
      </button>

      {isExpanded && (
        <div
          className="flex w-full flex-col gap-3 rounded-2xl p-4"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <div className="flex items-center justify-between gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Start BPM
              </span>
              <input
                type="number"
                value={startBpm}
                onChange={(e) => setStartBpm(parseInt(e.target.value, 10) || 80)}
                min={20}
                max={300}
                className="h-9 w-20 rounded-lg bg-transparent px-2 text-center text-sm font-semibold outline-none"
                style={{ color: "var(--ink)", border: "1px solid var(--line)" }}
              />
            </label>
            <span style={{ color: "var(--muted)" }}>→</span>
            <label className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                End BPM
              </span>
              <input
                type="number"
                value={endBpm}
                onChange={(e) => setEndBpm(parseInt(e.target.value, 10) || 140)}
                min={20}
                max={300}
                className="h-9 w-20 rounded-lg bg-transparent px-2 text-center text-sm font-semibold outline-none"
                style={{ color: "var(--ink)", border: "1px solid var(--line)" }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Minutes
              </span>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value, 10) || 2)}
                min={1}
                max={30}
                className="h-9 w-16 rounded-lg bg-transparent px-2 text-center text-sm font-semibold outline-none"
                style={{ color: "var(--ink)", border: "1px solid var(--line)" }}
              />
            </label>
          </div>
          <button
            onClick={handleStart}
            className="h-10 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            Start Practice
          </button>
        </div>
      )}
    </div>
  );
}
