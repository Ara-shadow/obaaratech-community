import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Heart,
    ShoppingBag,
    Trash2,
    Loader2,
    ArrowLeft,
    MapPin,
    ChevronRight,
    Star,
    AlertCircle,
    CheckCircle2,
    X
} from "lucide-react";

import ListingCard from "../components/ListingCard";

import {
    getFavourites,
    removeFavourite
} from "../api/favourites";

import type {
    Listing
} from "../types/listing";


export default function Favourites() {

    const navigate = useNavigate();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // =====================================================
    // LOAD FAVOURITES
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadFavourites() {

            try {
                setLoading(true);
                setError("");

                const data = await getFavourites();

                if (mounted) {
                    setListings(data);
                }

            } catch (err) {
                console.error("Favourites loading error:", err);
                if (mounted) {
                    setError("Failed to load your favourites.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }

        }

        loadFavourites();

        return () => {
            mounted = false;
        };

    }, []);

    // =====================================================
    // REMOVE FAVOURITE
    // =====================================================

    async function handleRemoveFavourite(listingId: string) {

        const confirmed = window.confirm(
            "Remove this item from your favourites?"
        );

        if (!confirmed) return;

        try {
            setRemovingId(listingId);
            setError("");
            setSuccessMessage("");

            await removeFavourite(listingId);

            setListings(current =>
                current.filter(item => item.id !== listingId)
            );

            setSuccessMessage("Item removed from favourites.");

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (err) {
            console.error("Remove favourite error:", err);
            setError("Failed to remove item from favourites.");
        } finally {
            setRemovingId("");
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
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(price);

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
            <div className="favourites-page">
                <div className="favourites-container">
                    <div className="favourites-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading your favourites...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="favourites-page">

            <div className="favourites-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="favourites-header">

                    <div className="favourites-header-left">

                        <Link to="/account" className="favourites-back">
                            <ArrowLeft size={18} />
                            Back to Account
                        </Link>

                        <div className="favourites-title">
                            <Heart size={28} className="favourites-title-icon" />
                            <div>
                                <h1>My Favourites</h1>
                                <p>
                                    {listings.length === 0
                                        ? "You haven't saved any items yet"
                                        : `${listings.length} saved item${listings.length === 1 ? "" : "s"}`
                                    }
                                </p>
                            </div>
                        </div>

                    </div>

                    {listings.length > 0 && (
                        <span className="favourites-count">
                            <Heart size={14} />
                            {listings.length} Items
                        </span>
                    )}

                </div>

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {error && (
                    <div className="favourites-message error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="favourites-message success">
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {listings.length === 0 && (

                    <div className="favourites-empty">

                        <div className="favourites-empty-icon">
                            <Heart size={48} />
                        </div>

                        <h2>No favourites yet</h2>

                        <p>
                            Browse the marketplace and save items you love.
                            Your saved items will appear here.
                        </p>

                        <Link
                            to="/marketplace"
                            className="btn-primary"
                        >
                            <ShoppingBag size={18} />
                            Browse Marketplace
                        </Link>

                    </div>

                )}

                {/* =================================================
                    GRID
                ================================================= */}

                {listings.length > 0 && (

                    <div className="favourites-grid">

                        {listings.map((listing) => {

                            const imageUrl = listing.images?.length > 0
                                ? listing.images[0].url
                                : null;

                            const isRemoving = removingId === listing.id;

                            return (

                                <div
                                    key={listing.id}
                                    className={`favourites-card ${isRemoving ? "removing" : ""}`}
                                >

                                    <div
                                        className="favourites-card-image"
                                        onClick={() => navigate(`/product/${listing.id}`)}
                                    >

                                        {imageUrl ? (

                                            <img
                                                src={getImageUrl(imageUrl)}
                                                alt={listing.title}
                                            />

                                        ) : (

                                            <div className="favourites-card-no-image">
                                                <ShoppingBag size={28} />
                                            </div>

                                        )}

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            className="favourites-card-remove"
                                            onClick={() => handleRemoveFavourite(listing.id)}
                                            disabled={isRemoving}
                                            aria-label="Remove from favourites"
                                        >
                                            {isRemoving ? (
                                                <Loader2 size={16} className="spinning" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>

                                    </div>

                                    <div className="favourites-card-content">

                                        {/* Category */}
                                        {listing.category?.name && (
                                            <span className="favourites-card-category">
                                                {listing.category.name}
                                            </span>
                                        )}

                                        {/* Title */}
                                        <h3
                                            className="favourites-card-title"
                                            onClick={() => navigate(`/product/${listing.id}`)}
                                        >
                                            {listing.title}
                                        </h3>

                                        {/* Price */}
                                        <div className="favourites-card-price">
                                            {formatPrice(listing.price)}
                                        </div>

                                        {/* Location */}
                                        {listing.location && (
                                            <div className="favourites-card-location">
                                                <MapPin size={14} />
                                                <span>{listing.location}</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="favourites-card-actions">

                                            <button
                                                type="button"
                                                className="favourites-card-action view"
                                                onClick={() => navigate(`/product/${listing.id}`)}
                                            >
                                                View Details
                                                <ChevronRight size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                className="favourites-card-action remove"
                                                onClick={() => handleRemoveFavourite(listing.id)}
                                                disabled={isRemoving}
                                            >
                                                {isRemoving ? (
                                                    <Loader2 size={14} className="spinning" />
                                                ) : (
                                                    <X size={14} />
                                                )}
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

}