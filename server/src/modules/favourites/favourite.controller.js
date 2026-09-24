import { saveFavourite, deleteFavourite, fetchUserFavourites, } from "./favourite.service.js";
export async function addFavouriteController(request, reply) {
    const user = request.user;
    const { listingId } = request.params;
    const favourite = await saveFavourite(user.id, listingId);
    return reply.code(201).send({
        success: true,
        message: "Listing saved",
        favourite,
    });
}
export async function removeFavouriteController(request, reply) {
    const user = request.user;
    const { listingId } = request.params;
    await deleteFavourite(user.id, listingId);
    return reply.send({
        success: true,
        message: "Listing removed from favourites",
    });
}
export async function getFavouritesController(request, reply) {
    const user = request.user;
    const favourites = await fetchUserFavourites(user.id);
    return reply.send({
        success: true,
        favourites,
    });
}
