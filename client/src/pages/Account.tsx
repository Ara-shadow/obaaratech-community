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
    Mail,
    LogOut,
    ChevronRight,
    Loader2,
    Clock3,
    Phone,
    Heart,
    Settings,
    Store
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

// Extend AuthUser type locally
interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
}

export default function Account() {

    const { user, logout } = useAuth() as { user: AuthUser | null; logout: () => void };

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD SELLER LISTINGS
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadListings() {

            try {
                const data = await getMySellerListings();
                if (mounted) {
                    setListings(data);
                }
            } catch (error) {
                console.error("Account listings error:", error);
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
    // LOGOUT
    // =====================================================

    function handleLogout() {
        logout();
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="account-page-wrapper">

            <div className="account-page-container">

                {/* HEADER */}
                <div className="account-page-header">

                    <div className="account-page-user">
                        <div className="account-page-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h1>Hello, {user?.name || "User"}!</h1>
                            <p>Manage your Obaaratech account</p>
                        </div>
                    </div>

                    <button
                        className="account-page-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>

                </div>

                {/* USER INFO */}
                <div className="account-page-info">

                    <div className="account-page-info-item">
                        <Mail size={18} />
                        <div>
                            <span>Email</span>
                            <strong>{user?.email || "Not available"}</strong>
                        </div>
                    </div>

                    <div className="account-page-info-item">
                        <User size={18} />
                        <div>
                            <span>Role</span>
                            <strong>{user?.role || "USER"}</strong>
                        </div>
                    </div>

                    <div className="account-page-info-item">
                        <Phone size={18} />
                        <div>
                            <span>Phone <span className="required-field">(Required)</span></span>
                            <strong>
                                {user?.phone ? (
                                    user.phone
                                ) : (
                                    <span className="missing-phone">Not provided – Add phone in Profile</span>
                                )}
                            </strong>
                        </div>
                    </div>

                </div>

                {/* STATS */}
                <div className="account-page-stats">

                    <div className="account-page-stat">
                        <div className="account-page-stat-icon blue">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <span>Total Listings</span>
                            <strong>{loading ? "..." : totalListings}</strong>
                        </div>
                    </div>

                    <div className="account-page-stat">
                        <div className="account-page-stat-icon green">
                            <PackageCheck size={20} />
                        </div>
                        <div>
                            <span>Active</span>
                            <strong>{loading ? "..." : activeListings}</strong>
                        </div>
                    </div>

                    <div className="account-page-stat">
                        <div className="account-page-stat-icon orange">
                            <PackageCheck size={20} />
                        </div>
                        <div>
                            <span>Sold</span>
                            <strong>{loading ? "..." : soldListings}</strong>
                        </div>
                    </div>

                </div>

                {/* QUICK ACTIONS */}
                <div className="account-page-section">

                    <h2>Quick Actions</h2>

                    <div className="account-page-actions">

                        <Link to="/my-listings" className="account-page-action">
                            <div className="account-page-action-icon blue">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <strong>My Listings</strong>
                                <span>Manage your products</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>

                        <Link to="/create-listing" className="account-page-action">
                            <div className="account-page-action-icon green">
                                <Plus size={20} />
                            </div>
                            <div>
                                <strong>Create Listing</strong>
                                <span>Sell a product or service</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>

                        <Link to="/favourites" className="account-page-action">
                            <div className="account-page-action-icon red">
                                <Heart size={20} />
                            </div>
                            <div>
                                <strong>Favourites</strong>
                                <span>View saved items</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>

                        <Link to="/profile" className="account-page-action">
                            <div className="account-page-action-icon purple">
                                <Settings size={20} />
                            </div>
                            <div>
                                <strong>Profile</strong>
                                <span>Update your information</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>

                        <Link to="/seller-dashboard" className="account-page-action">
                            <div className="account-page-action-icon orange">
                                <Store size={20} />
                            </div>
                            <div>
                                <strong>Seller Dashboard</strong>
                                <span>Track sales & earnings</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>

                        <Link to="/business-hours" className="account-page-action">
                            <div className="account-page-action-icon teal">
                                <Clock3 size={20} />
                            </div>
                            <div>
                                <strong>Business Hours</strong>
                                <span>Set your availability</span>
                            </div>
                            <ChevronRight size={16} />
                        </Link>

                    </div>

                </div>

                {/* RECENT LISTINGS */}
                <div className="account-page-section">

                    <div className="account-page-section-header">
                        <h2>Recent Listings</h2>
                        <Link to="/my-listings">View All <ChevronRight size={16} /></Link>
                    </div>

                    {loading ? (

                        <div className="account-page-loading">
                            <Loader2 size={24} className="spinning" />
                            <span>Loading...</span>
                        </div>

                    ) : listings.length === 0 ? (

                        <div className="account-page-empty">
                            <ShoppingBag size={40} />
                            <h3>No listings yet</h3>
                            <p>Create your first listing to start selling.</p>
                            <Link to="/create-listing" className="btn-primary">
                                <Plus size={18} />
                                Create Listing
                            </Link>
                        </div>

                    ) : (

                        <div className="account-page-listings">

                            {listings.slice(0, 3).map(listing => (

                                <Link
                                    key={listing.id}
                                    to={`/product/${listing.id}`}
                                    className="account-page-listing"
                                >

                                    <div className="account-page-listing-image">
                                        {listing.images?.length > 0 ? (
                                            <img
                                                src={
                                                    listing.images[0].url.startsWith("http")
                                                        ? listing.images[0].url
                                                        : `http://localhost:5000${listing.images[0].url}`
                                                }
                                                alt={listing.title}
                                            />
                                        ) : (
                                            <ShoppingBag size={20} />
                                        )}
                                    </div>

                                    <div className="account-page-listing-info">
                                        <strong>{listing.title}</strong>
                                        <span>{listing.location || "Location not specified"}</span>
                                        <span className={`account-page-listing-status ${
                                            listing.status === "SOLD" ? "sold" : "active"
                                        }`}>
                                            {listing.status === "SOLD" ? "Sold" : "Active"}
                                        </span>
                                    </div>

                                    <ChevronRight size={18} />

                                </Link>

                            ))}

                        </div>

                    )}

                </div>

                {/* PHONE REMINDER */}
                {!user?.phone && (
                    <div className="account-page-phone-reminder">
                        <Phone size={18} className="account-page-phone-reminder-icon" />
                        <div>
                            <strong>Complete Your Profile</strong>
                            <p>
                                Add your phone number in <Link to="/profile">Profile Settings</Link> so customers can contact you via WhatsApp.
                            </p>
                        </div>
                        <Link to="/profile" className="account-page-phone-reminder-btn">
                            Update Now
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                )}

            </div>

        </div>

    );

}