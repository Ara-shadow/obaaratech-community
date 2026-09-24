import { getSellerProfile } from "./seller.repository.js";
export async function fetchSellerProfile(sellerId) {
    return getSellerProfile(sellerId);
}
