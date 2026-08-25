import { z } from "zod";
export const createSellerPlanSchema = z.object({
    name: z.string().min(2),
    price: z.number().nonnegative(),
    duration: z.number().positive(),
    maxListings: z.number().positive(),
    imageLimit: z.number().positive(),
    featuredListing: z.boolean().optional(),
    prioritySearch: z.boolean().optional(),
    verifiedBadge: z.boolean().optional()
});
