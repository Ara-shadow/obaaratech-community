import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    User,
    ShoppingBag,
    Plus,
    PackageCheck,
    MapPin,
    Mail,
    LogOut,
    ChevronRight,
    Loader2
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";

import {
    getMySellerListings
} from "../api/sellerListings";

import type {
    Listing
} from "../types/listing";


export default function Account() {

    const {
        user,
        logout
    } = useAuth();


    const [
        listings,
        setListings
    ] = useState<Listing[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    // =====================================================
    // LOAD SELLER LISTINGS
    // =====================================================

    useEffect(() => {

        let mounted = true;


        async function loadListings() {

            try {

                const data =
                    await getMySellerListings();


                if (mounted) {

                    setListings(
                        data
                    );

                }

            } catch (error) {

                console.error(
                    "Account listings error:",
                    error
                );

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

    const totalListings =
        listings.length;


    const activeListings =
        listings.filter(
            listing =>
                listing.status !== "SOLD" &&
                listing.available !== false
        ).length;


    const soldListings =
        listings.filter(
            listing =>
                listing.status === "SOLD"
        ).length;


    // =====================================================
    // LOGOUT
    // =====================================================

    function handleLogout() {

        logout();

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="account-page">

            <div className="account-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="account-header">

                    <div className="account-profile">

                        <div className="account-avatar">

                            <User
                                size={30}
                            />

                        </div>


                        <div>

                            <h1>
                                Welcome, {user?.name || "User"}
                            </h1>


                            <p>
                                Manage your Obaaratech account
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="account-logout-button"
                        onClick={handleLogout}
                    >

                        <LogOut
                            size={17}
                        />

                        Logout

                    </button>

                </section>


                {/* =================================================
                    USER INFORMATION
                ================================================= */}

                <section className="account-info-card">

                    <div className="account-info-item">

                        <Mail
                            size={19}
                        />

                        <div>

                            <span>
                                Email
                            </span>

                            <strong>
                                {user?.email || "Not available"}
                            </strong>

                        </div>

                    </div>


                    <div className="account-info-item">

                        <User
                            size={19}
                        />

                        <div>

                            <span>
                                Account Role
                            </span>

                            <strong>
                                {user?.role || "USER"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SELLER STATISTICS
                ================================================= */}

                <section className="account-statistics">

                    <div className="account-stat-card">

                        <div className="account-stat-icon">

                            <ShoppingBag
                                size={22}
                            />

                        </div>


                        <div>

                            <span>
                                Total Listings
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : totalListings}
                            </strong>

                        </div>

                    </div>


                    <div className="account-stat-card">

                        <div className="account-stat-icon">

                            <PackageCheck
                                size={22}
                            />

                        </div>


                        <div>

                            <span>
                                Active
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : activeListings}
                            </strong>

                        </div>

                    </div>


                    <div className="account-stat-card">

                        <div className="account-stat-icon">

                            <PackageCheck
                                size={22}
                            />

                        </div>


                        <div>

                            <span>
                                Sold
                            </span>

                            <strong>
                                {loading
                                    ? "..."
                                    : soldListings}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="account-section">

                    <h2>
                        Quick Actions
                    </h2>


                    <div className="account-actions-grid">


                        <Link
                            to="/my-listings"
                            className="account-action-card"
                        >

                            <ShoppingBag
                                size={24}
                            />


                            <div>

                                <strong>
                                    My Listings
                                </strong>

                                <span>
                                    Manage your products and services
                                </span>

                            </div>


                            <ChevronRight
                                size={19}
                            />

                        </Link>


                        <Link
                            to="/create-listing"
                            className="account-action-card"
                        >

                            <Plus
                                size={24}
                            />


                            <div>

                                <strong>
                                    Create Listing
                                </strong>

                                <span>
                                    Sell a product or service
                                </span>

                            </div>


                            <ChevronRight
                                size={19}
                            />

                        </Link>


                        <Link
                            to="/"
                            className="account-action-card"
                        >

                            <MapPin
                                size={24}
                            />


                            <div>

                                <strong>
                                    Browse Marketplace
                                </strong>

                                <span>
                                    Discover products and services
                                </span>

                            </div>


                            <ChevronRight
                                size={19}
                            />

                        </Link>


                    </div>

                </section>


                {/* =================================================
                    RECENT LISTINGS
                ================================================= */}

                <section className="account-section">

                    <div className="account-section-header">

                        <h2>
                            Your Recent Listings
                        </h2>


                        <Link to="/my-listings">

                            View All

                            <ChevronRight
                                size={17}
                            />

                        </Link>

                    </div>


                    {loading ? (

                        <div className="account-loading">

                            <Loader2
                                size={24}
                                className="spinning"
                            />

                            <span>
                                Loading listings...
                            </span>

                        </div>

                    ) : listings.length === 0 ? (

                        <div className="account-empty">

                            <ShoppingBag
                                size={34}
                            />


                            <h3>
                                No listings yet
                            </h3>


                            <p>
                                Create your first listing and
                                start selling on Obaaratech.
                            </p>


                            <Link
                                to="/create-listing"
                                className="create-listing-button"
                            >

                                <Plus
                                    size={18}
                                />

                                Create Listing

                            </Link>

                        </div>

                    ) : (

                        <div className="account-listings">

                            {listings
                                .slice(0, 3)
                                .map(
                                    listing => (

                                        <Link
                                            key={listing.id}
                                            to={`/product/${listing.id}`}
                                            className="account-listing-row"
                                        >

                                            <div className="account-listing-image">

                                                {listing.images?.length > 0 ? (

                                                    <img
                                                        src={
                                                            listing.images[0].url.startsWith(
                                                                "http"
                                                            )
                                                                ? listing.images[0].url
                                                                : `http://localhost:5000${listing.images[0].url}`
                                                        }
                                                        alt={listing.title}
                                                    />

                                                ) : (

                                                    <ShoppingBag
                                                        size={25}
                                                    />

                                                )}

                                            </div>


                                            <div className="account-listing-details">

                                                <strong>
                                                    {listing.title}
                                                </strong>


                                                <span>
                                                    {listing.location ||
                                                        "Location not specified"}
                                                </span>

                                            </div>


                                            <ChevronRight
                                                size={19}
                                            />

                                        </Link>

                                    )
                                )}

                        </div>

                    )}

                </section>


            </div>

        </main>

    );

}