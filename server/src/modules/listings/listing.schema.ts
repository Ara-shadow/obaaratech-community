import { z } from "zod";

// ==============================
// CREATE LISTING SCHEMA
// ==============================

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
  location: z.string().min(2),
  categoryId: z.string().uuid().optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

// ==============================
// UPDATE LISTING SCHEMA
// ==============================

export const updateListingSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
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
  ]).optional(),
  location: z.string().min(2).optional(),
  categoryId: z.string().uuid().optional(),
  available: z.boolean().optional(),
});

export type UpdateListingInput = z.infer<typeof updateListingSchema>;

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

export type SearchListingInput = z.infer<typeof searchListingSchema>;

// ==============================
// LISTING ID SCHEMA
// ==============================

export const listingIdSchema = z.object({
  id: z.string().uuid(),
});

export type ListingIdInput = z.infer<typeof listingIdSchema>;