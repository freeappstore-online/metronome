/**
 * Tap tempo calculator.
 * Uses the last N taps (4-8) to compute an average BPM.
 * Resets if more than 2 seconds pass between taps.
 */

const MAX_TAPS = 8;
const MIN_TAPS = 2;
const RESET_THRESHOLD_MS = 2000;

export class TapTempo {
  private tapTimes: number[] = [];

  tap(): number | null {
    const now = performance.now();
    const lastTap = this.tapTimes[this.tapTimes.length - 1];

    // Reset if too much time has passed
    if (lastTap !== undefined && now - lastTap > RESET_THRESHOLD_MS) {
      this.tapTimes = [];
    }

    this.tapTimes.push(now);

    // Keep only the last MAX_TAPS entries
    if (this.tapTimes.length > MAX_TAPS) {
      this.tapTimes = this.tapTimes.slice(-MAX_TAPS);
    }

    // Need at least MIN_TAPS to calculate
    if (this.tapTimes.length < MIN_TAPS) {
      return null;
    }

    // Calculate average interval
    let totalInterval = 0;
    for (let i = 1; i < this.tapTimes.length; i++) {
      const prev = this.tapTimes[i - 1];
      const curr = this.tapTimes[i];
      if (prev !== undefined && curr !== undefined) {
        totalInterval += curr - prev;
      }
    }

    const avgInterval = totalInterval / (this.tapTimes.length - 1);
    const bpm = 60000 / avgInterval;

    return Math.round(bpm);
  }

  reset(): void {
    this.tapTimes = [];
  }
}
