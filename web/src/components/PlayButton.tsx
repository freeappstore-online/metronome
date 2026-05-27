interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function PlayButton({ isPlaying, onToggle }: PlayButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex h-16 w-40 items-center justify-center rounded-2xl text-lg font-bold tracking-wide transition-all active:scale-95"
      style={{
        background: isPlaying ? "var(--error)" : "var(--accent)",
        color: "#ffffff",
      }}
      aria-label={isPlaying ? "Stop metronome" : "Start metronome"}
    >
      {isPlaying ? (
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="3" width="4" height="14" rx="1" />
            <rect x="12" y="3" width="4" height="14" rx="1" />
          </svg>
          <span>Stop</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <polygon points="5,3 17,10 5,17" />
          </svg>
          <span>Start</span>
        </div>
      )}
    </button>
  );
}
