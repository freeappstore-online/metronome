import { useCallback, useEffect, useRef, useState } from "react";
import { AudioEngine } from "./audio-engine";
import { TapTempo } from "./tap-tempo";
import {
  clampBpm,
  type Subdivision,
  type TimeSignature,
  TIME_SIGNATURES,
} from "./tempo";

export interface PracticeMode {
  startBpm: number;
  endBpm: number;
  durationSec: number;
}

export interface MetronomeState {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  isAccentBeat: boolean;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  volume: number;
  practiceMode: PracticeMode | null;
  practiceProgress: number;
}

export interface MetronomeActions {
  setBpm: (bpm: number) => void;
  adjustBpm: (delta: number) => void;
  toggle: () => void;
  start: () => void;
  stop: () => void;
  tapTempo: () => void;
  setTimeSignature: (ts: TimeSignature) => void;
  setSubdivision: (sub: Subdivision) => void;
  setVolume: (vol: number) => void;
  startPractice: (mode: PracticeMode) => void;
  stopPractice: () => void;
}

export function useMetronome(): [MetronomeState, MetronomeActions] {
  const engineRef = useRef<AudioEngine | null>(null);
  const tapTempoRef = useRef<TapTempo>(new TapTempo());
  const practiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const practiceStartRef = useRef<number>(0);

  const [bpm, setBpmState] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isAccentBeat, setIsAccentBeat] = useState(false);
  const [timeSignature, setTimeSignatureState] = useState<TimeSignature>(
    TIME_SIGNATURES[2]!, // 4/4
  );
  const [subdivision, setSubdivisionState] = useState<Subdivision>("none");
  const [volume, setVolumeState] = useState(0.8);
  const [practiceMode, setPracticeMode] = useState<PracticeMode | null>(null);
  const [practiceProgress, setPracticeProgress] = useState(0);

  // Initialize engine
  useEffect(() => {
    const engine = new AudioEngine();
    engineRef.current = engine;

    engine.onBeat((beat, isAccent, _isSubdivision) => {
      setCurrentBeat(beat);
      setIsAccentBeat(isAccent);
    });

    return () => {
      engine.dispose();
      if (practiceTimerRef.current) {
        clearInterval(practiceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBpm = useCallback((newBpm: number) => {
    const clamped = clampBpm(newBpm);
    setBpmState(clamped);
    if (engineRef.current) {
      engineRef.current.bpm = clamped;
    }
  }, []);

  const adjustBpm = useCallback(
    (delta: number) => {
      setBpm(bpm + delta);
    },
    [bpm, setBpm],
  );

  const start = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.start();
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
      setIsPlaying(false);
      setCurrentBeat(0);
      setIsAccentBeat(false);
    }
    // Also stop practice if running
    if (practiceTimerRef.current) {
      clearInterval(practiceTimerRef.current);
      practiceTimerRef.current = null;
      setPracticeMode(null);
      setPracticeProgress(0);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  const tapTempo = useCallback(() => {
    const result = tapTempoRef.current.tap();
    if (result !== null) {
      setBpm(result);
    }
  }, [setBpm]);

  const setTimeSignature = useCallback(
    (ts: TimeSignature) => {
      setTimeSignatureState(ts);
      if (engineRef.current) {
        engineRef.current.beatsPerMeasure = ts.beats;
      }
      // Reset beat position if playing
      if (isPlaying && engineRef.current) {
        engineRef.current.stop();
        engineRef.current.start();
        setCurrentBeat(0);
      }
    },
    [isPlaying],
  );

  const setSubdivision = useCallback((sub: Subdivision) => {
    setSubdivisionState(sub);
    if (engineRef.current) {
      engineRef.current.subdivision = sub;
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (engineRef.current) {
      engineRef.current.volume = vol;
    }
  }, []);

  const startPractice = useCallback(
    (mode: PracticeMode) => {
      const clamped: PracticeMode = {
        startBpm: clampBpm(mode.startBpm),
        endBpm: clampBpm(mode.endBpm),
        durationSec: Math.max(10, mode.durationSec),
      };
      setPracticeMode(clamped);
      setPracticeProgress(0);
      setBpm(clamped.startBpm);
      practiceStartRef.current = Date.now();

      // Start playing if not already
      if (!isPlaying) {
        start();
      }

      // Update BPM every 500ms
      if (practiceTimerRef.current) {
        clearInterval(practiceTimerRef.current);
      }
      practiceTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - practiceStartRef.current) / 1000;
        const progress = Math.min(1, elapsed / clamped.durationSec);
        setPracticeProgress(progress);

        const currentBpm = Math.round(
          clamped.startBpm + (clamped.endBpm - clamped.startBpm) * progress,
        );
        setBpm(currentBpm);

        if (progress >= 1) {
          clearInterval(practiceTimerRef.current!);
          practiceTimerRef.current = null;
          setPracticeMode(null);
        }
      }, 500);
    },
    [isPlaying, start, setBpm],
  );

  const stopPractice = useCallback(() => {
    if (practiceTimerRef.current) {
      clearInterval(practiceTimerRef.current);
      practiceTimerRef.current = null;
    }
    setPracticeMode(null);
    setPracticeProgress(0);
  }, []);

  const state: MetronomeState = {
    bpm,
    isPlaying,
    currentBeat,
    isAccentBeat,
    timeSignature,
    subdivision,
    volume,
    practiceMode,
    practiceProgress,
  };

  const actions: MetronomeActions = {
    setBpm,
    adjustBpm,
    toggle,
    start,
    stop,
    tapTempo,
    setTimeSignature,
    setSubdivision,
    setVolume,
    startPractice,
    stopPractice,
  };

  return [state, actions];
}
