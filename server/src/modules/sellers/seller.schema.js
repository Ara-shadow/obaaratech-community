import { z } from "zod";
// ==============================
// SELLER PROFILE QUERY
// ==============================
export const sellerIdSchema = z.object({
    sellerId: z.string()
});
