import { TIME_SIGNATURES, type TimeSignature } from "../lib/tempo";

interface TimeSignatureSelectorProps {
  selected: TimeSignature;
  onSelect: (ts: TimeSignature) => void;
}

export function TimeSignatureSelector({ selected, onSelect }: TimeSignatureSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        Time Signature
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {TIME_SIGNATURES.map((ts) => {
          const isActive = ts.label === selected.label;
          return (
            <button
              key={ts.label}
              onClick={() => onSelect(ts)}
              className="flex h-10 w-12 items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-95"
              style={{
                background: isActive ? "var(--accent)" : "var(--panel)",
                color: isActive ? "#ffffff" : "var(--ink)",
                border: isActive ? "none" : "1px solid var(--line)",
              }}
              aria-label={`Time signature ${ts.label}`}
              aria-pressed={isActive}
            >
              {ts.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
