import { z } from "zod";

export const addListingImageSchema = z.object({
  url: z
    .string()
    .url("Image URL must be a valid URL")
});
