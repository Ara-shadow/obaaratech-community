import {
  addFavourite,
  removeFavourite,
  getMyFavourites
} from "./favourite.repository.js";


// =====================================================
// SAVE FAVOURITE
// =====================================================

export async function saveFavourite(
  userId: string,
  listingId: string
) {

  return addFavourite(
    userId,
    listingId
  );

}


// =====================================================
// REMOVE FAVOURITE
// =====================================================

export async function deleteFavourite(
  userId: string,
  listingId: string
) {

  return removeFavourite(
    userId,
    listingId
  );

}


// =====================================================
// GET USER FAVOURITES
// =====================================================

export async function fetchUserFavourites(
  userId: string
) {

  return getMyFavourites(
    userId
  );

}