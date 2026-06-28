import { z } from "zod";

export const ImageQueryResponse = z.object({
  results: z.array(z.string()),
});

export type ImageQueryResponse = z.infer<typeof ImageQueryResponse>;
