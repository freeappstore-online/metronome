interface VolumeControlProps {
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--muted)" }}
      >
        <path d="M2 7v4h3l4 4V3L5 7H2z" />
        {volume > 0 && <path d="M12 6.5a3 3 0 010 5" />}
        {volume > 0.5 && <path d="M14 4a6 6 0 010 10" />}
      </svg>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-24 accent-[var(--accent)]"
        aria-label="Volume"
      />
    </div>
  );
}
