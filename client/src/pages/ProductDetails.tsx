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
    Heart,
    Loader2,
    Star,
    MapPin,
    Clock,
    ShieldCheck,
    MessageCircle,
    Minus,
    Plus,
    ShoppingBag,
    Check
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


// ============================================================
// PRODUCT DETAILS PAGE
// ============================================================

export default function ProductDetails() {

    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();

    // =====================================================
    // STATE
    // =====================================================

    const [listing, setListing] = useState<Listing | null>(null);
    const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
    const [sellerProfile, setSellerProfile] = useState<PublicSellerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Quantity
    const [quantity, setQuantity] = useState(1);

    // Cart
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState("");

    // Favourite
    const [isFavourite, setIsFavourite] = useState(false);
    const [favouriteLoading, setFavouriteLoading] = useState(false);
    const [favouriteLoaded, setFavouriteLoaded] = useState(false);

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

                // Use ! to assert id is defined (we already checked above)
                const data = await getListingById(id!);

                if (!mounted) return;

                setListing(data);
                setActiveImage(0);
                setQuantity(1);

                // Load related listings
                try {
                    const related = await getRelatedListings(data.id);
                    if (mounted) {
                        setRelatedListings(related);
                    }
                } catch (relatedError) {
                    console.error("Related listings error:", relatedError);
                    if (mounted) {
                        setRelatedListings([]);
                    }
                }

            } catch (requestError) {
                console.error("Product loading error:", requestError);
                if (mounted) {
                    setError("Unable to load this product.");
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

    // =====================================================
    // LOAD SELLER PROFILE
    // =====================================================

    useEffect(() => {
        const sellerId = listing?.owner?.id;

        if (!sellerId) {
            setSellerProfile(null);
            return;
        }

        let mounted = true;

        async function loadSellerProfile() {
            try {
                // Use ! to assert sellerId is defined (we already checked above)
                const data = await getPublicSellerProfile(sellerId!);
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

        if (!isAuthenticated || !listing) {
            setIsFavourite(false);
            setFavouriteLoaded(false);
            return;
        }

        let mounted = true;

        async function loadFavouriteStatus() {

            try {
                setFavouriteLoaded(false);
                const favourites = await getFavourites();

                if (!mounted) return;

                const exists = favourites.some(
                    favourite => favourite.id === listing?.id
                );

                setIsFavourite(exists);

            } catch (requestError) {
                console.error("Favourite status error:", requestError);
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

    }, [isAuthenticated, listing]);

    // =====================================================
    // LIGHTBOX KEYBOARD CONTROLS
    // =====================================================

    useEffect(() => {

        if (!isLightboxOpen || !listing?.images?.length) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {

            if (event.key === "Escape") {
                setIsLightboxOpen(false);
                return;
            }

            if (event.key === "ArrowLeft") {
                setActiveImage(current =>
                    current === 0 ? listing.images.length - 1 : current - 1
                );
                return;
            }

            if (event.key === "ArrowRight") {
                setActiveImage(current =>
                    current === listing.images.length - 1 ? 0 : current + 1
                );
            }

        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };

    }, [isLightboxOpen, listing]);

    // =====================================================
    // PREVENT BODY SCROLL WHEN LIGHTBOX IS OPEN
    // =====================================================

    useEffect(() => {

        if (!isLightboxOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };

    }, [isLightboxOpen]);

    // =====================================================
    // HANDLERS
    // =====================================================

    function showPreviousImage() {
        if (!listing?.images?.length) return;
        setActiveImage(current =>
            current === 0 ? listing.images.length - 1 : current - 1
        );
    }

    function showNextImage() {
        if (!listing?.images?.length) return;
        setActiveImage(current =>
            current === listing.images.length - 1 ? 0 : current + 1
        );
    }

    function selectImage(index: number) {
        if (!listing?.images?.length) return;
        if (index < 0 || index >= listing.images.length) return;
        setActiveImage(index);
    }

    function decreaseQuantity() {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }

    function increaseQuantity() {
        setQuantity(prev => prev + 1);
    }

    function contactSeller() {
        if (!listing?.owner?.phone) {
            alert("Seller contact information is not available.");
            return;
        }

        const phone = listing.owner.phone.replace(/\D/g, "").replace(/^0/, "234");
        const message = encodeURIComponent(
            `Hello, I am interested in your Obaaratech Marketplace listing: ${listing.title}`
        );

        window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
    }

    // =====================================================
    // ADD TO CART
    // =====================================================

    async function handleAddToCart() {

        if (!listing) return;

        if (!listing.available) {
            setCartError("This listing is currently unavailable.");
            return;
        }

        try {
            setAddingToCart(true);
            setCartMessage("");
            setCartError("");

            await addToCart(listing.id);

            setCartMessage(`Added ${quantity} item(s) to cart successfully.`);

        } catch (requestError: any) {
            console.error("Add to cart error:", requestError);

            if (requestError?.response?.status === 401) {
                setCartError("Please log in to add items to your cart.");
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

        if (!listing) return;

        if (!isAuthenticated) {
            setCartError("Please log in to save favourites.");
            return;
        }

        if (favouriteLoading) return;

        try {
            setFavouriteLoading(true);

            if (isFavourite) {
                await removeFavourite(listing.id);
                setIsFavourite(false);
            } else {
                await addFavourite(listing.id);
                setIsFavourite(true);
            }

        } catch (requestError: any) {
            console.error("Favourite error:", requestError);
            if (requestError?.response?.status === 401) {
                setCartError("Your session has expired. Please log in again.");
            } else {
                setCartError("Unable to update favourites. Please try again.");
            }
        } finally {
            setFavouriteLoading(false);
        }

    }

    // =====================================================
    // FORMAT PRICE
    // =====================================================

    function formatPrice(price: number | null | undefined) {

        if (price === null || price === undefined) {
            return "Contact Seller";
        }

        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: listing?.currency || "NGN",
            maximumFractionDigits: 0
        }).format(price);

    }

    // =====================================================
    // RENDER STARS
    // =====================================================

    function renderStars(rating: number) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <span className="product-rating-stars">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} size={16} fill="#f59e0b" stroke="#f59e0b" />
                ))}
                {hasHalfStar && <Star key="half" size={16} fill="#f59e0b" stroke="#f59e0b" className="half-star" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} size={16} stroke="#d1d5db" />
                ))}
            </span>
        );
    }

    // =====================================================
    // GET IMAGE URL
    // =====================================================

    function getImageUrl(url?: string) {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        return `${apiBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <main className="product-page">
                <div className="product-loading">
                    <div className="product-loading-spinner">
                        <Loader2 size={40} className="spinning" />
                        <p>Loading product details...</p>
                    </div>
                </div>
            </main>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !listing) {
        return (
            <main className="product-page">
                <div className="product-error">
                    <div className="product-error-icon">⚠️</div>
                    <h2>{error || "Product not found"}</h2>
                    <p>The product you're looking for doesn't exist or has been removed.</p>
                    <Link to="/" className="btn-primary">
                        ← Back to Marketplace
                    </Link>
                </div>
            </main>
        );
    }

    // =====================================================
    // PRODUCT DATA
    // =====================================================

    const hasImages = Boolean(listing.images && listing.images.length > 0);
    const imageCount = listing.images?.length ?? 0;
    const safeImageIndex = hasImages ? Math.min(activeImage, imageCount - 1) : 0;
    const activeImageUrl = hasImages ? listing.images[safeImageIndex].url : null;

    const reviews = listing.reviews ?? [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    const sellerName = listing.owner?.name || "Seller";
    const businessStatus = sellerProfile?.businessStatus;

    const conditionLabels: Record<string, string> = {
        NEW: "New",
        USED: "Used",
        UK_USED: "UK Used",
        NIGERIA_USED: "Nigeria Used",
        BRAND_NEW: "Brand New",
        FOREIGN_USED: "Foreign Used",
        NEW_BUILD: "New Build",
        OLD_BUILDING: "Old Building",
        RENOVATED: "Renovated"
    };

    const conditionText = listing.condition
        ? conditionLabels[listing.condition] || listing.condition
        : "Not specified";

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="product-page">

            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <div className="product-breadcrumb">
                <Link to="/">Home</Link>
                <span className="separator">›</span>
                <Link to="/marketplace">Marketplace</Link>
                <span className="separator">›</span>
                <span className="current">{listing.title}</span>
            </div>

            {/* =================================================
                PRODUCT CONTAINER
            ================================================= */}

            <div className="product-container">

                {/* =================================================
                    IMAGE GALLERY
                ================================================= */}

                <div className="product-gallery">

                    <div className="product-main-image">

                        {activeImageUrl ? (

                            <>
                                <img
                                    src={getImageUrl(activeImageUrl)}
                                    alt={listing.title}
                                />

                                {hasImages && (
                                    <div className="product-image-counter">
                                        {safeImageIndex + 1} / {imageCount}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="product-image-expand"
                                    onClick={() => setIsLightboxOpen(true)}
                                    aria-label="View fullscreen"
                                >
                                    <Maximize2 size={18} />
                                </button>

                                {imageCount > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            className="product-gallery-nav product-gallery-prev"
                                            onClick={showPreviousImage}
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>

                                        <button
                                            type="button"
                                            className="product-gallery-nav product-gallery-next"
                                            onClick={showNextImage}
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}

                            </>

                        ) : (

                            <div className="product-no-image">
                                <div className="product-no-image-icon">📷</div>
                                <p>No Image Available</p>
                            </div>

                        )}

                    </div>

                    {/* Thumbnails */}
                    {hasImages && imageCount > 1 && (

                        <div className="product-thumbnails">
                            {listing.images.map((image, index) => (

                                <button
                                    key={image.id}
                                    type="button"
                                    className={`product-thumbnail ${activeImage === index ? "active" : ""}`}
                                    onClick={() => selectImage(index)}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <img src={getImageUrl(image.url)} alt={`${listing.title} ${index + 1}`} />
                                </button>

                            ))}
                        </div>

                    )}

                </div>

                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <div className="product-info-section">

                    {/* Category Badge */}
                    <div className="product-category-badge">
                        {listing.category?.name || "Uncategorized"}
                    </div>

                    {/* Title & Favourite */}
                    <div className="product-title-row">
                        <h1>{listing.title}</h1>

                        <button
                            type="button"
                            className={`product-favourite-btn ${isFavourite ? "active" : ""}`}
                            onClick={handleToggleFavourite}
                            disabled={favouriteLoading || (!isAuthenticated && !favouriteLoaded)}
                            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                        >
                            {favouriteLoading ? (
                                <Loader2 size={22} className="spinning" />
                            ) : (
                                <Heart size={22} fill={isFavourite ? "currentColor" : "none"} />
                            )}
                        </button>
                    </div>

                    {/* Rating */}
                    <div className="product-rating-row">
                        {renderStars(averageRating)}
                        <span className="product-rating-count">
                            {reviewCount > 0
                                ? `${averageRating.toFixed(1)} (${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})`
                                : "No reviews yet"}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="product-price-section">
                        <span className="product-price-large">{formatPrice(listing.price)}</span>
                        {listing.negotiable && (
                            <span className="product-negotiable-badge">Negotiable</span>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="product-availability">
                        <span className={`product-availability-dot ${listing.available ? "in-stock" : "out-of-stock"}`} />
                        <span className="product-availability-text">
                            {listing.available ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>

                    {/* Quick Info */}
                    <div className="product-quick-info">

                        {listing.location && (
                            <div className="product-quick-info-item">
                                <MapPin size={16} />
                                <span>{listing.location}</span>
                            </div>
                        )}

                        <div className="product-quick-info-item">
                            <Clock size={16} />
                            <span>Condition: {conditionText}</span>
                        </div>

                    </div>

                    {/* Quantity Selector */}
                    <div className="product-quantity-section">
                        <label htmlFor="quantity">Quantity</label>
                        <div className="product-quantity-controls">
                            <button
                                type="button"
                                className="product-quantity-btn"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1 || addingToCart}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="product-quantity-value">{quantity}</span>
                            <button
                                type="button"
                                className="product-quantity-btn"
                                onClick={increaseQuantity}
                                disabled={addingToCart}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="product-actions">

                        <button
                            type="button"
                            className="product-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={!listing.available || addingToCart}
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 size={20} className="spinning" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="product-buy-now"
                            onClick={() => {
                                handleAddToCart();
                                // Navigate to cart after adding
                                setTimeout(() => window.location.href = "/cart", 500);
                            }}
                            disabled={!listing.available || addingToCart}
                        >
                            <ShieldCheck size={20} />
                            Buy Now
                        </button>

                    </div>

                    {/* Cart Messages */}
                    {cartMessage && (
                        <div className="product-message product-message-success">
                            <Check size={18} />
                            <span>{cartMessage}</span>
                            <Link to="/cart">View Cart →</Link>
                        </div>
                    )}

                    {cartError && (
                        <div className="product-message product-message-error">
                            <span>{cartError}</span>
                            {cartError.includes("log in") && (
                                <Link to="/login">Login</Link>
                            )}
                        </div>
                    )}

                    {/* Seller Info */}
                    <div className="product-seller-section">

                        <div className="product-seller-avatar">
                            {sellerName.charAt(0).toUpperCase()}
                        </div>

                        <div className="product-seller-info">
                            <span className="product-seller-label">Sold by</span>
                            <strong className="product-seller-name">{sellerName}</strong>
                            {listing.owner?.verifiedSeller && (
                                <span className="product-seller-verified">
                                    <ShieldCheck size={14} />
                                    Verified Seller
                                </span>
                            )}
                            {businessStatus && (
                                <span className={`product-seller-status ${businessStatus.isOpen ? "open" : "closed"}`}>
                                    {businessStatus.isOpen ? "🟢 Open" : "🔴 Closed"} · {businessStatus.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            className="product-contact-seller"
                            onClick={contactSeller}
                        >
                            <MessageCircle size={18} />
                            Contact Seller
                        </button>

                    </div>

                </div>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <section className="product-description-card">
                <h2>Description</h2>
                <div className="product-description-content">
                    <p>{listing.description || "No description provided by the seller."}</p>
                </div>
            </section>

            {/* =================================================
                SELLER INFORMATION
            ================================================= */}

            <section className="product-seller-card">
                <div className="product-seller-card-header">
                    <div className="product-seller-card-avatar">
                        {sellerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3>{sellerName}</h3>
                        {listing.owner?.verifiedSeller && (
                            <span className="product-seller-verified-badge">
                                <ShieldCheck size={16} />
                                Verified Seller
                            </span>
                        )}
                        <p>
                            {listing.owner?.phone && `📞 ${listing.owner.phone}`}
                            {listing.owner?.email && ` · ✉️ ${listing.owner.email}`}
                        </p>
                    </div>
                </div>

                {businessStatus && (
                    <div className={`product-seller-business-status ${businessStatus.isOpen ? "open" : "closed"}`}>
                        {businessStatus.isOpen ? "🟢 Open" : "🔴 Closed"} · {businessStatus.message}
                    </div>
                )}

                {sellerProfile?.businessHours?.length === 7 && (
                    <div className="product-seller-hours">
                        <h4>Business Hours</h4>
                        <div className="product-seller-hours-grid">
                            {sellerProfile.businessHours.map(hour => {
                                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                return (
                                    <span key={hour.dayOfWeek}>
                                        <strong>{dayNames[hour.dayOfWeek]}:</strong>
                                        {hour.isOpen
                                            ? ` ${hour.openingTime}–${hour.closingTime}`
                                            : " Closed"}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    className="product-seller-contact-btn"
                    onClick={contactSeller}
                >
                    <MessageCircle size={18} />
                    Contact Seller
                </button>
            </section>

            {/* =================================================
                RELATED PRODUCTS
            ================================================= */}

            {relatedListings.length > 0 && (
                <section className="product-related">
                    <h2>You May Also Like</h2>
                    <div className="product-related-grid">
                        {relatedListings.map(item => (
                            <ListingCard
                                key={item.id}
                                listing={item}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* =================================================
                FULLSCREEN LIGHTBOX
            ================================================= */}

            {isLightboxOpen && activeImageUrl && (

                <div
                    className="product-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Product image viewer"
                    onClick={() => setIsLightboxOpen(false)}
                >

                    <button
                        type="button"
                        className="product-lightbox-close"
                        onClick={() => setIsLightboxOpen(false)}
                        aria-label="Close viewer"
                    >
                        <X size={28} />
                    </button>

                    <div
                        className="product-lightbox-content"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={getImageUrl(activeImageUrl)}
                            alt={listing.title}
                            className="product-lightbox-image"
                        />

                        {imageCount > 1 && (
                            <div className="product-lightbox-counter">
                                {safeImageIndex + 1} / {imageCount}
                            </div>
                        )}

                        {imageCount > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="product-lightbox-nav product-lightbox-prev"
                                    onClick={showPreviousImage}
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={36} />
                                </button>

                                <button
                                    type="button"
                                    className="product-lightbox-nav product-lightbox-next"
                                    onClick={showNextImage}
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={36} />
                                </button>
                            </>
                        )}

                    </div>

                </div>

            )}

        </main>

    );

}