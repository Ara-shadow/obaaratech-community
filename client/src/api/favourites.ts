import api from "./axios";

import type { Listing } from "../types/listing";


// =====================================================
// ADD FAVOURITE
// =====================================================

export async function addFavourite(
    listingId: string
) {

    const response =
        await api.post(
            `/favourites/${listingId}`
        );

    return response.data;

}


// =====================================================
// REMOVE FAVOURITE
// =====================================================

export async function removeFavourite(
    listingId: string
) {

    const response =
        await api.delete(
            `/favourites/${listingId}`
        );

    return response.data;

}


// =====================================================
// GET MY FAVOURITES
// =====================================================

export async function getFavourites(): Promise<Listing[]> {

    const response =
        await api.get(
            "/favourites"
        );


    return response.data.favourites.map(
        (item: any) =>
            item.listing
    ) as Listing[];

}