import { z } from "zod";

// ISO 8601 duration validation (e.g., PT3M20S)
const isoDurationRegex =
  /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

export const trackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artistId: z.string().uuid("Must be a valid UUID"),
  publishedAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Must be a valid date"),
  category: z.string().min(1, "Category is required"),
  album: z.string().min(1, "Album is required"),
  mediaType: z.string().min(1, "Media Type is required"),
  fileName: z.string().min(1, "File Name is required"),
  length: z
    .string()
    .regex(
      isoDurationRegex,
      "Must be a valid ISO-8601 duration (e.g., PT3M20S)"
    ),
});

export type TrackFormData = z.infer<typeof trackSchema>;
