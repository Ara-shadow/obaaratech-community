import { z } from "zod";
// =====================================================
// TIME VALIDATION
// =====================================================
/**
 * Business hours are stored using 24-hour HH:mm format.
 *
 * Examples:
 * 00:00
 * 06:30
 * 08:00
 * 17:45
 * 20:00
 * 23:59
 */
const timeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in 24-hour HH:mm format");
// =====================================================
// SINGLE DAY
// =====================================================
export const sellerBusinessHourSchema = z.object({
    /**
     * Sunday = 0
     * Monday = 1
     * Tuesday = 2
     * Wednesday = 3
     * Thursday = 4
     * Friday = 5
     * Saturday = 6
     */
    dayOfWeek: z
        .number()
        .int()
        .min(0)
        .max(6),
    /**
     * Allows the seller to completely close
     * the business for this day.
     */
    isOpen: z.boolean(),
    /**
     * 24-hour format: HH:mm
     */
    openingTime: timeSchema
        .nullable()
        .optional(),
    /**
     * 24-hour format: HH:mm
     *
     * Closing time may be earlier than opening time.
     * This means the business operates overnight.
     *
     * Example:
     * 20:00 → 02:00
     */
    closingTime: timeSchema
        .nullable()
        .optional()
})
    .superRefine((data, ctx) => {
    // =================================================
    // CLOSED DAY
    // =================================================
    if (!data.isOpen) {
        return;
    }
    // =================================================
    // OPEN DAY REQUIRES BOTH TIMES
    // =================================================
    if (!data.openingTime) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["openingTime"],
            message: "Opening time is required when the seller is open"
        });
    }
    if (!data.closingTime) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["closingTime"],
            message: "Closing time is required when the seller is open"
        });
    }
    // =================================================
    // NO MORE "CLOSING MUST BE LATER" RULE
    // =================================================
    //
    // A closing time earlier than the opening time is
    // intentionally allowed because it represents an
    // overnight business.
    //
    // Example:
    //
    // 20:00 → 02:00
    //
    // means:
    //
    // 8:00 PM → 2:00 AM
    //
    // =================================================
});
// =====================================================
// FULL WEEK
// =====================================================
export const sellerBusinessHoursSchema = z.object({
    hours: z
        .array(sellerBusinessHourSchema)
        .length(7)
});
