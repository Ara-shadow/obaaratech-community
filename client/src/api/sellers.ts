import api from "./axios";

import type {
    SellerBusinessHour
} from "./sellerHours";

export interface SellerBusinessStatus {
    isOpen: boolean;
    status: "OPEN" | "CLOSED";
    message: string;
    openingTime: string | null;
    closingTime: string | null;
    dayOfWeek: number;
    nextOpeningTime: string | null;
}

export interface PublicSellerProfile {
    id: string;
    name: string | null;
    phone: string | null;
    avatar: string | null;
    verifiedSeller: boolean;
    businessHours: SellerBusinessHour[];
    businessStatus: SellerBusinessStatus;
}

export async function getPublicSellerProfile(
    sellerId: string
): Promise<PublicSellerProfile> {
    const response = await api.get<{
        success: boolean;
        seller: PublicSellerProfile;
    }>(`/sellers/${sellerId}`);

    return response.data.seller;
}
