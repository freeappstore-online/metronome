import { useEffect } from "react";
import { useMetronome } from "./lib/use-metronome";
import { BpmDisplay } from "./components/BpmDisplay";
import { BpmControls } from "./components/BpmControls";
import { BeatIndicator } from "./components/BeatIndicator";
import { PlayButton } from "./components/PlayButton";
import { TapTempoButton } from "./components/TapTempoButton";
import { TimeSignatureSelector } from "./components/TimeSignatureSelector";
import { SubdivisionSelector } from "./components/SubdivisionSelector";
import { VolumeControl } from "./components/VolumeControl";
import { PresetTempos } from "./components/PresetTempos";
import { PracticeMode } from "./components/PracticeMode";

export default function App() {
  const [state, actions] = useMetronome();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          actions.toggle();
          break;
        case "ArrowUp":
          e.preventDefault();
          actions.adjustBpm(e.shiftKey ? 5 : 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          actions.adjustBpm(e.shiftKey ? -5 : -1);
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1
          className="bpm-display text-2xl font-bold tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          Metronome
        </h1>
      </header>

      {/* Main content */}
      <main className="flex w-full max-w-md flex-1 flex-col items-center gap-8">
        {/* Beat indicator */}
        <BeatIndicator
          beatsPerMeasure={state.timeSignature.beats}
          currentBeat={state.currentBeat}
          isPlaying={state.isPlaying}
          isAccentBeat={state.isAccentBeat}
        />

        {/* BPM display */}
        <BpmDisplay
          bpm={state.bpm}
          isPlaying={state.isPlaying}
          isAccentBeat={state.isAccentBeat}
          onBpmChange={actions.setBpm}
        />

        {/* BPM controls */}
        <BpmControls
          bpm={state.bpm}
          onAdjust={actions.adjustBpm}
          onBpmChange={actions.setBpm}
        />

        {/* Play / Tap */}
        <div className="flex items-center gap-4">
          <PlayButton isPlaying={state.isPlaying} onToggle={actions.toggle} />
          <TapTempoButton onTap={actions.tapTempo} />
        </div>

        {/* Volume */}
        <VolumeControl volume={state.volume} onVolumeChange={actions.setVolume} />

        {/* Time Signature */}
        <TimeSignatureSelector
          selected={state.timeSignature}
          onSelect={actions.setTimeSignature}
        />

        {/* Subdivision */}
        <SubdivisionSelector
          selected={state.subdivision}
          onSelect={actions.setSubdivision}
        />

        {/* Presets */}
        <PresetTempos currentBpm={state.bpm} onSelect={actions.setBpm} />

        {/* Practice Mode */}
        <PracticeMode
          isActive={state.practiceMode !== null}
          progress={state.practiceProgress}
          currentBpm={state.bpm}
          onStart={actions.startPractice}
          onStop={actions.stopPractice}
        />
      </main>

      {/* Footer */}
      <footer className="mt-8 pb-4 text-center">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Space = play/stop &middot; &uarr;&darr; = adjust BPM &middot; Shift+&uarr;&darr; = &plusmn;5
        </p>
      </footer>
    </div>
  );
}
