import { useEffect, useRef } from "react";

interface BeatIndicatorProps {
  beatsPerMeasure: number;
  currentBeat: number;
  isPlaying: boolean;
  isAccentBeat: boolean;
}

export function BeatIndicator({
  beatsPerMeasure,
  currentBeat,
  isPlaying,
  isAccentBeat,
}: BeatIndicatorProps) {
  const pulseRef = useRef<HTMLDivElement>(null);
  const prevBeatRef = useRef(-1);

  // Trigger pulse animation on beat change
  useEffect(() => {
    if (!isPlaying) return;
    if (currentBeat === prevBeatRef.current) return;
    prevBeatRef.current = currentBeat;

    const el = pulseRef.current;
    if (!el) return;

    el.classList.remove("beat-pulse", "accent-pulse");
    // Force reflow
    void el.offsetWidth;
    el.classList.add(isAccentBeat ? "accent-pulse" : "beat-pulse");
  }, [currentBeat, isPlaying, isAccentBeat]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Central pulse circle */}
      <div
        ref={pulseRef}
        className="flex h-24 w-24 items-center justify-center rounded-full transition-colors duration-75"
        style={{
          background: isPlaying
            ? isAccentBeat
              ? "var(--accent)"
              : "var(--line-strong)"
            : "var(--line)",
        }}
      >
        <div
          className="h-16 w-16 rounded-full"
          style={{
            background: isPlaying
              ? isAccentBeat
                ? "rgba(255,255,255,0.3)"
                : "rgba(255,255,255,0.15)"
              : "var(--panel)",
          }}
        />
      </div>

      {/* Beat dots */}
      <div className="flex items-center gap-3">
        {Array.from({ length: beatsPerMeasure }, (_, i) => {
          const isActive = isPlaying && i === currentBeat;
          const isFirst = i === 0;
          return (
            <div
              key={i}
              className={`rounded-full transition-all duration-75 ${
                isFirst ? "h-4 w-4" : "h-3 w-3"
              }`}
              style={{
                background: isActive
                  ? isFirst
                    ? "var(--accent)"
                    : "var(--ink)"
                  : "var(--line-strong)",
                transform: isActive ? "scale(1.3)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
