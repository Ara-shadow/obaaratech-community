import {
    useNavigate
} from "react-router-dom";

import {
    Heart,
    MapPin,
    Tag,
    Star,
    Zap
} from "lucide-react";

import type {
    Listing
} from "../types/listing";

import {
    getCurrencySymbol
} from "../services/currency";


interface Props {
    listing: Listing;
    featured?: boolean;
    flashSale?: boolean;
    size?: "normal" | "large";
}


export default function ListingCard({
    listing,
    featured = false,
    flashSale = false,
    size = "normal"
}: Props) {

    const navigate = useNavigate();

    const hasImage = Boolean(
        listing.images &&
        listing.images.length > 0 &&
        listing.images[0]?.url
    );

    function handleOpenListing() {
        navigate(`/product/${listing.id}`);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpenListing();
        }
    }

    function handleWishlistClick(event: React.MouseEvent) {
        event.stopPropagation();
        console.log("Add to wishlist:", listing.id);
    }

    const sizeClass = size === "large" ? "product-card-large" : "";

    return (

        <article
            className={`product-card ${sizeClass} ${featured ? "product-card-featured" : ""} ${flashSale ? "product-card-flash" : ""}`}
            onClick={handleOpenListing}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`View ${listing.title}`}
        >

            {/* =====================================================
                BADGES
            ===================================================== */}

            {featured && (
                <div className="listing-badge featured-badge">
                    <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
                    <span>Featured</span>
                </div>
            )}

            {flashSale && (
                <div className="listing-badge flash-badge">
                    <Zap size={11} />
                    <span>Flash Sale</span>
                </div>
            )}

            {/* =====================================================
                PRODUCT IMAGE
            ===================================================== */}

            <div className="product-image-container">

                {hasImage ? (

                    <img
                        className="product-image"
                        src={listing.images![0].url}
                        alt={listing.title}
                        loading="lazy"
                    />

                ) : (

                    <div className="no-image">
                        <Tag size={28} />
                        <span>No image</span>
                    </div>

                )}

                <div
                    className="product-image-overlay"
                    aria-hidden="true"
                />

                <button
                    type="button"
                    className="product-wishlist"
                    aria-label={`Add ${listing.title} to favourites`}
                    onClick={handleWishlistClick}
                >
                    <Heart size={16} strokeWidth={2} />
                </button>

                {listing.condition && (
                    <span className="product-condition-badge">
                        {listing.condition}
                    </span>
                )}

            </div>

            {/* =====================================================
                PRODUCT INFO
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

                <div className="product-price-row">
                    <p className="product-price">
                        {listing.price !== null &&
                        listing.price !== undefined ? (

                            <>
                                <span className="product-currency">
                                    {getCurrencySymbol(listing.currency)}
                                </span>
                                {listing.price.toLocaleString()}
                            </>

                        ) : (

                            "Contact Seller"

                        )}
                    </p>

                    {flashSale && listing.price && (
                        <span className="product-discount-badge">
                            -20%
                        </span>
                    )}
                </div>

                {listing.location && (
                    <div className="product-location">
                        <MapPin size={13} />
                        <span>{listing.location}</span>
                    </div>
                )}

                <div className="product-card-footer">
                    <span className="product-view-link">
                        View details
                    </span>
                    <span className="product-arrow" aria-hidden="true">
                        →
                    </span>
                </div>

            </div>

        </article>

    );

}