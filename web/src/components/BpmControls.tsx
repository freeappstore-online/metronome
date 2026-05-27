import { MIN_BPM, MAX_BPM } from "../lib/tempo";

interface BpmControlsProps {
  bpm: number;
  onAdjust: (delta: number) => void;
  onBpmChange: (bpm: number) => void;
}

export function BpmControls({ bpm, onAdjust, onBpmChange }: BpmControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Step buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onAdjust(-5)}
          className="flex h-12 w-14 items-center justify-center rounded-xl text-lg font-bold transition-colors active:scale-95"
          style={{
            background: "var(--panel)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
          aria-label="Decrease BPM by 5"
        >
          -5
        </button>
        <button
          onClick={() => onAdjust(-1)}
          className="flex h-12 w-14 items-center justify-center rounded-xl text-lg font-bold transition-colors active:scale-95"
          style={{
            background: "var(--panel)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
          aria-label="Decrease BPM by 1"
        >
          -1
        </button>
        <button
          onClick={() => onAdjust(1)}
          className="flex h-12 w-14 items-center justify-center rounded-xl text-lg font-bold transition-colors active:scale-95"
          style={{
            background: "var(--panel)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
          aria-label="Increase BPM by 1"
        >
          +1
        </button>
        <button
          onClick={() => onAdjust(5)}
          className="flex h-12 w-14 items-center justify-center rounded-xl text-lg font-bold transition-colors active:scale-95"
          style={{
            background: "var(--panel)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
          aria-label="Increase BPM by 5"
        >
          +5
        </button>
      </div>

      {/* Slider */}
      <div className="w-full max-w-xs px-4">
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value, 10))}
          className="w-full accent-[var(--accent)]"
          aria-label="BPM slider"
        />
      </div>
    </div>
  );
}
