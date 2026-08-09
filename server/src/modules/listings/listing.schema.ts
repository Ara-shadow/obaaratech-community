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
  "ANNOUNCEMENT"
]).default("PRODUCT"),
negotiable: z.boolean().optional()
  ]).optional(),
  location: z.string().min(2),
  categoryId: z.string().uuid().optional(),
});


export type CreateListingInput =
  z.infer<typeof createListingSchema>;

  import { z } from "zod";


// ==============================
// SEARCH LISTING QUERY
// ==============================

export const searchListingSchema = z.object({

  q: z.string().optional(),

  categoryId: z.string().optional(),

  location: z.string().optional(),

  minPrice: z.coerce.number().optional(),

  maxPrice: z.coerce.number().optional(),


  sort: z
    .enum([
      "newest",
      "oldest",
      "low_price",
      "high_price"
    ])
    .optional(),


  page: z.coerce.number()
    .min(1)
    .default(1),


  limit: z.coerce.number()
    .min(1)
    .max(50)
    .default(10)

});


export type SearchListingInput =
  z.infer<typeof searchListingSchema>;