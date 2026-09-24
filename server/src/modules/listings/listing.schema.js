import { z } from "zod";
// ============================================================
// LISTING SCHEMAS
// ============================================================
export const createListingSchema = z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(3000),
    price: z.number().positive().optional(),
    currency: z.enum(["NGN", "USD", "GBP", "EUR"]).default("NGN"),
    negotiable: z.boolean().default(true),
    condition: z.string().optional(),
    type: z.enum(["PRODUCT", "SERVICE", "PROPERTY", "VEHICLE", "JOB", "COURSE", "EVENT", "ANNOUNCEMENT"]).default("PRODUCT"),
    location: z.string().min(2),
    categoryId: z.string().uuid().optional(),
    details: z.record(z.any()).optional(),
});
export const updateListingSchema = z.object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(10).max(3000).optional(),
    price: z.number().positive().optional(),
    currency: z.enum(["NGN", "USD", "GBP", "EUR"]).optional(),
    negotiable: z.boolean().optional(),
    condition: z.string().optional(),
    type: z.enum(["PRODUCT", "SERVICE", "PROPERTY", "VEHICLE", "JOB", "COURSE", "EVENT", "ANNOUNCEMENT"]).optional(),
    location: z.string().min(2).optional(),
    categoryId: z.string().uuid().optional(),
    available: z.boolean().optional(),
    details: z.record(z.any()).optional(),
});
export const listingIdSchema = z.object({
    id: z.string().uuid(),
});
