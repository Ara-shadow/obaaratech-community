import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    ImageOff,
    Heart,
    Loader2
} from "lucide-react";

import {
    getListingById,
    getRelatedListings
} from "../api/listings";

import {
    addToCart
} from "../api/cart";

import {
    addFavourite,
    removeFavourite,
    getFavourites
} from "../api/favourites";

import type {
    Listing
} from "../types/listing";

import ListingCard from "../components/ListingCard";

import {
    useAuth
} from "../context/AuthContext";

import {
    getPublicSellerProfile
} from "../api/sellers";

import type {
    PublicSellerProfile
} from "../api/sellers";


export default function ProductDetails() {

    const { id } = useParams();

    const {
        isAuthenticated
    } = useAuth();


    const [
        listing,
        setListing
    ] = useState<Listing | null>(null);


    const [
        relatedListings,
        setRelatedListings
    ] = useState<Listing[]>([]);

    const [
        sellerProfile,
        setSellerProfile
    ] = useState<PublicSellerProfile | null>(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        activeImage,
        setActiveImage
    ] = useState(0);


    const [
        isLightboxOpen,
        setIsLightboxOpen
    ] = useState(false);


    // =====================================================
    // CART STATE
    // =====================================================

    const [
        addingToCart,
        setAddingToCart
    ] = useState(false);


    const [
        cartMessage,
        setCartMessage
    ] = useState("");


    const [
        cartError,
        setCartError
    ] = useState("");


    // =====================================================
    // FAVOURITE STATE
    // =====================================================

    const [
        isFavourite,
        setIsFavourite
    ] = useState(false);


    const [
        favouriteLoading,
        setFavouriteLoading
    ] = useState(false);


    const [
        favouriteMessage,
        setFavouriteMessage
    ] = useState("");


    const [
        favouriteError,
        setFavouriteError
    ] = useState("");


    const [
        favouriteLoaded,
        setFavouriteLoaded
    ] = useState(false);


    // =====================================================
    // LOAD LISTING
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError("Product not found");

            setLoading(false);

            return;

        }


        let mounted = true;


        async function loadListing() {

            try {

                setLoading(true);

                setError("");


               const data =
    await getListingById(id!);


                if (!mounted) {
                    return;
                }


                setListing(data);

                setActiveImage(0);


                // =================================================
                // LOAD RELATED LISTINGS
                // =================================================

                try {

                    const related =
                        await getRelatedListings(
                            data.id
                        );


                    if (mounted) {

                        setRelatedListings(
                            related
                        );

                    }

                } catch (relatedError) {

                    console.error(
                        "Related listings error:",
                        relatedError
                    );


                    if (mounted) {

                        setRelatedListings([]);

                    }

                }

            } catch (requestError) {

                console.error(
                    "Product loading error:",
                    requestError
                );


                if (mounted) {

                    setError(
                        "Unable to load this product."
                    );

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        loadListing();


        return () => {

            mounted = false;

        };

    }, [id]);

    useEffect(() => {
        const sellerId = listing?.owner?.id;

        if (!sellerId) {
            setSellerProfile(null);
            return;
        }

        const publicSellerId = sellerId;

        let mounted = true;

        async function loadSellerProfile() {
            try {
                const data = await getPublicSellerProfile(publicSellerId);

                if (mounted) {
                    setSellerProfile(data);
                }
            } catch (requestError) {
                console.error("Seller profile loading error:", requestError);

                if (mounted) {
                    setSellerProfile(null);
                }
            }
        }

        loadSellerProfile();

        return () => {
            mounted = false;
        };
    }, [listing?.owner?.id]);


    // =====================================================
    // LOAD FAVOURITE STATUS
    // =====================================================

    useEffect(() => {

        if (
            !isAuthenticated ||
            !listing
        ) {

            setIsFavourite(false);

            setFavouriteLoaded(false);

            return;

        }


        let mounted = true;


        async function loadFavouriteStatus() {

            try {

                setFavouriteLoaded(false);


                const favourites =
                    await getFavourites();


                if (!mounted) {
                    return;
                }


              const exists =
    favourites.some(
        favourite =>
            favourite.id === listing?.id
    );


                setIsFavourite(
                    exists
                );

            } catch (requestError) {

                console.error(
                    "Favourite status error:",
                    requestError
                );


                if (mounted) {

                    setIsFavourite(false);

                }

            } finally {

                if (mounted) {

                    setFavouriteLoaded(true);

                }

            }

        }


        loadFavouriteStatus();


        return () => {

            mounted = false;

        };

    }, [
        isAuthenticated,
        listing
    ]);


    // =====================================================
    // LIGHTBOX KEYBOARD CONTROLS
    // =====================================================

    useEffect(() => {

        if (
            !isLightboxOpen ||
            !listing?.images?.length
        ) {

            return;

        }


        const handleKeyDown = (
            event: KeyboardEvent
        ) => {

            if (event.key === "Escape") {

                setIsLightboxOpen(false);

                return;

            }


            if (event.key === "ArrowLeft") {

                setActiveImage(
                    current =>
                        current === 0
                            ? listing.images.length - 1
                            : current - 1
                );

                return;

            }


            if (event.key === "ArrowRight") {

                setActiveImage(
                    current =>
                        current === listing.images.length - 1
                            ? 0
                            : current + 1
                );

            }

        };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        isLightboxOpen,
        listing
    ]);


    // =====================================================
    // PREVENT BODY SCROLL WHEN LIGHTBOX IS OPEN
    // =====================================================

    useEffect(() => {

        if (!isLightboxOpen) {
            return;
        }


        const originalOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                originalOverflow;

        };

    }, [isLightboxOpen]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <main className="product-page">

                <div className="marketplace-message">

                    Loading product...

                </div>

            </main>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error ||
        !listing
    ) {

        return (

            <main className="product-page">

                <div className="marketplace-message error">

                    <h2>
                        {error || "Product not found"}
                    </h2>


                    <Link to="/">
                        ← Back to marketplace
                    </Link>

                </div>

            </main>

        );

    }


    // =====================================================
    // PRODUCT DATA
    // =====================================================

    const hasImages =
        Boolean(
            listing.images &&
            listing.images.length > 0
        );


    const imageCount =
        listing.images?.length ?? 0;


    const safeImageIndex =
        hasImages
            ? Math.min(
                activeImage,
                imageCount - 1
            )
            : 0;


    const activeImageUrl =
        hasImages
            ? listing.images[
                safeImageIndex
            ].url
            : null;


 const formattedPrice =
    listing.price !== null &&
    listing.price !== undefined
        ? new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency:
                    listing.currency ?? "NGN",
                maximumFractionDigits: 2
            }
        ).format(listing.price)
        : "Contact Seller";


    const availabilityText =
        listing.available
            ? "Available"
            : "Currently unavailable";


    // =====================================================
    // CONDITION LABELS
    // =====================================================

    const conditionLabels:
        Record<string, string> = {

        NEW:
            "New",

        USED:
            "Used",

        UK_USED:
            "UK Used",

        NIGERIA_USED:
            "Nigeria Used",

        BRAND_NEW:
            "Brand New",

        FOREIGN_USED:
            "Foreign Used",

        NEW_BUILD:
            "New Build",

        OLD_BUILDING:
            "Old Building",

        RENOVATED:
            "Renovated"

    };


    const conditionText =
        listing.condition
            ? conditionLabels[
                listing.condition
            ] ||
            listing.condition
            : "Not specified";


    const categoryText =
        listing.category?.name ||
        "Uncategorized";


    // =====================================================
    // DYNAMIC LISTING DETAILS
    // =====================================================

    const listingDetails =
        listing.details ?? {};


    const detailEntries =
        Object.entries(
            listingDetails
        );


    const sellerName =
        listing.owner?.name ||
        "Seller";

    const businessStatus = sellerProfile?.businessStatus;

    function formatBusinessTime(time: string | null | undefined) {
        if (!time) {
            return "Closed";
        }

        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        const displayHour = hours % 12 || 12;

        return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
    }


    // =====================================================
    // REVIEWS & RATING
    // =====================================================

    const reviews =
        listing.reviews ?? [];


    const reviewCount =
        reviews.length;


    const averageRating =
        reviewCount > 0
            ? reviews.reduce(
                (
                    sum,
                    review
                ) =>
                    sum + review.rating,
                0
            ) / reviewCount
            : 0;


    const roundedRating =
        Math.round(
            averageRating
        );


    // =====================================================
    // IMAGE NAVIGATION
    // =====================================================

    function showPreviousImage() {

        if (!hasImages) {
            return;
        }


        setActiveImage(
            current =>
                current === 0
                    ? imageCount - 1
                    : current - 1
        );

    }


    function showNextImage() {

        if (!hasImages) {
            return;
        }


        setActiveImage(
            current =>
                current === imageCount - 1
                    ? 0
                    : current + 1
        );

    }


    function selectImage(
        index: number
    ) {

        if (
            index < 0 ||
            index >= imageCount
        ) {

            return;

        }


        setActiveImage(index);

    }


    // =====================================================
    // WHATSAPP CONTACT
    // =====================================================

    function contactSeller() {

     if (!listing?.owner?.phone) {

            alert(
                "Seller contact information is not available."
            );

            return;

        }


       const phone =
    listing.owner.phone
                .replace(/\D/g, "")
                .replace(
                    /^0/,
                    "234"
                );


        const message =
            encodeURIComponent(
                `Hello, I am interested in your Obaaratech Marketplace listing: ${listing.title}`
            );


        window.open(
            `https://wa.me/${phone}?text=${message}`,
            "_blank",
            "noopener,noreferrer"
        );

    }


    // =====================================================
    // BUY NOW
    // =====================================================

    function handleBuyNow() {

        alert(
            "Checkout and payment will be connected to the Obaaratech Marketplace payment system next."
        );

    }


    // =====================================================
    // ADD TO CART
    // =====================================================

    async function handleAddToCart() {

        if (!listing) {
            return;
        }


        if (!listing.available) {

            setCartError(
                "This listing is currently unavailable."
            );

            return;

        }


        try {

            setAddingToCart(true);

            setCartMessage("");

            setCartError("");


            await addToCart(
                listing.id
            );


            setCartMessage(
                "Added to cart successfully."
            );

        } catch (requestError: any) {

            console.error(
                "Add to cart error:",
                requestError
            );


            if (
                requestError?.response?.status === 401
            ) {

                setCartError(
                    "Please log in to add items to your cart."
                );

                return;

            }


            setCartError(
                requestError?.response?.data?.message ||
                "Unable to add this item to your cart."
            );

        } finally {

            setAddingToCart(false);

        }

    }


    // =====================================================
    // TOGGLE FAVOURITE
    // =====================================================

    async function handleToggleFavourite() {

        if (!listing) {
            return;
        }


        setFavouriteMessage("");

        setFavouriteError("");


        // =================================================
        // LOGIN REQUIRED
        // =================================================

        if (!isAuthenticated) {

            setFavouriteError(
                "Please log in to save favourites."
            );

            return;

        }


        if (favouriteLoading) {
            return;
        }


        try {

            setFavouriteLoading(true);


            if (isFavourite) {

                await removeFavourite(
                    listing.id
                );


                setIsFavourite(false);


                setFavouriteMessage(
                    "Removed from favourites."
                );

            } else {

                await addFavourite(
                    listing.id
                );


                setIsFavourite(true);


                setFavouriteMessage(
                    "Added to favourites."
                );

            }

        } catch (requestError: any) {

            console.error(
                "Favourite error:",
                requestError
            );


            if (
                requestError?.response?.status === 401
            ) {

                setFavouriteError(
                    "Your session has expired. Please log in again."
                );

                return;

            }


            setFavouriteError(
                requestError?.response?.data?.message ||
                "Unable to update favourites. Please try again."
            );

        } finally {

            setFavouriteLoading(false);

        }

    }


    // =====================================================
    // PRODUCT PAGE
    // =====================================================

    return (

        <main className="product-page">


            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <div className="product-breadcrumb">

                <Link to="/">
                    Marketplace
                </Link>


                <span>
                    /
                </span>


                <span>
                    {listing.title}
                </span>

            </div>


            {/* =================================================
                PRODUCT CONTAINER
            ================================================= */}

            <section className="product-container">


                {/* =================================================
                    IMAGE GALLERY
                ================================================= */}

                <div className="product-gallery">

                    <div className="main-product-image">

                        {activeImageUrl ? (

                            <>

                                <img
                                    src={activeImageUrl}
                                    alt={listing.title}
                                />


                                {hasImages && (

                                    <div className="image-counter">

                                        {safeImageIndex + 1}
                                        {" / "}
                                        {imageCount}

                                    </div>

                                )}


                                <button
                                    type="button"
                                    className="image-expand-button"
                                    onClick={() =>
                                        setIsLightboxOpen(true)
                                    }
                                    aria-label="View product image fullscreen"
                                >

                                    <Maximize2
                                        size={20}
                                    />

                                </button>


                                {imageCount > 1 && (

                                    <button
                                        type="button"
                                        className="gallery-nav gallery-prev"
                                        onClick={
                                            showPreviousImage
                                        }
                                        aria-label="Previous product image"
                                    >

                                        <ChevronLeft
                                            size={28}
                                        />

                                    </button>

                                )}


                                {imageCount > 1 && (

                                    <button
                                        type="button"
                                        className="gallery-nav gallery-next"
                                        onClick={
                                            showNextImage
                                        }
                                        aria-label="Next product image"
                                    >

                                        <ChevronRight
                                            size={28}
                                        />

                                    </button>

                                )}

                            </>

                        ) : (

                            <div className="no-image">

                                <ImageOff
                                    size={52}
                                    strokeWidth={1.5}
                                />


                                <strong>
                                    No Image Available
                                </strong>


                                <span>
                                    The seller has not uploaded
                                    a product image yet.
                                </span>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        THUMBNAILS
                    ================================================= */}

                    {hasImages && (

                        <div
                            className="thumbnail-list"
                            aria-label="Product image thumbnails"
                        >

                            {listing.images.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <button
                                        type="button"
                                        key={image.id}
                                        className={
                                            activeImage === index
                                                ? "thumbnail-button active"
                                                : "thumbnail-button"
                                        }
                                        onClick={() =>
                                            selectImage(index)
                                        }
                                        aria-label={
                                            `View ${listing.title} image ${index + 1}`
                                        }
                                    >

                                        <img
                                            className="thumbnail"
                                            src={image.url}
                                            alt={
                                                `${listing.title} ${index + 1}`
                                            }
                                        />

                                    </button>

                                )
                            )}

                        </div>

                    )}


                    {imageCount > 1 && (

                        <p className="gallery-hint">

                            Click an image to enlarge
                            {" • "}
                            Use ← → to navigate

                        </p>

                    )}

                </div>


                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <div className="product-information">


                    {/* =================================================
                        BADGE
                    ================================================= */}

                    <div className="product-badge">

                        {listing.featured
                            ? "Featured Listing"
                            : "Marketplace Listing"}

                    </div>


                    {/* =================================================
                        TITLE + FAVOURITE
                    ================================================= */}

                    <div
                        className="product-title-row"
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "16px"
                        }}
                    >

                        <h1>
                            {listing.title}
                        </h1>


                        <button
                            type="button"
                            className={
                                isFavourite
                                    ? "favourite-button active"
                                    : "favourite-button"
                            }
                            onClick={
                                handleToggleFavourite
                            }
                            disabled={
                                favouriteLoading ||
                                (
                                    isAuthenticated &&
                                    !favouriteLoaded
                                )
                            }
                            aria-label={
                                isFavourite
                                    ? "Remove from favourites"
                                    : "Add to favourites"
                            }
                            title={
                                isFavourite
                                    ? "Remove from favourites"
                                    : "Add to favourites"
                            }
                        >

                            {favouriteLoading ? (

                                <Loader2
                                    size={22}
                                    className="spinning"
                                />

                            ) : (

                                <Heart
                                    size={22}
                                    fill={
                                        isFavourite
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            )}

                        </button>

                    </div>


                    {/* =================================================
                        RATING
                    ================================================= */}

                    <div className="product-rating">

                        <span className="rating-stars">

                            {reviewCount > 0
                                ? "★".repeat(
                                    roundedRating
                                )
                                : "☆"}

                        </span>


                        {reviewCount > 0 ? (

                            <span>

                                {averageRating.toFixed(1)}

                                {" "}

                                (
                                {reviewCount}
                                {" "}

                                {
                                    reviewCount === 1
                                        ? "review"
                                        : "reviews"
                                }
                                )

                            </span>

                        ) : (

                            <span>
                                No reviews yet
                            </span>

                        )}

                    </div>


                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <div className="product-price-section">

                        <h2 className="product-details-price">

                            {formattedPrice}

                        </h2>


                        {listing.negotiable && (

                            <span className="negotiable-badge">

                                Price Negotiable

                            </span>

                        )}

                    </div>


                    {/* =================================================
                        QUICK INFORMATION
                    ================================================= */}

                    <div className="product-meta">


                        {listing.location && (

                            <div className="product-detail-row">

                                <span className="product-detail-icon">
                                    📍
                                </span>


                                <div>

                                    <strong>
                                        Location
                                    </strong>


                                    <span>
                                        {listing.location}
                                    </span>

                                </div>

                            </div>

                        )}


                        <div className="product-detail-row">

                            <span className="product-detail-icon">
                                🏷️
                            </span>


                            <div>

                                <strong>
                                    Category
                                </strong>


                                <span>
                                    {categoryText}
                                </span>

                            </div>

                        </div>


                        <div className="product-detail-row">

                            <span className="product-detail-icon">
                                📦
                            </span>


                            <div>

                                <strong>
                                    Condition
                                </strong>


                                <span>
                                    {conditionText}
                                </span>

                            </div>

                        </div>


                        <div className="product-detail-row">

                            <span className="product-detail-icon">
                                ✓
                            </span>


                            <div>

                                <strong>
                                    Availability
                                </strong>


                                <span
                                    className={
                                        listing.available
                                            ? "available-text"
                                            : "unavailable-text"
                                    }
                                >
                                    {availabilityText}
                                </span>

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="action-buttons">


                        <button
                            type="button"
                            className="buy-button"
                            onClick={
                                handleAddToCart
                            }
                            disabled={
                                !listing.available ||
                                addingToCart
                            }
                        >

                            {addingToCart
                                ? "Adding..."
                                : "🛒 Add to Cart"}

                        </button>


                        <button
                            type="button"
                            className="buy-button"
                            onClick={
                                handleBuyNow
                            }
                            disabled={
                                !listing.available
                            }
                        >

                            ⚡ Buy Now

                        </button>


                        <button
                            type="button"
                            className="chat-button"
                            onClick={
                                contactSeller
                            }
                        >

                            💬 Contact Seller

                        </button>

                    </div>


                    {/* =================================================
                        FAVOURITE MESSAGE
                    ================================================= */}

                    {favouriteMessage && (

                        <div
                            className="listing-form-message success"
                            role="status"
                            style={{
                                marginTop: "12px"
                            }}
                        >

                            {favouriteMessage}


                            {" "}


                            {isFavourite && (

                                <Link to="/favourites">
                                    View Favourites
                                </Link>

                            )}

                        </div>

                    )}


                    {favouriteError && (

                        <div
                            className="listing-form-message error"
                            role="alert"
                            style={{
                                marginTop: "12px"
                            }}
                        >

                            {favouriteError}


                            {!isAuthenticated && (

                                <>
                                    {" "}

                                    <Link to="/login">
                                        Login
                                    </Link>
                                </>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        CART MESSAGE
                    ================================================= */}

                    {cartMessage && (

                        <div
                            className="listing-form-message success"
                            role="status"
                            style={{
                                marginTop: "12px"
                            }}
                        >

                            {cartMessage}

                            {" "}

                            <Link to="/cart">
                                View Cart
                            </Link>

                        </div>

                    )}


                    {cartError && (

                        <div
                            className="listing-form-message error"
                            role="alert"
                            style={{
                                marginTop: "12px"
                            }}
                        >

                            {cartError}


                            {cartError.includes(
                                "log in"
                            ) && (

                                <>
                                    {" "}

                                    <Link to="/login">
                                        Login
                                    </Link>
                                </>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        SELLER SUMMARY
                    ================================================= */}

                    <div className="seller-summary">


                        <div className="seller-avatar">

                            {sellerName
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="seller-summary-info">

                            <span>
                                Sold by
                            </span>


                            <strong>
                                {sellerName}
                            </strong>


                            {listing.owner?.verifiedSeller && (

                                <span className="verified-badge">

                                    ✓ Verified Seller

                                </span>

                            )}

                            {businessStatus && (
                                <span style={{ color: businessStatus.isOpen ? "#15803d" : "#b91c1c", fontWeight: 700 }}>
                                    {businessStatus.isOpen ? "● Open" : "● Closed"} · {businessStatus.message}
                                </span>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <section className="description-card">

                <h2>
                    Product Description
                </h2>


                <p>

                    {listing.description ||
                        "No description provided by the seller."}

                </p>

            </section>


            {/* =================================================
                DYNAMIC DETAILS
            ================================================= */}

            {detailEntries.length > 0 && (

                <section className="product-details-card">

                    <h3>
                        Listing Details
                    </h3>


                    <div className="details-grid">

                        {detailEntries.map(
                            (
                                [key, value]
                            ) => (

                                <div
                                    className="detail-item"
                                    key={key}
                                >

                                    <span>

                                        {key
                                            .replace(
                                                /([A-Z])/g,
                                                " $1"
                                            )
                                            .replace(
                                                /^./,
                                                char =>
                                                    char.toUpperCase()
                                            )}

                                    </span>


                                    <strong>
                                        {String(value)}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                SELLER INFORMATION
            ================================================= */}

            <section className="seller-card">


                <div className="seller-card-content">


                    <div className="seller-avatar large">

                        {sellerName
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div>

                        <h2>
                            Seller Information
                        </h2>


                        <p className="seller-name">

                            <strong>
                                {sellerName}
                            </strong>


                            {listing.owner?.verifiedSeller && (

                                <span className="verified-badge">

                                    ✓ Verified Seller

                                </span>

                            )}

                        </p>


                        {listing.owner?.phone && (

                            <p>
                                📞 {listing.owner.phone}
                            </p>

                        )}


                        {listing.owner?.email && (

                            <p>
                                ✉️ {listing.owner.email}
                            </p>

                        )}

                        {businessStatus && (
                            <p style={{ color: businessStatus.isOpen ? "#15803d" : "#b91c1c", fontWeight: 700 }}>
                                {businessStatus.isOpen ? "● Open" : "● Closed"} · {businessStatus.message}
                            </p>
                        )}

                        {sellerProfile?.businessHours?.length === 7 && (
                            <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "5px 16px", fontSize: "14px" }}>
                                {sellerProfile.businessHours.map(hour => (
                                    <span key={hour.dayOfWeek}>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][hour.dayOfWeek]}: {hour.isOpen ? `${formatBusinessTime(hour.openingTime)}–${formatBusinessTime(hour.closingTime)}` : "Closed"}
                                    </span>
                                ))}
                            </div>
                        )}

                    </div>

                </div>


                <button
                    type="button"
                    className="seller-button"
                    onClick={
                        contactSeller
                    }
                >

                    💬 Contact Seller

                </button>

            </section>


            {/* =================================================
                FULLSCREEN IMAGE LIGHTBOX
            ================================================= */}

            {isLightboxOpen &&
                activeImageUrl && (

                    <div
                        className="image-lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Product image viewer"
                        onClick={() =>
                            setIsLightboxOpen(false)
                        }
                    >


                        <button
                            type="button"
                            className="lightbox-close"
                            onClick={
                                event => {

                                    event.stopPropagation();

                                    setIsLightboxOpen(
                                        false
                                    );

                                }
                            }
                            aria-label="Close image viewer"
                        >

                            <X
                                size={28}
                            />

                        </button>


                        <div
                            className="lightbox-content"
                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <img
                                src={activeImageUrl}
                                alt={listing.title}
                                className="lightbox-image"
                            />


                            {imageCount > 1 && (

                                <div className="lightbox-counter">

                                    {safeImageIndex + 1}
                                    {" / "}
                                    {imageCount}

                                </div>

                            )}


                            {imageCount > 1 && (

                                <button
                                    type="button"
                                    className="lightbox-nav lightbox-prev"
                                    onClick={
                                        showPreviousImage
                                    }
                                    aria-label="Previous image"
                                >

                                    <ChevronLeft
                                        size={36}
                                    />

                                </button>

                            )}


                            {imageCount > 1 && (

                                <button
                                    type="button"
                                    className="lightbox-nav lightbox-next"
                                    onClick={
                                        showNextImage
                                    }
                                    aria-label="Next image"
                                >

                                    <ChevronRight
                                        size={36}
                                    />

                                </button>

                            )}

                        </div>

                    </div>

                )}


            {/* =================================================
                RELATED PRODUCTS
            ================================================= */}

            {relatedListings.length > 0 && (

                <section className="related-products">

                    <h2>
                        You may also like
                    </h2>


                    <div className="related-products-grid">

                        {relatedListings.map(
                            item => (

                                <ListingCard
                                    key={item.id}
                                    listing={item}
                                />

                            )
                        )}

                    </div>

                </section>

            )}

        </main>

    );

}
