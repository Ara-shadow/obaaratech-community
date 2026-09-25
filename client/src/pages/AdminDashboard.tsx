import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FolderKanban,
    Landmark,
    ShieldCheck,
    Users,
    ShoppingBag,
    Package,
    DollarSign,
    Activity,
    ChevronRight,
    Sparkles,
    Image
} from "lucide-react";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats] = useState({
        totalUsers: 1247,
        totalListings: 342,
        totalOrders: 89,
        totalRevenue: 2845000,
        pendingOrders: 12,
        activeListings: 215,
        newUsersToday: 18,
        newListingsToday: 7
    });

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    function formatPrice(price: number) {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }).format(price);
    }

    const quickActions = [
        {
            title: "Category Manager",
            description: "Create, edit, and organize categories",
            href: "/admin/categories",
            icon: FolderKanban,
            accent: "cyan"
        },
        {
            title: "Settlement Review",
            description: "Verify funds and settlement requests",
            href: "/admin/settlements",
            icon: Landmark,
            accent: "emerald"
        },
        {
            title: "Commission & Balances",
            description: "Manage commission rates and balances",
            href: "/admin/finance",
            icon: ShieldCheck,
            accent: "indigo"
        },
        {
            title: "Banner Management",
            description: "Create and manage scrolling banners",
            href: "/admin/banners",
            icon: Image,
            accent: "purple"
        }
    ];

    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-dashboard-container">
                    <div className="admin-dashboard-loading">
                        <div className="admin-dashboard-loading-spinner" />
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-container">
                <div className="admin-dashboard-header">
                    <div className="admin-dashboard-header-left">
                        <div className="admin-dashboard-avatar">A</div>
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>
                                <span className="admin-dashboard-badge">
                                    <ShieldCheck size={14} />
                                    Admin
                                </span>
                                Welcome back, Administrator!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-stats">
                    <div className="admin-stat-card">
                        <div className="admin-stat-card-icon users">
                            <Users size={20} />
                        </div>
                        <div className="admin-stat-card-content">
                            <span className="admin-stat-card-label">Total Users</span>
                            <strong className="admin-stat-card-value">
                                {stats.totalUsers.toLocaleString()}
                            </strong>
                            <span className="admin-stat-card-change positive">
                                ↑ {stats.newUsersToday} new today
                            </span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-card-icon listings">
                            <Package size={20} />
                        </div>
                        <div className="admin-stat-card-content">
                            <span className="admin-stat-card-label">Total Listings</span>
                            <strong className="admin-stat-card-value">
                                {stats.totalListings.toLocaleString()}
                            </strong>
                            <span className="admin-stat-card-change positive">
                                ↑ {stats.newListingsToday} new today
                            </span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-card-icon orders">
                            <ShoppingBag size={20} />
                        </div>
                        <div className="admin-stat-card-content">
                            <span className="admin-stat-card-label">Total Orders</span>
                            <strong className="admin-stat-card-value">
                                {stats.totalOrders.toLocaleString()}
                            </strong>
                            <span className="admin-stat-card-change warning">
                                {stats.pendingOrders} pending
                            </span>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="admin-stat-card-icon revenue">
                            <DollarSign size={20} />
                        </div>
                        <div className="admin-stat-card-content">
                            <span className="admin-stat-card-label">Total Revenue</span>
                            <strong className="admin-stat-card-value">
                                {formatPrice(stats.totalRevenue)}
                            </strong>
                            <span className="admin-stat-card-change positive">
                                ↑ 12% this month
                            </span>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-section">
                    <div className="admin-dashboard-section-header">
                        <h2>⚡ Quick Actions</h2>
                        <span className="admin-dashboard-section-subtitle">Manage your marketplace</span>
                    </div>

                    <div className="admin-dashboard-actions">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.title}
                                    to={action.href}
                                    className={`admin-action-card admin-action-card-${action.accent}`}
                                >
                                    <div className="admin-action-card-icon">
                                        <Icon size={24} />
                                    </div>
                                    <div className="admin-action-card-content">
                                        <strong>{action.title}</strong>
                                        <span>{action.description}</span>
                                    </div>
                                    <ChevronRight size={18} className="admin-action-card-arrow" />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="admin-dashboard-tip">
                    <div className="admin-dashboard-tip-icon">
                        <Sparkles size={20} />
                    </div>
                    <div className="admin-dashboard-tip-content">
                        <h4>Admin Tip</h4>
                        <p>
                            {stats.pendingOrders > 0
                                ? `You have ${stats.pendingOrders} pending orders to review.`
                                : "All systems are running smoothly. Keep up the great work!"}
                        </p>
                    </div>
                    {stats.pendingOrders > 0 && (
                        <Link to="/admin/settlements" className="admin-dashboard-tip-action">
                            Review Now
                            <ChevronRight size={16} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}