import { Link, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    FolderTree,
    Landmark,
    DollarSign,
    Image,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Categories", href: "/admin/categories", icon: <FolderTree size={18} /> },
        { name: "Settlements", href: "/admin/settlements", icon: <Landmark size={18} /> },
        { name: "Finance", href: "/admin/finance", icon: <DollarSign size={18} /> },
        { name: "Banners", href: "/admin/banners", icon: <Image size={18} /> },
        { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
    ];

    const isActive = (path: string) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => logout();

    return (
        <div className="admin-layout">
            <button
                className="admin-mobile-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">
                        <ShieldCheck size={28} className="admin-sidebar-logo-icon" />
                        <div>
                            <strong>Obaara<span>tech</span></strong>
                            <span>Admin Panel</span>
                        </div>
                    </div>
                </div>

                <div className="admin-sidebar-user">
                    <div className="admin-sidebar-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div className="admin-sidebar-user-info">
                        <strong>{user?.name || "Administrator"}</strong>
                        <span>Admin</span>
                    </div>
                </div>

                <nav className="admin-sidebar-nav">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`admin-sidebar-nav-item ${active ? "active" : ""}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="admin-sidebar-nav-icon">{item.icon}</span>
                                <span className="admin-sidebar-nav-name">{item.name}</span>
                                {active && <ChevronRight size={14} className="admin-sidebar-nav-arrow" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/account" className="admin-sidebar-footer-item">
                        <Settings size={18} />
                        Account Settings
                    </Link>
                    <button className="admin-sidebar-footer-item" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>

            {isMobileMenuOpen && (
                <div className="admin-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
}