import { z } from "zod";

export const Product = z.object({
  filename: z.string(),
  price: z.int(),
  name: z.string(),
  variant_name: z.string().nullable(),
  year: z.int().nullable(),
  brand_name: z.string().nullable(),
  season: z.string().nullable(),
  base_color: z.string().nullable(),
  age_group: z.string().nullable(),
  categories: z.string().nullable(),
});

export const Song = z.object({
  track_id: z.string(),
  track_name: z.string(),
  track_artist: z.string(),
  lyrics: z.string(),
  track_popularity: z.int(),
  track_album_name: z.string(),
  playlist_name: z.string(),
  playlist_genre: z.string(),
  playlist_subgenre: z.string(),
});

export const SearchResponse = z.object({
  results: z.array(z.string()),
  time_ms: z.number(),
});

export const ImageSearchResponse = z.object({
  results: z.array(Product),
  time_ms: z.number(),
});

export const AudioSearchResponse = z.object({
  results: z.array(Song),
  time_ms: z.number(),
});

export type Product = z.infer<typeof Product>;
export type Song = z.infer<typeof Song>;
export type SearchResponse = z.infer<typeof SearchResponse>;
export type ImageSearchResponse = z.infer<typeof ImageSearchResponse>;
export type AudioSearchResponse = z.infer<typeof AudioSearchResponse>;
