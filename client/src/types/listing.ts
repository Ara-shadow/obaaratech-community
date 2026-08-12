export interface ListingImage {
    id: string;
    url: string;
}


export interface ListingCategory {
    id: string;
    name: string;
    slug?: string | null;
    icon?: string | null;
    parentId?: string | null;
    createdAt?: string;
    description?: string | null;
    details?: Record<string, any> | null;
    image?: string | null;
    isActive?: boolean;
    sortOrder?: number;
}


export interface ListingOwner {
    id?: string;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    avatar?: string | null;
    verifiedSeller?: boolean;
}


export interface ListingReview {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt?: string;
    user?: {
        id?: string;
        name?: string | null;
        avatar?: string | null;
    } | null;
}

export interface ListingDetails {
    [key: string]: any;
}

export interface Listing {

    id: string;

    title: string;

    description: string;

    price: number | null;

    location: string | null;

    condition?: string | null;

    type?: string | null;

    negotiable?: boolean;

    available?: boolean;

    status?: string | null;

    featured?: boolean;

      details?: ListingDetails | null;

    ownerId?: string;

    categoryId?: string | null;

    createdAt?: string;

    updatedAt?: string;


    images: ListingImage[];


    category?: ListingCategory | null;


    owner?: ListingOwner | null;


    reviews?: ListingReview[];

  

}