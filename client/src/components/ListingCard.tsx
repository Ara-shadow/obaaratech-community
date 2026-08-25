import {
    useNavigate
} from "react-router-dom";

import {
    Heart,
    MapPin,
    Tag
} from "lucide-react";

import type {
    Listing
} from "../types/listing";

import {
    getCurrencySymbol
} from "../services/currency";


interface Props {

    listing: Listing;

}


export default function ListingCard({

    listing

}: Props) {


    const navigate =
        useNavigate();


    const hasImage =
        Boolean(
            listing.images &&
            listing.images.length > 0 &&
            listing.images[0]?.url
        );


    function handleOpenListing() {

        navigate(
            `/product/${listing.id}`
        );

    }


    function handleKeyDown(
        event: React.KeyboardEvent<HTMLElement>
    ) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            handleOpenListing();

        }

    }


    return (

        <article

            className="product-card"

            onClick={handleOpenListing}

            onKeyDown={handleKeyDown}

            tabIndex={0}

            role="button"

            aria-label={`View ${listing.title}`}

        >


            {/* =====================================================
                PRODUCT IMAGE
            ===================================================== */}

            <div className="product-image-container">


                {hasImage ? (

                    <img

                        className="product-image"

                        src={
                            listing.images![0].url
                        }

                        alt={listing.title}

                        loading="lazy"

                    />

                ) : (

                    <div className="no-image">

                        <Tag
                            size={34}
                        />

                        <span>
                            No image available
                        </span>

                    </div>

                )}


                {/* IMAGE GRADIENT */}

                <div
                    className="product-image-overlay"
                    aria-hidden="true"
                />


                {/* WISHLIST */}

                <button

                    type="button"

                    className="product-wishlist"

                    aria-label={`Add ${listing.title} to favourites`}

                    onClick={(event) => {

                        event.stopPropagation();

                    }}

                >

                    <Heart
                        size={18}
                        strokeWidth={2}
                    />

                </button>


                {/* CONDITION */}

                {listing.condition && (

                    <span className="product-condition-badge">

                        {listing.condition}

                    </span>

                )}


            </div>


            {/* =====================================================
                PRODUCT INFORMATION
            ===================================================== */}

            <div className="product-info">


                <div className="product-category-row">

                    {listing.category?.name && (

                        <span className="product-category">

                            {listing.category.name}

                        </span>

                    )}

                </div>


                <h3 className="product-title">

                    {listing.title}

                </h3>


                {/* PRICE */}

                <div className="product-price-row">

                    <p className="product-price">

                        {listing.price !== null &&
                        listing.price !== undefined ? (

                            <>

                                <span className="product-currency">

                                    {getCurrencySymbol(
                                        listing.currency
                                    )}

                                </span>

                                {listing.price.toLocaleString()}

                            </>

                        ) : (

                            "Contact Seller"

                        )}

                    </p>

                </div>


                {/* LOCATION */}

                {listing.location && (

                    <div className="product-location">

                        <MapPin
                            size={15}
                        />

                        <span>
                            {listing.location}
                        </span>

                    </div>

                )}


                {/* FOOTER */}

                <div className="product-card-footer">

                    <span className="product-view-link">

                        View details

                    </span>

                    <span
                        className="product-arrow"
                        aria-hidden="true"
                    >

                        →

                    </span>

                </div>


            </div>


        </article>

    );

}