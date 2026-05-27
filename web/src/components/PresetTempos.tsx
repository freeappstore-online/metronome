import { PRESET_TEMPOS } from "../lib/tempo";

interface PresetTemposProps {
  currentBpm: number;
  onSelect: (bpm: number) => void;
}

export function PresetTempos({ currentBpm, onSelect }: PresetTemposProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        Presets
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {PRESET_TEMPOS.map((tempo) => {
          const isActive = currentBpm === tempo;
          return (
            <button
              key={tempo}
              onClick={() => onSelect(tempo)}
              className="flex h-9 w-14 items-center justify-center rounded-lg text-sm font-semibold transition-all active:scale-95"
              style={{
                background: isActive ? "var(--accent)" : "var(--panel)",
                color: isActive ? "#ffffff" : "var(--ink)",
                border: isActive ? "none" : "1px solid var(--line)",
              }}
              aria-label={`Set tempo to ${tempo} BPM`}
            >
              {tempo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
