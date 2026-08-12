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
    X
} from "lucide-react";

import {
    deleteSellerListing,
    getMySellerListings,
    markListingSold
} from "../api/sellerListings";


export default function MyListings() {

    const navigate =
        useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [
        listings,
        setListings
    ] = useState<Listing[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        actionId,
        setActionId
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage
    ] = useState("");


    // =====================================================
    // LOAD LISTINGS
    // =====================================================

    useEffect(() => {

        let mounted = true;


        async function loadListings() {

            try {

                setLoading(true);

                setError("");


                const data =
                    await getMySellerListings();


                if (mounted) {

                    setListings(
                        data
                    );

                }


            } catch (requestError: any) {

                console.error(
                    "My listings error:",
                    requestError
                );


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
    // MARK AS SOLD
    // =====================================================

    async function handleMarkSold(
        listing: Listing
    ) {

        const confirmed =
            window.confirm(
                `Mark "${listing.title}" as sold?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setActionId(
                `sold-${listing.id}`
            );

            setError("");

            setSuccessMessage("");


            const updated =
                await markListingSold(
                    listing.id
                );


            setListings(
                current =>
                    current.map(
                        item =>
                            item.id === listing.id
                                ? updated
                                : item
                    )
            );


            setSuccessMessage(
                "Listing marked as sold."
            );


        } catch (requestError: any) {

            console.error(
                "Mark sold error:",
                requestError
            );


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

    async function handleDelete(
        listing: Listing
    ) {

        const confirmed =
            window.confirm(
                `Delete "${listing.title}"? This action cannot be undone.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setActionId(
                `delete-${listing.id}`
            );

            setError("");

            setSuccessMessage("");


            await deleteSellerListing(
                listing.id
            );


            setListings(
                current =>
                    current.filter(
                        item =>
                            item.id !== listing.id
                    )
            );


            setSuccessMessage(
                "Listing deleted successfully."
            );


        } catch (requestError: any) {

            console.error(
                "Delete listing error:",
                requestError
            );


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

    function formatPrice(
        price: number | null
    ) {

        if (
            price === null ||
            price === undefined
        ) {

            return "Contact seller";

        }


        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0
            }
        ).format(price);

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="my-listings-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="my-listings-header">

                <div>

                    <Link
                        to="/account"
                        className="back-marketplace"
                    >

                        <ArrowLeft
                            size={18}
                        />

                        Back to Account

                    </Link>


                    <div className="my-listings-title-row">

                        <div className="my-listings-icon">

                            <ShoppingBag
                                size={24}
                            />

                        </div>


                        <div>

                            <h1>
                                My Listings
                            </h1>


                            <p>
                                Manage the products and services
                                you have published.
                            </p>

                        </div>

                    </div>

                </div>


                <Link
                    to="/create-listing"
                    className="create-listing-button"
                >

                    <Plus
                        size={19}
                    />

                    Create Listing

                </Link>

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (

                <div
                    className="listing-form-message error"
                    role="alert"
                >

                    <X
                        size={19}
                    />


                    <span>
                        {error}
                    </span>

                </div>

            )}


            {successMessage && (

                <div
                    className="listing-form-message success"
                    role="status"
                >

                    <CheckCircle2
                        size={19}
                    />


                    <span>
                        {successMessage}
                    </span>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="my-listings-loading">

                    <Loader2
                        size={30}
                        className="spinning"
                    />


                    <p>
                        Loading your listings...
                    </p>

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                !error &&
                listings.length === 0 && (

                    <div className="my-listings-empty">

                        <div className="my-listings-empty-icon">

                            <ShoppingBag
                                size={34}
                            />

                        </div>


                        <h2>
                            You have no listings yet
                        </h2>


                        <p>
                            Start selling on Obaaratech by
                            creating your first listing.
                        </p>


                        <Link
                            to="/create-listing"
                            className="create-listing-button"
                        >

                            <Plus
                                size={19}
                            />

                            Create Your First Listing

                        </Link>

                    </div>

                )}


            {/* =================================================
                LISTINGS
            ================================================= */}

            {!loading &&
                listings.length > 0 && (

                    <div className="my-listings-grid">

                        {listings.map(
                            listing => (

                                <article
                                    className="seller-listing-card"
                                    key={listing.id}
                                >


                                    {/* IMAGE */}

                                    <div className="seller-listing-image">

                                        {listing.images?.length > 0 ? (

                                            <img
                                                src={
                                                    listing.images[0].url.startsWith(
                                                        "http"
                                                    )
                                                        ? listing.images[0].url
                                                        : `http://localhost:5000${listing.images[0].url}`
                                                }
                                                alt={
                                                    listing.title
                                                }
                                            />

                                        ) : (

                                            <div className="seller-listing-no-image">

                                                <ShoppingBag
                                                    size={35}
                                                />

                                            </div>

                                        )}


                                        {listing.featured && (

                                            <span className="seller-listing-featured">

                                                Featured

                                            </span>

                                        )}

                                    </div>


                                    {/* CONTENT */}

                                    <div className="seller-listing-content">

                                        <div className="seller-listing-meta">

                                            <span>
                                                {
                                                    listing.type ||
                                                    "PRODUCT"
                                                }
                                            </span>


                                            {listing.category && (

                                                <span>
                                                    {
                                                        listing.category.name
                                                    }
                                                </span>

                                            )}

                                        </div>


                                        <h2>

                                            {listing.title}

                                        </h2>


                                        <p className="seller-listing-location">

                                            {listing.location ||
                                                "Location not specified"}

                                        </p>


                                        <strong className="seller-listing-price">

                                            {formatPrice(
                                                listing.price
                                            )}

                                        </strong>


                                        <div className="seller-listing-status">

                                            <span
                                                className={
                                                    listing.status === "SOLD"
                                                        ? "status-sold"
                                                        : listing.available === false
                                                            ? "status-unavailable"
                                                            : "status-active"
                                                }
                                            >

                                                {listing.status === "SOLD"
                                                    ? "Sold"
                                                    : listing.available === false
                                                        ? "Unavailable"
                                                        : "Active"}

                                            </span>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="seller-listing-actions">


                                        {/* VIEW */}

                                        <button
                                            type="button"
                                            className="seller-action-button view"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${listing.id}`
                                                )
                                            }
                                        >

                                            <Eye
                                                size={17}
                                            />

                                            View

                                        </button>


                                        {/* EDIT */}

                                        <button
                                            type="button"
                                            className="seller-action-button edit"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${listing.id}?edit=true`
                                                )
                                            }
                                        >

                                            <Pencil
                                                size={17}
                                            />

                                            Edit

                                        </button>


                                        {/* SOLD */}

                                        {listing.status !== "SOLD" && (

                                            <button
                                                type="button"
                                                className="seller-action-button sold"
                                                disabled={
                                                    actionId ===
                                                    `sold-${listing.id}`
                                                }
                                                onClick={() =>
                                                    handleMarkSold(
                                                        listing
                                                    )
                                                }
                                            >

                                                {actionId ===
                                                    `sold-${listing.id}` ? (

                                                    <Loader2
                                                        size={17}
                                                        className="spinning"
                                                    />

                                                ) : (

                                                    <CheckCircle2
                                                        size={17}
                                                    />

                                                )}

                                                Sold

                                            </button>

                                        )}


                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            className="seller-action-button delete"
                                            disabled={
                                                actionId ===
                                                `delete-${listing.id}`
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    listing
                                                )
                                            }
                                        >

                                            {actionId ===
                                                `delete-${listing.id}` ? (

                                                <Loader2
                                                    size={17}
                                                    className="spinning"
                                                />

                                            ) : (

                                                <Trash2
                                                    size={17}
                                                />

                                            )}

                                            Delete

                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

        </main>

    );

}