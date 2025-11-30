import type { UUID } from "./common";

export interface Artist {
  id: UUID;
  name: string;
  countryOfOrigin?: string | null;
  primaryGenre?: string | null;
  description?: string | null;
}

export type NewArtist = Omit<Artist, "id">;
export type UpdateArtist = Partial<NewArtist> & { id?: UUID };
