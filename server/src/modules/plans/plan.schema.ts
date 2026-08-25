import { z } from "zod";


// =================================
// CREATE SELLER PLAN
// =================================

export const createSellerPlanSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2, "Plan name must contain at least 2 characters"),

    price: z
        .number()
        .nonnegative("Plan price cannot be negative"),

    duration: z
        .number()
        .int()
        .positive("Plan duration must be greater than zero"),

    maxListings: z
        .number()
        .int()
        .positive("Maximum listings must be greater than zero"),

    imageLimit: z
        .number()
        .int()
        .positive("Image limit must be greater than zero"),

    featuredListing: z
        .boolean()
        .optional(),

    prioritySearch: z
        .boolean()
        .optional(),

    verifiedBadge: z
        .boolean()
        .optional(),

    isActive: z
        .boolean()
        .optional()

});


// =================================
// UPDATE SELLER PLAN
// =================================

export const updateSellerPlanSchema =
    createSellerPlanSchema.partial();


// =================================
// TYPES
// =================================

export type CreateSellerPlanInput =
    z.infer<typeof createSellerPlanSchema>;


export type UpdateSellerPlanInput =
    z.infer<typeof updateSellerPlanSchema>;