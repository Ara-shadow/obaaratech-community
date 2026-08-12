import api from "./axios";

import type {
    Listing
} from "../types/listing";


// =====================================================
// GET MY SELLER LISTINGS
// =====================================================

export async function getMySellerListings(): Promise<Listing[]> {

    const response =
        await api.get(
            "/sellers/listings"
        );


    return (
        response.data.listings ||
        []
    ) as Listing[];

}


// =====================================================
// UPDATE SELLER LISTING
// =====================================================

export async function updateSellerListing(

    id: string,

    data: Partial<{

        title: string;

        description: string;

        price: number | null;

        location: string;

        condition: string;

        type: string;

        negotiable: boolean;

        available: boolean;

        categoryId: string | null;

    }>

): Promise<Listing> {

    const response =
        await api.patch(

            `/sellers/listings/${id}`,

            data

        );


    return response.data.listing as Listing;

}


// =====================================================
// DELETE SELLER LISTING
// =====================================================

export async function deleteSellerListing(

    id: string

): Promise<void> {

    await api.delete(

        `/sellers/listings/${id}`

    );

}


// =====================================================
// MARK LISTING AS SOLD
// =====================================================

export async function markListingSold(

    id: string

): Promise<Listing> {

    const response =
        await api.patch(

            `/sellers/listings/${id}/sold`

        );


    return response.data.listing as Listing;

}