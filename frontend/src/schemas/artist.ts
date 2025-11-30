import { z } from "zod";

export const artistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  countryOfOrigin: z.string(),
  primaryGenre: z.string(),
  description: z.string(),
});

export type ArtistFormData = z.infer<typeof artistSchema>;
