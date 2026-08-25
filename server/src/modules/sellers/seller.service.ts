import {
    getSellerProfile
} from "./seller.repository.js";

import {
    calculateSellerBusinessStatus
} from "./seller.hours.status.js";


// =====================================
// GET SELLER PROFILE
// =====================================

export async function fetchSellerProfile(
    sellerId: string
) {

    const seller =
        await getSellerProfile(
            sellerId
        );


    const businessStatus =
        calculateSellerBusinessStatus(
            seller.businessHours
        );


    return {

        ...seller,

        businessStatus

    };

}