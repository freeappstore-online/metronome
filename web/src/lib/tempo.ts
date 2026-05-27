/** Italian tempo marking ranges */
export interface TempoMarking {
  name: string;
  minBpm: number;
  maxBpm: number;
}

const TEMPO_MARKINGS: TempoMarking[] = [
  { name: "Grave", minBpm: 20, maxBpm: 39 },
  { name: "Largo", minBpm: 40, maxBpm: 60 },
  { name: "Adagio", minBpm: 61, maxBpm: 76 },
  { name: "Andante", minBpm: 77, maxBpm: 108 },
  { name: "Moderato", minBpm: 109, maxBpm: 120 },
  { name: "Allegro", minBpm: 121, maxBpm: 156 },
  { name: "Vivace", minBpm: 157, maxBpm: 176 },
  { name: "Presto", minBpm: 177, maxBpm: 200 },
  { name: "Prestissimo", minBpm: 201, maxBpm: 300 },
];

export function getTempoMarking(bpm: number): string {
  for (const marking of TEMPO_MARKINGS) {
    if (bpm >= marking.minBpm && bpm <= marking.maxBpm) {
      return marking.name;
    }
  }
  return "";
}

/** Time signature definition */
export interface TimeSignature {
  beats: number;
  noteValue: number;
  label: string;
}

export const TIME_SIGNATURES: TimeSignature[] = [
  { beats: 2, noteValue: 4, label: "2/4" },
  { beats: 3, noteValue: 4, label: "3/4" },
  { beats: 4, noteValue: 4, label: "4/4" },
  { beats: 5, noteValue: 4, label: "5/4" },
  { beats: 6, noteValue: 8, label: "6/8" },
  { beats: 7, noteValue: 8, label: "7/8" },
];

/** Subdivision types */
export type Subdivision = "none" | "eighth" | "triplet" | "sixteenth";

export function getSubdivisionCount(subdivision: Subdivision): number {
  switch (subdivision) {
    case "none":
      return 1;
    case "eighth":
      return 2;
    case "triplet":
      return 3;
    case "sixteenth":
      return 4;
  }
}

/** Preset BPM values */
export const PRESET_TEMPOS = [60, 72, 80, 100, 120, 140, 160] as const;

/** BPM constraints */
export const MIN_BPM = 20;
export const MAX_BPM = 300;

export function clampBpm(bpm: number): number {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));
}
