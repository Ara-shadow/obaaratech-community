import { z } from "zod";


// ==============================
// CREATE LISTING
// ==============================

export const createListingSchema = z.object({

  title: z
    .string()
    .min(3),


  description: z
    .string()
    .min(10),


  price: z
    .number()
    .optional(),


  negotiable: z
    .boolean()
    .optional(),


  condition: z
    .enum([
      "NEW",
      "USED",
      "UK_USED",
      "NIGERIA_USED",
      "NEW_BUILD",
      "OLD_BUILDING",
      "RENOVATED",
    ])
    .optional(),


  // Category specific information
  // Example:
  // Cars -> brand, model, year
  // Phones -> storage, ram
  // Properties -> bedrooms, bathrooms

  details: z
    .record(z.any())
    .optional(),


  type: z
    .enum([
      "PRODUCT",
      "SERVICE",
      "PROPERTY",
      "VEHICLE",
      "JOB",
      "COURSE",
      "EVENT",
      "ANNOUNCEMENT",
    ])
    .default("PRODUCT"),


  location: z
    .string()
    .min(2),


  categoryId: z
    .string()
    .uuid()
    .optional(),

});


export type CreateListingInput =
  z.infer<typeof createListingSchema>;



// ==============================
// SEARCH LISTING QUERY
// ==============================

export const searchListingSchema = z.object({

  q: z
    .string()
    .optional(),


  categoryId: z
    .string()
    .optional(),


  location: z
    .string()
    .optional(),


  minPrice: z
    .coerce
    .number()
    .optional(),


  maxPrice: z
    .coerce
    .number()
    .optional(),


  sort: z
    .enum([
      "newest",
      "oldest",
      "low_price",
      "high_price",
    ])
    .optional(),


  page: z
    .coerce
    .number()
    .min(1)
    .default(1),


  limit: z
    .coerce
    .number()
    .min(1)
    .max(50)
    .default(10),

});


export type SearchListingInput =
  z.infer<typeof searchListingSchema>;