import { addFavourite, removeFavourite, getMyFavourites } from "./favourite.repository.js";
// ============================
// SAVE FAVOURITE
// ============================
export async function saveFavourite(app, userId, listingId) {
    return addFavourite(app, userId, listingId);
}
// ============================
// REMOVE FAVOURITE
// ============================
export async function deleteFavourite(app, userId, listingId) {
    return removeFavourite(app, userId, listingId);
}
// ============================
// GET USER FAVOURITES
// ============================
export async function fetchUserFavourites(app, userId) {
    return getMyFavourites(app, userId);
}
