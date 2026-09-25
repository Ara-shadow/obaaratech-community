import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, LogIn, UserPlus, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Fallback banners (used when API is not available)
const fallbackBanners = [
    { id: "1", title: "Flash Sale!", description: "iPhone 15 Pro", price: 899000, emoji: "🔥", isActive: true, displayOrder: 0, createdAt: "", updatedAt: "" },
    { id: "2", title: "New Arrival", description: "Samsung Galaxy S24", price: 780000, emoji: "🚀", isActive: true, displayOrder: 1, createdAt: "", updatedAt: "" },
    { id: "3", title: "Limited Offer", description: "MacBook Pro", price: 1200000, emoji: "⚡", isActive: true, displayOrder: 2, createdAt: "", updatedAt: "" },
    { id: "4", title: "Best Deal", description: "Sony Headphones", price: 45000, emoji: "🎯", isActive: true, displayOrder: 3, createdAt: "", updatedAt: "" },
    { id: "5", title: "Discount", description: "Smart Watch", price: 35000, emoji: "🏷️", isActive: true, displayOrder: 4, createdAt: "", updatedAt: "" },
    { id: "6", title: "Trending", description: "Tecno Camon 20", price: 220000, emoji: "📱", isActive: true, displayOrder: 5, createdAt: "", updatedAt: "" },
];

export default function Navbar() {
    const { user } = useAuth();
    const { cart } = useCart();
    const [banners] = useState(fallbackBanners);

    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    // Format price for display
    const formatPrice = (price?: number) => {
        if (!price) return "";
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Render banner items (duplicate for seamless scrolling)
    const renderBannerItems = () => {
        if (banners.length === 0) {
            return (
                <span className="scrolling-banner-item">
                    <span className="dot" />
                    🛍️ <strong>Welcome to Obaaratech!</strong> Discover amazing deals
                </span>
            );
        }

        // Create two copies for seamless scrolling
        const items = [...banners, ...banners];
        return items.map((banner, index) => (
            <span key={`${banner.id}-${index}`} className="scrolling-banner-item">
                <span className="dot" />
                {banner.emoji || "🛍️"} <strong>{banner.title}</strong>
                {banner.description && ` ${banner.description}`}
                {banner.price && (
                    <span className="price">{formatPrice(banner.price)}</span>
                )}
            </span>
        ));
    };

    return (
        <header className="site-header">
            <div className="navbar-main">
                <div className="navbar-container">

                    {/* Logo */}
                    <Link to="/" className="navbar-brand">
                        <span className="navbar-logo-text">
                            Obaara<span>tech</span>
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="navbar-search">
                        <input type="text" placeholder="Search products, services..." />
                        <button>
                            <Search size={18} />
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="navbar-actions">
                        {user ? (
                            <Link to="/account" className="navbar-account">
                                <span className="label">Hello, {user.name}</span>
                                <span className="value">Account</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="navbar-account">
                                <span className="label">Hello, Sign in</span>
                                <span className="value">Account</span>
                            </Link>
                        )}

                        <Link to="/orders" className="navbar-orders">
                            <span className="label">Returns</span>
                            <span className="value">& Orders</span>
                        </Link>

                        <Link to="/cart" className="navbar-cart">
                            <span className="icon-wrap">
                                <ShoppingBag className="cart-icon" />
                                {cartCount > 0 && (
                                    <span className="cart-count">{cartCount}</span>
                                )}
                            </span>
                            <span className="cart-label">Cart</span>
                        </Link>

                        {!user && (
                            <div className="auth-buttons">
                                <Link to="/login" className="login-btn">
                                    <LogIn size={16} />
                                    Login
                                </Link>
                                <Link to="/register" className="register-btn">
                                    <UserPlus size={16} />
                                    Register
                                </Link>
                            </div>
                        )}

                        <Link to="/create-listing" className="navbar-sell-btn">
                            <Plus size={16} />
                            Sell
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="mobile-actions">
                        <Link to="/cart" className="mobile-cart-btn">
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </Link>
                        <button className="mobile-menu-btn">
                            <Menu size={22} />
                        </button>
                    </div>

                </div>
            </div>

            {/* =========================================================
                SCROLLING BANNER
            ========================================================= */}
            <div className="scrolling-banner">
                <div className="scrolling-banner-track">
                    {renderBannerItems()}
                </div>
            </div>

        </header>
    );
}