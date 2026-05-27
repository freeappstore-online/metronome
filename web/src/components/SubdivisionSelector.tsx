import type { Subdivision } from "../lib/tempo";

interface SubdivisionSelectorProps {
  selected: Subdivision;
  onSelect: (sub: Subdivision) => void;
}

const SUBDIVISIONS: { value: Subdivision; label: string }[] = [
  { value: "none", label: "None" },
  { value: "eighth", label: "8th" },
  { value: "triplet", label: "Triplet" },
  { value: "sixteenth", label: "16th" },
];

export function SubdivisionSelector({ selected, onSelect }: SubdivisionSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        Subdivision
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {SUBDIVISIONS.map(({ value, label }) => {
          const isActive = value === selected;
          return (
            <button
              key={value}
              onClick={() => onSelect(value)}
              className="flex h-10 items-center justify-center rounded-lg px-3 text-sm font-bold transition-all active:scale-95"
              style={{
                background: isActive ? "var(--accent)" : "var(--panel)",
                color: isActive ? "#ffffff" : "var(--ink)",
                border: isActive ? "none" : "1px solid var(--line)",
              }}
              aria-label={`Subdivision: ${label}`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
