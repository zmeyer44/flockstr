import { z } from "zod";
import { validateUrl } from "@/lib/utils";
import { createZodFetcher } from "zod-fetch";

const fetchWithZod = createZodFetcher();

const metadataSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  creator: z.string().optional(),
  type: z.string().optional(),
  "theme-color": z.string().optional(),
});
const metadataSchemaResponse = z.object({
  data: metadataSchema,
});

export function fetchMetadata(url: string) {
  if (!validateUrl(url)) return;
  return fetchWithZod(
    // The schema you want to validate with
    metadataSchemaResponse,
    // Any parameters you would usually pass to fetch
    "/api/metadata",
    {
      method: "POST",
      body: JSON.stringify({ url }),
    },
  );
}
