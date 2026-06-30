import { z } from "zod";

export const SearchResponse = z.object({
  results: z.array(z.string()),
  time_ms: z.number(),
});

export type SearchResponse = z.infer<typeof SearchResponse>;
