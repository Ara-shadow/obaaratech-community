import {
    useEffect,
    useState
} from "react";

import type {
    Listing
} from "../types/listing";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    Loader2,
    Pencil,
    Plus,
    ShoppingBag,
    Trash2,
    X,
    Package,
    MapPin,
    Clock,
    TrendingUp,
    AlertCircle
} from "lucide-react";

import {
    deleteSellerListing,
    getMySellerListings,
    markListingSold
} from "../api/sellerListings";


export default function MyListings() {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // =====================================================
    // LOAD LISTINGS
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadListings() {

            try {
                setLoading(true);
                setError("");

                const data = await getMySellerListings();

                if (mounted) {
                    setListings(data);
                }

            } catch (requestError: any) {
                console.error("My listings error:", requestError);

                if (mounted) {
                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load your listings."
                    );
                }

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }

        }

        loadListings();

        return () => {
            mounted = false;
        };

    }, []);

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalListings = listings.length;
    const activeListings = listings.filter(
        listing => listing.status !== "SOLD" && listing.available !== false
    ).length;
    const soldListings = listings.filter(
        listing => listing.status === "SOLD"
    ).length;

    // =====================================================
    // MARK AS SOLD
    // =====================================================

    async function handleMarkSold(listing: Listing) {

        const confirmed = window.confirm(
            `Mark "${listing.title}" as sold?`
        );

        if (!confirmed) return;

        try {
            setActionId(`sold-${listing.id}`);
            setError("");
            setSuccessMessage("");

            const updated = await markListingSold(listing.id);

            setListings(
                current =>
                    current.map(
                        item =>
                            item.id === listing.id
                                ? updated
                                : item
                    )
            );

            setSuccessMessage("Listing marked as sold.");

        } catch (requestError: any) {
            console.error("Mark sold error:", requestError);
            setError(
                requestError?.response?.data?.message ||
                "Unable to mark listing as sold."
            );
        } finally {
            setActionId("");
        }

    }

    // =====================================================
    // DELETE LISTING
    // =====================================================

    async function handleDelete(listing: Listing) {

        const confirmed = window.confirm(
            `Delete "${listing.title}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setActionId(`delete-${listing.id}`);
            setError("");
            setSuccessMessage("");

            await deleteSellerListing(listing.id);

            setListings(
                current =>
                    current.filter(
                        item =>
                            item.id !== listing.id
                    )
            );

            setSuccessMessage("Listing deleted successfully.");

        } catch (requestError: any) {
            console.error("Delete listing error:", requestError);
            setError(
                requestError?.response?.data?.message ||
                "Unable to delete listing."
            );
        } finally {
            setActionId("");
        }

    }

    // =====================================================
    // FORMAT PRICE
    // =====================================================

    function formatPrice(price: number | null, currency: string = "NGN") {

        if (price === null || price === undefined) {
            return "Contact seller";
        }

        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency,
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
    // PAGE
    // =====================================================

    return (

        <div className="my-listings-page">

            <div className="my-listings-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="my-listings-header">

                    <div className="my-listings-header-left">

                        <Link to="/account" className="my-listings-back">
                            <ArrowLeft size={18} />
                            Back to Account
                        </Link>

                        <div className="my-listings-title">
                            <ShoppingBag size={28} />
                            <div>
                                <h1>My Listings</h1>
                                <p>Manage your products and services</p>
                            </div>
                        </div>

                    </div>

                    <Link
                        to="/create-listing"
                        className="btn-primary"
                    >
                        <Plus size={18} />
                        Create Listing
                    </Link>

                </div>

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="my-listings-stats">

                    <div className="my-listings-stat">
                        <div className="my-listings-stat-icon total">
                            <Package size={18} />
                        </div>
                        <div>
                            <span>Total</span>
                            <strong>{totalListings}</strong>
                        </div>
                    </div>

                    <div className="my-listings-stat">
                        <div className="my-listings-stat-icon active">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <span>Active</span>
                            <strong>{activeListings}</strong>
                        </div>
                    </div>

                    <div className="my-listings-stat">
                        <div className="my-listings-stat-icon sold">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <span>Sold</span>
                            <strong>{soldListings}</strong>
                        </div>
                    </div>

                </div>

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {error && (
                    <div className="my-listings-message error">
                        <X size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="my-listings-message success">
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="my-listings-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading your listings...</p>
                    </div>

                )}

                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading && !error && listings.length === 0 && (

                    <div className="my-listings-empty">

                        <div className="my-listings-empty-icon">
                            <ShoppingBag size={48} />
                        </div>

                        <h2>No listings yet</h2>

                        <p>
                            Start selling on Obaaratech by
                            creating your first listing.
                        </p>

                        <Link
                            to="/create-listing"
                            className="btn-primary"
                        >
                            <Plus size={18} />
                            Create Your First Listing
                        </Link>

                    </div>

                )}

                {/* =================================================
                    LISTINGS GRID
                ================================================= */}

                {!loading && listings.length > 0 && (

                    <div className="my-listings-grid">

                        {listings.map(listing => {

                            const imageUrl = listing.images?.length > 0
                                ? listing.images[0].url
                                : null;

                            const isSold = listing.status === "SOLD";
                            const isActive = !isSold && listing.available !== false;

                            return (

                                <div
                                    key={listing.id}
                                    className={`my-listings-card ${isSold ? "sold" : ""}`}
                                >

                                    {/* Image */}
                                    <div className="my-listings-card-image">
                                        {imageUrl ? (
                                            <img
                                                src={getImageUrl(imageUrl)}
                                                alt={listing.title}
                                            />
                                        ) : (
                                            <div className="my-listings-card-no-image">
                                                <ShoppingBag size={28} />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <span className={`my-listings-card-badge ${isSold ? "sold" : "active"}`}>
                                            {isSold ? "Sold" : isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="my-listings-card-content">

                                        <div className="my-listings-card-meta">
                                            <span className="my-listings-card-type">
                                                {listing.type || "PRODUCT"}
                                            </span>
                                            {listing.category && (
                                                <span className="my-listings-card-category">
                                                    {listing.category.name}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="my-listings-card-title">
                                            {listing.title}
                                        </h3>

                                        <div className="my-listings-card-location">
                                            <MapPin size={14} />
                                            <span>{listing.location || "Location not specified"}</span>
                                        </div>

                                        <div className="my-listings-card-price">
                                            {formatPrice(listing.price, listing.currency ?? "NGN")}
                                        </div>

                                        {/* Actions */}
                                        <div className="my-listings-card-actions">

                                            <button
                                                type="button"
                                                className="my-listings-card-action view"
                                                onClick={() => navigate(`/product/${listing.id}`)}
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                className="my-listings-card-action edit"
                                                onClick={() => navigate(`/product/${listing.id}?edit=true`)}
                                            >
                                                <Pencil size={16} />
                                                Edit
                                            </button>

                                            {!isSold && (
                                                <button
                                                    type="button"
                                                    className="my-listings-card-action sold"
                                                    disabled={actionId === `sold-${listing.id}`}
                                                    onClick={() => handleMarkSold(listing)}
                                                >
                                                    {actionId === `sold-${listing.id}` ? (
                                                        <Loader2 size={16} className="spinning" />
                                                    ) : (
                                                        <CheckCircle2 size={16} />
                                                    )}
                                                    Sold
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="my-listings-card-action delete"
                                                disabled={actionId === `delete-${listing.id}`}
                                                onClick={() => handleDelete(listing)}
                                            >
                                                {actionId === `delete-${listing.id}` ? (
                                                    <Loader2 size={16} className="spinning" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                                Delete
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