import api from "./axios";

import type {
    Listing
} from "../types/listing";


// =====================================================
// GET ALL LISTINGS
// =====================================================

export async function getListings(): Promise<Listing[]> {

    const response =
        await api.get("/marketplace/listings");

    return response.data.listings as Listing[];

}


// =====================================================
// GET SINGLE LISTING
// =====================================================

export async function getListingById(
    id: string
): Promise<Listing> {

    const response =
        await api.get(`/listings/${id}`);

    return response.data.listing as Listing;

}

// =====================================================
// GET RELATED LISTINGS
// =====================================================

export async function getRelatedListings(
    id: string
): Promise<Listing[]> {

    const response =
        await api.get(
            `/listings/${id}/related`
        );


    return response.data.listings as Listing[];

}

// =====================================================
// GET MY LISTINGS
// =====================================================

export async function getMyListings(): Promise<Listing[]> {

    const response =
        await api.get(
            "/listings/my"
        );


    return response.data.listings as Listing[];

}

// =====================================================
// CREATE LISTING
// =====================================================

export interface CreateListingData {

    title: string;

    description: string;

    price?: number;

      currency?: "NGN" | "USD" | "GBP" | "EUR";
      
    negotiable?: boolean;


    condition?:
        | "NEW"
        | "USED"
        | "UK_USED"
        | "NIGERIA_USED"
        | "BRAND_NEW"
        | "FOREIGN_USED"
        | "NEW_BUILD"
        | "OLD_BUILDING"
        | "RENOVATED";


    type:
        | "PRODUCT"
        | "SERVICE"
        | "PROPERTY"
        | "VEHICLE"
        | "JOB"
        | "COURSE"
        | "EVENT"
        | "ANNOUNCEMENT";


      location: string;

    categoryId?: string;

    details?: Record<string, any>;

}

// =====================================================
// CREATE LISTING RESPONSE
// =====================================================

export async function createListing(
    data: CreateListingData
): Promise<Listing> {

    const response =
        await api.post(
            "/listings",
            data
        );

    return response.data.listing as Listing;

}


// =====================================================
// UPLOAD LISTING IMAGE
// =====================================================

export async function uploadListingImage(

    listingId: string,

    file: File,

    onUploadProgress?: (
        progress: number
    ) => void

) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const response =
        await api.post(

            `/uploads/listing/${listingId}`,

            formData,

            {

                headers: {

                    // Let the browser/Axios
                    // generate the multipart
                    // boundary automatically.

                    "Content-Type":
                        undefined

                },

                onUploadProgress: (
                    progressEvent
                ) => {

                    if (
                        !onUploadProgress ||
                        !progressEvent.total
                    ) {

                        return;

                    }


                    const percentage =
                        Math.round(

                            (
                                progressEvent.loaded /
                                progressEvent.total

                            ) * 100

                        );


                    onUploadProgress(
                        percentage
                    );

                }

            }

        );


    return response.data;

}