interface TapTempoButtonProps {
  onTap: () => void;
}

export function TapTempoButton({ onTap }: TapTempoButtonProps) {
  return (
    <button
      onClick={onTap}
      className="flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition-all active:scale-95"
      style={{
        background: "var(--panel)",
        color: "var(--ink)",
        border: "1px solid var(--line)",
      }}
      aria-label="Tap tempo"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M8 2v4M8 10v4M2 8h4M10 8h4" />
      </svg>
      Tap Tempo
    </button>
  );
}
