import { z } from "zod";


// ==============================
// CREATE REVIEW SCHEMA
// ==============================

export const createReviewSchema = z.object({

  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),


  comment: z
    .string()
    .max(500)
    .optional()

});



export type CreateReviewInput =
  z.infer<typeof createReviewSchema>;