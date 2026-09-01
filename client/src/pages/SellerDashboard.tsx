import {
    useEffect,
    useState,
    useMemo
} from "react";

import {
    Link
} from "react-router-dom";

import {
    Package,
    ShoppingBag,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus,
    Eye,
    DollarSign,
    ChevronRight,
    CreditCard,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    BarChart3,
    Users
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMySellerListings } from "../api/sellerListings";
import { getSellerOrders } from "../api/orders";
import { getSellerBalance } from "../api/sellerFinance";
import type { Listing } from "../types/listing";
import type { Order } from "../api/orders";
import type { SellerBalance } from "../api/sellerFinance";

// ============================================================
// SELLER DASHBOARD – BEAUTIFUL & WELL-ARRANGED
// ============================================================

export default function SellerDashboard() {

    const { user } = useAuth();

    // =====================================================
    // STATE
    // =====================================================

    const [listings, setListings] = useState<Listing[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [balance, setBalance] = useState<SellerBalance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        let mounted = true;

        async function loadDashboardData() {

            try {
                setLoading(true);
                setError("");

                const [listingsData, ordersData, balanceData] = await Promise.all([
                    getMySellerListings(),
                    getSellerOrders(),
                    getSellerBalance().catch(() => null)
                ]);

                if (!mounted) return;

                setListings(listingsData);
                setOrders(ordersData);
                setBalance(balanceData);

            } catch (requestError: any) {
                console.error("Dashboard loading error:", requestError);
                if (mounted) {
                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load your dashboard."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }

        }

        loadDashboardData();

        return () => {
            mounted = false;
        };

    }, []);

    // =====================================================
    // DERIVED DATA
    // =====================================================

    const totalListings = listings.length;

    const activeListings = useMemo(() => {
        return listings.filter(
            listing => listing.status !== "SOLD" && listing.available !== false
        ).length;
    }, [listings]);

    const pendingOrders = useMemo(() => {
        return orders.filter(
            order => order.status === "PENDING" || order.status === "CONFIRMED"
        ).length;
    }, [orders]);

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [orders]);

    const totalRevenue = useMemo(() => {
        return orders
            .filter(order => order.status === "DELIVERED")
            .reduce((sum, order) => sum + order.total, 0);
    }, [orders]);

    // Average rating - would come from reviews
    const averageRating = 4.8;

    // =====================================================
    // FORMAT PRICE
    // =====================================================

    function formatPrice(price: number) {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(price);
    }

    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(date: string) {
        return new Intl.DateTimeFormat("en-NG", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(date));
    }

    // =====================================================
    // STATUS LABEL
    // =====================================================

    function getOrderStatusBadge(status: string) {

        const statusMap: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
            PENDING: {
                label: "Pending",
                className: "badge-warning",
                icon: <Clock size={12} />
            },
            CONFIRMED: {
                label: "Confirmed",
                className: "badge-info",
                icon: <CheckCircle size={12} />
            },
            PROCESSING: {
                label: "Processing",
                className: "badge-info",
                icon: <Package size={12} />
            },
            READY: {
                label: "Ready",
                className: "badge-info",
                icon: <Package size={12} />
            },
            SHIPPED: {
                label: "Shipped",
                className: "badge-info",
                icon: <Package size={12} />
            },
            DELIVERED: {
                label: "Delivered",
                className: "badge-success",
                icon: <CheckCircle size={12} />
            },
            CANCELLED: {
                label: "Cancelled",
                className: "badge-error",
                icon: <XCircle size={12} />
            }
        };

        return statusMap[status] || {
            label: status,
            className: "badge",
            icon: null
        };

    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="seller-dashboard-loading">
                <div className="seller-dashboard-loading-spinner">
                    <div className="spinner" />
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="seller-dashboard-error">
                <div className="seller-dashboard-error-icon">⚠️</div>
                <h2>Unable to load dashboard</h2>
                <p>{error}</p>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="seller-dashboard-page">

            <div className="seller-dashboard-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="seller-dashboard-header">

                    <div className="seller-dashboard-header-left">

                        <div className="seller-dashboard-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div>
                            <h1>Welcome back, {user?.name || "Seller"}! 👋</h1>
                            <p>Here's what's happening with your business today.</p>
                        </div>

                    </div>

                    <div className="seller-dashboard-header-actions">

                        <Link
                            to="/create-listing"
                            className="btn-primary"
                        >
                            <Plus size={18} />
                            New Listing
                        </Link>

                        <Link
                            to="/my-listings"
                            className="btn-secondary"
                        >
                            <Package size={18} />
                            My Listings
                        </Link>

                    </div>

                </div>

                {/* =================================================
                    STATS CARDS
                ================================================= */}

                <div className="seller-dashboard-stats">

                    <div className="seller-stat-card">
                        <div className="seller-stat-card-icon revenue">
                            <DollarSign size={20} />
                        </div>
                        <div className="seller-stat-card-content">
                            <span className="seller-stat-card-label">Total Revenue</span>
                            <strong className="seller-stat-card-value">
                                {formatPrice(totalRevenue)}
                            </strong>
                            <span className="seller-stat-card-change positive">
                                ↑ 12% from last month
                            </span>
                        </div>
                    </div>

                    <div className="seller-stat-card">
                        <div className="seller-stat-card-icon orders">
                            <ShoppingBag size={20} />
                        </div>
                        <div className="seller-stat-card-content">
                            <span className="seller-stat-card-label">Total Orders</span>
                            <strong className="seller-stat-card-value">
                                {orders.length}
                            </strong>
                            <span className="seller-stat-card-change positive">
                                ↑ 8% from last month
                            </span>
                        </div>
                    </div>

                    <div className="seller-stat-card">
                        <div className="seller-stat-card-icon listings">
                            <Package size={20} />
                        </div>
                        <div className="seller-stat-card-content">
                            <span className="seller-stat-card-label">Active Listings</span>
                            <strong className="seller-stat-card-value">
                                {activeListings}
                            </strong>
                            <span className="seller-stat-card-sub">
                                {totalListings} total listings
                            </span>
                        </div>
                    </div>

                    <div className="seller-stat-card">
                        <div className="seller-stat-card-icon rating">
                            <Star size={20} />
                        </div>
                        <div className="seller-stat-card-content">
                            <span className="seller-stat-card-label">Rating</span>
                            <strong className="seller-stat-card-value">
                                {averageRating.toFixed(1)} ★
                            </strong>
                            <span className="seller-stat-card-sub">
                                Based on customer feedback
                            </span>
                        </div>
                    </div>

                </div>

                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="seller-dashboard-section">

                    <div className="seller-dashboard-section-header">
                        <h2>⚡ Quick Actions</h2>
                        <span className="seller-dashboard-section-subtitle">Manage your business</span>
                    </div>

                    <div className="seller-dashboard-actions">

                        <Link
                            to="/create-listing"
                            className="seller-action-card"
                        >
                            <div className="seller-action-card-icon blue">
                                <Plus size={24} />
                            </div>
                            <div className="seller-action-card-content">
                                <strong>Create Listing</strong>
                                <span>Sell a product or service</span>
                            </div>
                            <ChevronRight size={18} className="seller-action-card-arrow" />
                        </Link>

                        <Link
                            to="/my-listings"
                            className="seller-action-card"
                        >
                            <div className="seller-action-card-icon green">
                                <Package size={24} />
                            </div>
                            <div className="seller-action-card-content">
                                <strong>My Listings</strong>
                                <span>Manage your products</span>
                            </div>
                            <ChevronRight size={18} className="seller-action-card-arrow" />
                        </Link>

                        <Link
                            to="/seller-finance"
                            className="seller-action-card"
                        >
                            <div className="seller-action-card-icon gold">
                                <DollarSign size={24} />
                            </div>
                            <div className="seller-action-card-content">
                                <strong>Finance</strong>
                                <span>Track your earnings</span>
                            </div>
                            <ChevronRight size={18} className="seller-action-card-arrow" />
                        </Link>

                        <Link
                            to="/business-hours"
                            className="seller-action-card"
                        >
                            <div className="seller-action-card-icon purple">
                                <Clock size={24} />
                            </div>
                            <div className="seller-action-card-content">
                                <strong>Business Hours</strong>
                                <span>Set your availability</span>
                            </div>
                            <ChevronRight size={18} className="seller-action-card-arrow" />
                        </Link>

                    </div>

                </div>

                {/* =================================================
                    AVAILABLE BALANCE
                ================================================= */}

                {balance && (

                    <div className="seller-dashboard-balance">

                        <div className="seller-balance-card">

                            <div className="seller-balance-card-header">
                                <CreditCard size={20} className="seller-balance-icon" />
                                <span className="seller-balance-label">Available Balance</span>
                            </div>

                            <div className="seller-balance-amount">
                                {formatPrice(balance.availableBalance)}
                            </div>

                            <div className="seller-balance-details">

                                <div className="seller-balance-detail">
                                    <span>Pending</span>
                                    <strong>{formatPrice(balance.pendingBalance)}</strong>
                                </div>

                                <div className="seller-balance-detail">
                                    <span>Total Sales</span>
                                    <strong>{formatPrice(balance.totalSales)}</strong>
                                </div>

                            </div>

                            <Link
                                to="/seller-finance"
                                className="seller-balance-action"
                            >
                                View Financial Details
                                <ChevronRight size={16} />
                            </Link>

                        </div>

                    </div>

                )}

                {/* =================================================
                    RECENT ORDERS
                ================================================= */}

                <div className="seller-dashboard-section">

                    <div className="seller-dashboard-section-header">
                        <div>
                            <h2>📦 Recent Orders</h2>
                            {pendingOrders > 0 && (
                                <span className="seller-pending-badge">
                                    <AlertCircle size={14} />
                                    {pendingOrders} pending
                                </span>
                            )}
                        </div>
                        <Link to="/orders" className="seller-view-all">
                            View All
                            <ChevronRight size={16} />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (

                        <div className="seller-empty-state">
                            <div className="seller-empty-state-icon">
                                <ShoppingBag size={48} />
                            </div>
                            <h3>No orders yet</h3>
                            <p>When customers place orders, they'll appear here.</p>
                            <Link to="/create-listing" className="btn-primary">
                                <Plus size={18} />
                                Create Your First Listing
                            </Link>
                        </div>

                    ) : (

                        <div className="seller-orders-table-wrap">

                            <table className="seller-orders-table">

                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {recentOrders.map((order) => {

                                        const statusInfo = getOrderStatusBadge(order.status);
                                        const itemCount = order.items?.length || 0;

                                        return (

                                            <tr key={order.id}>
                                                <td className="seller-order-id">
                                                    <Link to={`/seller/orders/${order.id}`}>
                                                        #{order.orderNumber || order.id.slice(0, 8)}
                                                    </Link>
                                                </td>
                                                <td className="seller-order-customer">
                                                    {order.buyer?.name || "Customer"}
                                                </td>
                                                <td className="seller-order-items">
                                                    {itemCount} {itemCount === 1 ? "item" : "items"}
                                                </td>
                                                <td className="seller-order-total">
                                                    {formatPrice(order.total)}
                                                </td>
                                                <td>
                                                    <span className={`seller-order-status ${statusInfo.className}`}>
                                                        {statusInfo.icon}
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="seller-order-date">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="seller-order-action">
                                                    <Link
                                                        to={`/seller/orders/${order.id}`}
                                                        className="seller-order-view-btn"
                                                    >
                                                        <Eye size={15} />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                {/* =================================================
                    SELLER TIPS
                ================================================= */}

                <div className="seller-dashboard-tips">

                    <div className="seller-tips-card">
                        <div className="seller-tips-icon">
                            <Sparkles size={20} />
                        </div>
                        <div className="seller-tips-content">
                            <h4>💡 Seller Tip</h4>
                            <p>
                                {listings.length === 0
                                    ? "Create your first listing to start selling on Obaaratech!"
                                    : activeListings > 0
                                        ? "Great job! Your listings are active. Share them on social media for more visibility."
                                        : "Your listings are sold out. Create new listings to keep earning."
                                }
                            </p>
                        </div>
                    </div>

                    <div className="seller-tips-card">
                        <div className="seller-tips-icon blue">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="seller-tips-content">
                            <h4>🔒 Trust & Safety</h4>
                            <p>
                                Respond to customer inquiries quickly and maintain
                                accurate product descriptions to build trust.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    );

}