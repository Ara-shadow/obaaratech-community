import api from "./axios";


// =====================================================
// BUSINESS HOUR
// =====================================================

export interface SellerBusinessHour {

    id?: string;

    dayOfWeek: number;

    isOpen: boolean;

    openingTime?: string | null;

    closingTime?: string | null;

    createdAt?: string;

    updatedAt?: string;

}


// =====================================================
// RESPONSE
// =====================================================

interface SellerBusinessHoursResponse {

    success: boolean;

    hours: SellerBusinessHour[];

}


// =====================================================
// GET HOURS
// =====================================================

export async function getSellerBusinessHours():

    Promise<SellerBusinessHour[]> {

    const response =
        await api.get<SellerBusinessHoursResponse>(
            "/sellers/business-hours"
        );


    return response.data.hours;

}


// =====================================================
// UPDATE HOURS
// =====================================================

export async function updateSellerBusinessHours(

    hours: SellerBusinessHour[]

):

    Promise<SellerBusinessHour[]> {

    const response =
        await api.put<SellerBusinessHoursResponse>(

            "/sellers/business-hours",

            {
                hours
            }

        );


    return response.data.hours;

}