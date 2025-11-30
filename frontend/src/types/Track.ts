import type { UUID } from "./common";

// Raw API response shape (dates/durations as strings)
export interface TrackDTO {
  id: UUID;
  title: string;
  artistId: UUID;
  publishedAt: string; // ISO date string
  category: string;
  album: string;
  mediaType: string;
  fileName: string;
  length: string; // ISO-8601 duration (e.g., "PT3M20S")
}

// View-layer friendly Track with parsed Date and duration in ms
export interface Track {
  id: UUID;
  title: string;
  artistId: UUID;
  publishedAt: Date;
  category: string;
  album: string;
  mediaType: string;
  fileName: string;
  lengthMs: number; // duration in milliseconds
  lengthIso: string; // original ISO-8601 string for display/API
}

// For creating new tracks (use string formats for API)
export type NewTrack = Omit<TrackDTO, "id">;

// For updating tracks
export type UpdateTrack = Partial<NewTrack> & { id?: UUID };
