import { getSubdivisionCount, type Subdivision } from "./tempo";

/**
 * Web Audio API metronome engine with precise scheduling.
 *
 * Uses the "lookahead scheduler" pattern:
 * - A setInterval fires frequently (25ms) to check if beats need scheduling
 * - Beats are scheduled using AudioContext.currentTime for sample-accurate timing
 * - This avoids drift from setInterval alone while keeping the scheduler responsive
 */

const SCHEDULE_AHEAD_TIME = 0.1; // How far ahead to schedule audio (sec)
const LOOKAHEAD_INTERVAL = 25; // How frequently to call scheduling function (ms)

const ACCENT_FREQ = 880;
const NORMAL_FREQ = 660;
const SUBDIVISION_FREQ = 440;

const CLICK_DURATION = 0.03; // Duration of the click sound in seconds

export type BeatCallback = (beat: number, isAccent: boolean, isSubdivision: boolean) => void;

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private timerID: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private currentBeat = 0;
  private currentSubBeat = 0;
  private _isPlaying = false;
  private _bpm = 120;
  private _beatsPerMeasure = 4;
  private _subdivision: Subdivision = "none";
  private _volume = 0.8;
  private beatCallback: BeatCallback | null = null;

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = value;
  }

  get beatsPerMeasure(): number {
    return this._beatsPerMeasure;
  }

  set beatsPerMeasure(value: number) {
    this._beatsPerMeasure = value;
  }

  get subdivision(): Subdivision {
    return this._subdivision;
  }

  set subdivision(value: Subdivision) {
    this._subdivision = value;
  }

  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = value;
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(value, this.audioCtx!.currentTime);
    }
  }

  onBeat(callback: BeatCallback): void {
    this.beatCallback = callback;
  }

  private ensureAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this._volume, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private scheduleClick(time: number, freq: number, vol: number): void {
    const ctx = this.audioCtx!;
    const gain = this.gainNode!;

    const osc = ctx.createOscillator();
    const envGain = ctx.createGain();

    osc.frequency.setValueAtTime(freq, time);
    osc.type = "triangle";

    envGain.gain.setValueAtTime(vol, time);
    envGain.gain.exponentialRampToValueAtTime(0.001, time + CLICK_DURATION);

    osc.connect(envGain);
    envGain.connect(gain);

    osc.start(time);
    osc.stop(time + CLICK_DURATION + 0.01);
  }

  private scheduleNote(): void {
    const subCount = getSubdivisionCount(this._subdivision);
    const isMainBeat = this.currentSubBeat === 0;
    const isAccent = isMainBeat && this.currentBeat === 0;
    const isSubdivision = !isMainBeat;

    if (isAccent) {
      this.scheduleClick(this.nextNoteTime, ACCENT_FREQ, 1.0);
    } else if (isMainBeat) {
      this.scheduleClick(this.nextNoteTime, NORMAL_FREQ, 0.8);
    } else {
      this.scheduleClick(this.nextNoteTime, SUBDIVISION_FREQ, 0.4);
    }

    if (this.beatCallback) {
      // Schedule the visual callback slightly before the audio plays
      const msUntilBeat = (this.nextNoteTime - this.audioCtx!.currentTime) * 1000;
      const beat = this.currentBeat;
      setTimeout(() => {
        this.beatCallback!(beat, isAccent, isSubdivision);
      }, Math.max(0, msUntilBeat));
    }

    // Advance to next sub-beat
    const secondsPerBeat = 60.0 / this._bpm;
    const secondsPerSubBeat = secondsPerBeat / subCount;
    this.nextNoteTime += secondsPerSubBeat;

    this.currentSubBeat++;
    if (this.currentSubBeat >= subCount) {
      this.currentSubBeat = 0;
      this.currentBeat = (this.currentBeat + 1) % this._beatsPerMeasure;
    }
  }

  private scheduler(): void {
    if (!this.audioCtx) return;
    while (this.nextNoteTime < this.audioCtx.currentTime + SCHEDULE_AHEAD_TIME) {
      this.scheduleNote();
    }
  }

  start(): void {
    if (this._isPlaying) return;

    const ctx = this.ensureAudioContext();
    this._isPlaying = true;
    this.currentBeat = 0;
    this.currentSubBeat = 0;
    this.nextNoteTime = ctx.currentTime + 0.05; // Small delay to allow first beat scheduling

    this.timerID = setInterval(() => this.scheduler(), LOOKAHEAD_INTERVAL);
  }

  stop(): void {
    if (!this._isPlaying) return;
    this._isPlaying = false;

    if (this.timerID !== null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  toggle(): void {
    if (this._isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  dispose(): void {
    this.stop();
    if (this.audioCtx) {
      void this.audioCtx.close();
      this.audioCtx = null;
      this.gainNode = null;
    }
  }
}
