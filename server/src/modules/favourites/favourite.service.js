import { addFavourite, removeFavourite, getMyFavourites } from "./favourite.repository.js";
// =====================================================
// SAVE FAVOURITE
// =====================================================
export async function saveFavourite(userId, listingId) {
    return addFavourite(userId, listingId);
}
// =====================================================
// REMOVE FAVOURITE
// =====================================================
export async function deleteFavourite(userId, listingId) {
    return removeFavourite(userId, listingId);
}
// =====================================================
// GET USER FAVOURITES
// =====================================================
export async function fetchUserFavourites(userId) {
    return getMyFavourites(userId);
}
