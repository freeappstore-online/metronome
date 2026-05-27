import { getTempoMarking } from "../lib/tempo";

interface BpmDisplayProps {
  bpm: number;
  isPlaying: boolean;
  isAccentBeat: boolean;
  onBpmChange: (bpm: number) => void;
}

export function BpmDisplay({ bpm, isPlaying, isAccentBeat, onBpmChange }: BpmDisplayProps) {
  const tempoMarking = getTempoMarking(bpm);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          bpm-display text-8xl font-bold tracking-tight transition-transform duration-100
          ${isPlaying && isAccentBeat ? "scale-105" : "scale-100"}
        `}
        style={{ color: "var(--ink)" }}
      >
        <input
          type="number"
          value={bpm}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              onBpmChange(val);
            }
          }}
          min={20}
          max={300}
          className="bpm-display w-48 bg-transparent text-center text-8xl font-bold outline-none"
          style={{ color: "var(--ink)" }}
          aria-label="BPM"
        />
      </div>
      <span className="text-lg font-medium" style={{ color: "var(--muted)" }}>
        BPM
      </span>
      {tempoMarking && (
        <span
          className="text-sm font-medium italic tracking-wide"
          style={{ color: "var(--accent)" }}
        >
          {tempoMarking}
        </span>
      )}
    </div>
  );
}
