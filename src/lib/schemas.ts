import { z } from "zod";

export const SearchResponse = z.object({
  results: z.array(z.string()),
});

export type SearchResponse = z.infer<typeof SearchResponse>;
