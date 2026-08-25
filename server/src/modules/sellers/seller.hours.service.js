import { getSellerBusinessHours, saveSellerBusinessHours } from "./seller.hours.repository.js";
import { sellerBusinessHoursSchema } from "./seller.hours.schema.js";
// =====================================================
// DEFAULT HOURS
// =====================================================
export function getDefaultSellerBusinessHours() {
    return [
        {
            dayOfWeek: 0,
            isOpen: false,
            openingTime: null,
            closingTime: null
        },
        {
            dayOfWeek: 1,
            isOpen: true,
            openingTime: "08:00",
            closingTime: "18:00"
        },
        {
            dayOfWeek: 2,
            isOpen: true,
            openingTime: "08:00",
            closingTime: "18:00"
        },
        {
            dayOfWeek: 3,
            isOpen: true,
            openingTime: "08:00",
            closingTime: "18:00"
        },
        {
            dayOfWeek: 4,
            isOpen: true,
            openingTime: "08:00",
            closingTime: "18:00"
        },
        {
            dayOfWeek: 5,
            isOpen: true,
            openingTime: "08:00",
            closingTime: "18:00"
        },
        {
            dayOfWeek: 6,
            isOpen: true,
            openingTime: "09:00",
            closingTime: "16:00"
        }
    ];
}
// =====================================================
// FETCH HOURS
// =====================================================
export async function fetchSellerBusinessHours(userId) {
    const hours = await getSellerBusinessHours(userId);
    if (hours.length === 7) {
        return hours;
    }
    return getDefaultSellerBusinessHours();
}
// =====================================================
// UPDATE HOURS
// =====================================================
export async function updateSellerBusinessHours(userId, input) {
    const validated = sellerBusinessHoursSchema.parse(input);
    return saveSellerBusinessHours(userId, validated.hours);
}
