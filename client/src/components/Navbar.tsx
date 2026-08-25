import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Menu,
    X,
    Search,
    Heart,
    ShoppingCart,
    User,
    Store,
    LayoutDashboard,
    Package,
    LogOut,
    ChevronDown
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";


export default function Navbar() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();


    const {
        itemCount
    } = useCart();


    const [
        search,
        setSearch
    ] = useState("");


    const [
        mobileOpen,
        setMobileOpen
    ] = useState(false);


    const [
        accountOpen,
        setAccountOpen
    ] = useState(false);


    function handleSearch(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        const value =
            search.trim();


        setMobileOpen(false);


        if (!value) {

            navigate("/marketplace");

            return;

        }


        navigate(
            `/marketplace?search=${encodeURIComponent(value)}`
        );

    }


    function handleLogout() {

        setAccountOpen(false);

        setMobileOpen(false);

        logout();

        navigate("/");

    }


    function closeMenus() {

        setMobileOpen(false);

        setAccountOpen(false);

    }


    function isActive(
        path: string
    ) {

        if (
            path === "/marketplace"
        ) {

            return (
                location.pathname === "/" ||
                location.pathname === "/marketplace"
            );

        }


        return location.pathname === path;

    }


    return (

        <header className="site-header">

            {/* =====================================================
                MAIN NAVIGATION
            ===================================================== */}

            <div className="navbar-main">

                <div className="navbar-container">


                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <Link
                        to="/"
                        className="navbar-brand"
                        onClick={closeMenus}
                        aria-label="Obaaratech Community Marketplace home"
                    >

                        <img
                            src="/logo.jpg"
                            alt="Obaaratech Community Marketplace"
                            className="navbar-logo"
                        />

                    </Link>


                    {/* =================================================
                        DESKTOP SEARCH
                    ================================================= */}

                    <form
                        className="navbar-search"
                        onSubmit={handleSearch}
                    >

                        <Search
                            size={20}
                            strokeWidth={2}
                            className="navbar-search-icon"
                        />


                        <input
                            type="search"
                            value={search}
                            onChange={
                                event =>
                                    setSearch(
                                        event.target.value
                                    )
                            }
                            placeholder="Search products, services, jobs and more"
                            aria-label="Search marketplace"
                        />


                        <button
                            type="submit"
                            aria-label="Search"
                        >

                            Search

                        </button>

                    </form>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}

                    <nav
                        className="desktop-navigation"
                        aria-label="Main navigation"
                    >

                        <Link
                            to="/marketplace"
                            className={
                                `navbar-link ${
                                    isActive("/marketplace")
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            Marketplace

                        </Link>


                        {isAuthenticated && (

                            <Link
                                to="/favourites"
                                className={
                                    `navbar-link ${
                                        isActive("/favourites")
                                            ? "active"
                                            : ""
                                    }`
                                }
                            >

                                <Heart
                                    size={18}
                                />

                                <span>
                                    Favourites
                                </span>

                            </Link>

                        )}


                        <Link
                            to="/cart"
                            className={
                                `navbar-cart-link ${
                                    isActive("/cart")
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <span className="navbar-icon-wrap">

                                <ShoppingCart
                                    size={20}
                                />

                                {itemCount > 0 && (

                                    <span className="cart-count">

                                        {itemCount}

                                    </span>

                                )}

                            </span>

                            <span>
                                Cart
                            </span>

                        </Link>


                        {/* =================================================
                            ACCOUNT
                        ================================================= */}

                        {isAuthenticated ? (

                            <div
                                className="account-menu-wrapper"
                            >

                                <button
                                    type="button"
                                    className="account-menu-trigger"
                                    onClick={() =>
                                        setAccountOpen(
                                            current =>
                                                !current
                                        )
                                    }
                                    aria-expanded={
                                        accountOpen
                                    }
                                >

                                    <span className="account-avatar">

                                        <User
                                            size={17}
                                        />

                                    </span>


                                    <span className="account-name">

                                        {user?.name ||
                                            "Account"}

                                    </span>


                                    <ChevronDown
                                        size={16}
                                        className={
                                            accountOpen
                                                ? "rotate-180"
                                                : ""
                                        }
                                    />

                                </button>


                                {accountOpen && (

                                    <div
                                        className="account-dropdown"
                                    >

                                        <div className="account-dropdown-header">

                                            <div className="account-dropdown-avatar">

                                                <User
                                                    size={22}
                                                />

                                            </div>


                                            <div>

                                                <strong>
                                                    {user?.name ||
                                                        "Account"}
                                                </strong>

                                                <span>
                                                    My Obaaratech account
                                                </span>

                                            </div>

                                        </div>


                                        <div className="account-dropdown-divider" />


                                        <Link
                                            to="/account"
                                            onClick={
                                                () =>
                                                    setAccountOpen(
                                                        false
                                                    )
                                            }
                                        >

                                            <User
                                                size={17}
                                            />

                                            Account

                                        </Link>


                                        <Link
                                            to="/profile"
                                            onClick={
                                                () =>
                                                    setAccountOpen(
                                                        false
                                                    )
                                            }
                                        >

                                            <User
                                                size={17}
                                            />

                                            My Profile

                                        </Link>


                                        <Link
                                            to="/my-listings"
                                            onClick={
                                                () =>
                                                    setAccountOpen(
                                                        false
                                                    )
                                            }
                                        >

                                            <Package
                                                size={17}
                                            />

                                            My Listings

                                        </Link>


                                        <Link
                                            to="/seller-dashboard"
                                            onClick={
                                                () =>
                                                    setAccountOpen(
                                                        false
                                                    )
                                            }
                                        >

                                            <LayoutDashboard
                                                size={17}
                                            />

                                            Seller Dashboard

                                        </Link>


                                        <div className="account-dropdown-divider" />


                                        <button
                                            type="button"
                                            className="dropdown-logout"
                                            onClick={
                                                handleLogout
                                            }
                                        >

                                            <LogOut
                                                size={17}
                                            />

                                            Logout

                                        </button>

                                    </div>

                                )}

                            </div>

                        ) : (

                            <div className="auth-actions">

                                <Link
                                    to="/login"
                                    className="login-link"
                                >

                                    Login

                                </Link>


                                <Link
                                    to="/register"
                                    className="register-link"
                                >

                                    Create Account

                                </Link>

                            </div>

                        )}


                        {/* =================================================
                            SELL BUTTON
                        ================================================= */}

                        <Link
                            to="/create-listing"
                            className="navbar-sell-button"
                        >

                            <Store
                                size={18}
                            />

                            <span>
                                Sell
                            </span>

                        </Link>

                    </nav>


                    {/* =================================================
                        MOBILE ACTIONS
                    ================================================= */}

                    <div className="mobile-navbar-actions">

                        <Link
                            to="/cart"
                            className="mobile-cart-button"
                            onClick={closeMenus}
                            aria-label="Shopping cart"
                        >

                            <span className="navbar-icon-wrap">

                                <ShoppingCart
                                    size={22}
                                />

                                {itemCount > 0 && (

                                    <span className="cart-count">

                                        {itemCount}

                                    </span>

                                )}

                            </span>

                        </Link>


                        <button
                            type="button"
                            className="mobile-menu-button"
                            onClick={() =>
                                setMobileOpen(
                                    current =>
                                        !current
                                )
                            }
                            aria-label={
                                mobileOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={
                                mobileOpen
                            }
                        >

                            {mobileOpen ? (

                                <X
                                    size={25}
                                />

                            ) : (

                                <Menu
                                    size={25}
                                />

                            )}

                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                DESKTOP CATEGORY BAR
            ===================================================== */}

            <div className="category-navigation">

                <div className="navbar-container">

                    <Link
                        to="/marketplace"
                        className="category-navigation-all"
                    >

                        <Menu
                            size={18}
                        />

                        All Categories

                    </Link>


                    <div className="category-navigation-links">

                        <Link to="/marketplace">
                            Electronics
                        </Link>

                        <Link to="/marketplace">
                            Fashion
                        </Link>

                        <Link to="/marketplace">
                            Phones & Tablets
                        </Link>

                        <Link to="/marketplace">
                            Home & Living
                        </Link>

                        <Link to="/marketplace">
                            Vehicles
                        </Link>

                        <Link to="/marketplace">
                            Services
                        </Link>

                        <Link to="/marketplace">
                            Jobs
                        </Link>

                    </div>


                    {/* =================================================
                        FUTURE SPONSORED SLOT
                    ================================================= */}

                    <div
                        className="future-sponsored-slot"
                        aria-label="Reserved sponsored placement"
                    >

                        Sponsored space

                    </div>

                </div>

            </div>


            {/* =====================================================
                MOBILE NAVIGATION
            ================================================= */}

            {mobileOpen && (

                <div className="mobile-navigation">

                    <div className="mobile-navigation-inner">


                        {/* =================================================
                            MOBILE SEARCH
                        ================================================= */}

                        <form
                            className="mobile-search"
                            onSubmit={handleSearch}
                        >

                            <Search
                                size={19}
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={
                                    event =>
                                        setSearch(
                                            event.target.value
                                        )
                                }
                                placeholder="Search marketplace"
                                aria-label="Search marketplace"
                            />

                            <button
                                type="submit"
                            >

                                Search

                            </button>

                        </form>


                        {/* =================================================
                            PRIMARY LINKS
                        ================================================= */}

                        <div className="mobile-nav-section">

                            <span className="mobile-nav-heading">
                                Marketplace
                            </span>


                            <Link
                                to="/marketplace"
                                className={
                                    isActive(
                                        "/marketplace"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={closeMenus}
                            >

                                <Store
                                    size={19}
                                />

                                Marketplace

                            </Link>


                            {isAuthenticated && (

                                <Link
                                    to="/favourites"
                                    className={
                                        isActive(
                                            "/favourites"
                                        )
                                            ? "active"
                                            : ""
                                    }
                                    onClick={closeMenus}
                                >

                                    <Heart
                                        size={19}
                                    />

                                    Favourites

                                </Link>

                            )}


                            <Link
                                to="/cart"
                                className={
                                    isActive(
                                        "/cart"
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={closeMenus}
                            >

                                <ShoppingCart
                                    size={19}
                                />

                                Cart

                                {itemCount > 0 && (

                                    <span className="mobile-link-badge">

                                        {itemCount}

                                    </span>

                                )}

                            </Link>

                        </div>


                        {/* =================================================
                            SELLER
                        ================================================= */}

                        <div className="mobile-nav-section">

                            <span className="mobile-nav-heading">
                                Selling
                            </span>


                            <Link
                                to="/create-listing"
                                onClick={closeMenus}
                            >

                                <Store
                                    size={19}
                                />

                                Sell an Item

                            </Link>


                            {isAuthenticated && (

                                <>

                                    <Link
                                        to="/my-listings"
                                        onClick={closeMenus}
                                    >

                                        <Package
                                            size={19}
                                        />

                                        My Listings

                                    </Link>


                                    <Link
                                        to="/seller-dashboard"
                                        onClick={closeMenus}
                                    >

                                        <LayoutDashboard
                                            size={19}
                                        />

                                        Seller Dashboard

                                    </Link>

                                </>

                            )}

                        </div>


                        {/* =================================================
                            ACCOUNT
                        ================================================= */}

                        <div className="mobile-nav-section">

                            <span className="mobile-nav-heading">
                                Account
                            </span>


                            {isAuthenticated ? (

                                <>

                                    <Link
                                        to="/account"
                                        onClick={closeMenus}
                                    >

                                        <User
                                            size={19}
                                        />

                                        Account

                                    </Link>


                                    <Link
                                        to="/profile"
                                        onClick={closeMenus}
                                    >

                                        <User
                                            size={19}
                                        />

                                        My Profile

                                    </Link>


                                    <button
                                        type="button"
                                        className="mobile-logout"
                                        onClick={
                                            handleLogout
                                        }
                                    >

                                        <LogOut
                                            size={19}
                                        />

                                        Logout

                                    </button>

                                </>

                            ) : (

                                <>

                                    <Link
                                        to="/login"
                                        onClick={closeMenus}
                                    >

                                        <User
                                            size={19}
                                        />

                                        Login

                                    </Link>


                                    <Link
                                        to="/register"
                                        onClick={closeMenus}
                                    >

                                        <User
                                            size={19}
                                        />

                                        Create Account

                                    </Link>

                                </>

                            )}

                        </div>


                        {/* =================================================
                            MOBILE SELL CTA
                        ================================================= */}

                        <Link
                            to="/create-listing"
                            className="mobile-sell-button"
                            onClick={closeMenus}
                        >

                            <Store
                                size={19}
                            />

                            Start Selling

                        </Link>


                        {/* =================================================
                            FUTURE ADVERTISEMENT AREA
                        ================================================= */}

                        <div className="mobile-sponsored-slot">

                            <span>
                                Sponsored placement
                            </span>

                            <small>
                                Reserved for future marketplace promotions
                            </small>

                        </div>

                    </div>

                </div>

            )}

        </header>

    );

}