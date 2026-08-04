import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().optional(),
  negotiable: z.boolean().optional(),
  type: z.enum([
    "PRODUCT",
    "SERVICE",
    "PROPERTY",
    "VEHICLE",
    "JOB",
    "COURSE",
    "EVENT",
    "ANNOUNCEMENT",
  ]).optional(),
  location: z.string().min(2),
  categoryId: z.string().uuid().optional(),
});


export type CreateListingInput =
  z.infer<typeof createListingSchema>;