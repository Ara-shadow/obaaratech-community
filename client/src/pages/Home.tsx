import {
    useEffect,
    useState,
    useMemo,
    useRef
} from "react";

import {
    useSearchParams,
    useNavigate
} from "react-router-dom";

import {
    ArrowRight,
    Clock,
    Search,
    ShieldCheck,
    Sparkles,
    Briefcase,
    Home as HomeIcon,
    Smartphone,
    Car,
    Package,
    ChevronRight,
    ChevronDown,
    Menu,
    Truck,
    Headphones,
    Gift
} from "lucide-react";

import {
    getListings
} from "../api/listings";

import ListingCard from "../components/ListingCard";

import type {
    Listing
} from "../types/listing";

// ============================================================
// HOME PAGE – AMAZON-STYLE MARKETPLACE
// ============================================================

export default function Home() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleItems, setVisibleItems] = useState(12);
    const [sortBy, setSortBy] = useState<"newest" | "popular" | "price-low" | "price-high">("newest");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);
    const latestSectionRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // URL params
    const categoryId = searchParams.get("category") || "";
    const urlSearch = searchParams.get("search") || "";

    // Fetch listings
    useEffect(() => {
        getListings()
            .then((data) => {
                setListings(data);
            })
            .catch(() => {
                setError("Unable to load products");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Sync search with URL
    useEffect(() => {
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [urlSearch]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtered listings
    const filteredListings = useMemo(() => {
        let results = [...listings];

        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            results = results.filter((listing) => {
                const title = listing.title?.toLowerCase() || "";
                const description = listing.description?.toLowerCase() || "";
                const category = listing.category?.name?.toLowerCase() || "";
                const location = listing.location?.toLowerCase() || "";
                return title.includes(query) ||
                    description.includes(query) ||
                    category.includes(query) ||
                    location.includes(query);
            });
        }

        if (categoryId) {
            results = results.filter(
                (listing) => listing.category?.id === categoryId
            );
        }

        switch (sortBy) {
            case "price-low":
                results.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "price-high":
                results.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "popular":
                results.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
                break;
            default:
                results.sort((a, b) =>
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
                );
        }

        return results;
    }, [listings, searchQuery, categoryId, sortBy]);

    // Derived data
    const featured = filteredListings.filter(item => item.featured);
    const flashSales = filteredListings.slice(4, 12);
    const latest = filteredListings.slice(0, visibleItems);
    const hasMore = visibleItems < filteredListings.length;
    const isFiltering = Boolean(searchQuery || categoryId);

    // Handlers
    const clearFilters = () => {
        setSearchQuery("");
        setSearchParams({});
        setSortBy("newest");
        setIsCategoryDropdownOpen(false);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const loadMore = () => {
        setVisibleItems(prev => prev + 12);
    };

    const navigateToCategory = (categoryId: string) => {
        setSearchParams({ category: categoryId });
        setIsCategoryDropdownOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Category data with subcategories
    const categoryData = [
        { 
            id: "electronics", 
            name: "Electronics", 
            icon: <Smartphone size={16} />,
            subcategories: ["Phones", "Laptops", "Accessories", "Cameras", "Audio", "Gaming"]
        },
        { 
            id: "fashion", 
            name: "Fashion", 
            icon: <Smartphone size={16} />,
            subcategories: ["Men's Wear", "Women's Wear", "Footwear", "Accessories", "Bags"]
        },
        { 
            id: "vehicles", 
            name: "Vehicles", 
            icon: <Car size={16} />,
            subcategories: ["Cars", "Motorcycles", "Trucks", "Spare Parts"]
        },
        { 
            id: "property", 
            name: "Property", 
            icon: <HomeIcon size={16} />,
            subcategories: ["Houses", "Apartments", "Land", "Commercial"]
        },
        { 
            id: "services", 
            name: "Services", 
            icon: <Briefcase size={16} />,
            subcategories: ["Cleaning", "Repairs", "Consulting", "Delivery"]
        },
        { 
            id: "jobs", 
            name: "Jobs", 
            icon: <Briefcase size={16} />,
            subcategories: ["Full-time", "Part-time", "Remote", "Internship"]
        },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="home-loading">
                <div className="home-loading-spinner">
                    <div className="home-loading-logo">O</div>
                    <div className="home-loading-bar" />
                    <p>Loading marketplace...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="home-error">
                <div className="home-error-icon">⚠️</div>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <main className="home-page">

            {/* ============================================================
                HERO BANNER
            ============================================================ */}
            <section className="home-hero-amazon">
                <div className="home-hero-amazon-container">
                    <div className="home-hero-amazon-content">
                        <div className="home-hero-amazon-badge">
                            <Sparkles size={14} />
                            <span>Welcome to Obaaratech</span>
                        </div>
                        <h1>
                            Discover, Connect,
                            <span>and Grow Together</span>
                        </h1>
                        <p>
                            Find amazing products, services, and opportunities
                            from people and businesses in your community.
                        </p>
                        <div className="home-hero-amazon-features">
                            <div>
                                <Truck size={18} />
                                <span>Fast Delivery</span>
                            </div>
                            <div>
                                <ShieldCheck size={18} />
                                <span>Secure Payments</span>
                            </div>
                            <div>
                                <Headphones size={18} />
                                <span>24/7 Support</span>
                            </div>
                            <div>
                                <Gift size={18} />
                                <span>Best Deals</span>
                            </div>
                        </div>
                    </div>
                    <div className="home-hero-amazon-stats">
                        <div className="home-hero-amazon-stat">
                            <strong>{listings.length}+</strong>
                            <span>Listings</span>
                        </div>
                        <div className="home-hero-amazon-stat">
                            <strong>1,200+</strong>
                            <span>Users</span>
                        </div>
                        <div className="home-hero-amazon-stat">
                            <strong>500+</strong>
                            <span>Sellers</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                CATEGORY DROPDOWN
            ============================================================ */}
            <section className="home-categories-amazon">
                <div className="home-categories-amazon-container">
                    <div className="home-categories-amazon-wrapper" ref={dropdownRef}>
                        <button
                            className={`home-categories-amazon-trigger ${isCategoryDropdownOpen ? "open" : ""}`}
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        >
                            <Menu size={18} />
                            <span>All Categories</span>
                            <ChevronDown size={14} className={`dropdown-chevron ${isCategoryDropdownOpen ? "rotated" : ""}`} />
                        </button>

                        {isCategoryDropdownOpen && (
                            <div className="home-categories-amazon-menu">
                                <div className="home-categories-amazon-grid">
                                    {categoryData.map((category) => (
                                        <div key={category.id} className="home-categories-amazon-group">
                                            <button
                                                className={`home-categories-amazon-item ${categoryId === category.id ? "active" : ""}`}
                                                onClick={() => navigateToCategory(category.id)}
                                            >
                                                <span className="home-categories-amazon-icon">
                                                    {category.icon}
                                                </span>
                                                <span className="home-categories-amazon-name">{category.name}</span>
                                                <ChevronRight size={12} className="home-categories-amazon-arrow" />
                                            </button>
                                            <div className="home-categories-amazon-sub">
                                                {category.subcategories.map((sub) => (
                                                    <button
                                                        key={sub}
                                                        className="home-categories-amazon-sub-item"
                                                        onClick={() => {
                                                            setSearchParams({ category: category.id, search: sub });
                                                            setIsCategoryDropdownOpen(false);
                                                        }}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="home-categories-amazon-footer">
                                    <button
                                        className="home-categories-amazon-view-all"
                                        onClick={() => navigate("/categories")}
                                    >
                                        View All Categories
                                        <ChevronRight size={14} />
                                    </button>
                                    {categoryId && (
                                        <button
                                            className="home-categories-amazon-clear"
                                            onClick={clearFilters}
                                        >
                                            Clear Filter
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="home-categories-amazon-links">
                        {categoryData.slice(0, 6).map((cat) => (
                            <button
                                key={cat.id}
                                className={`home-categories-amazon-link ${categoryId === cat.id ? "active" : ""}`}
                                onClick={() => navigateToCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                FILTER BAR
            ============================================================ */}
            {isFiltering && (
                <div className="home-filter-bar">
                    <div className="home-filter-bar-container">
                        <div className="home-filter-results">
                            <span className="home-filter-count">
                                {filteredListings.length}
                            </span>
                            <span className="home-filter-label">
                                {filteredListings.length === 1 ? "result" : "results"}
                            </span>
                            {searchQuery && (
                                <span className="home-filter-query">
                                    for "{searchQuery}"
                                </span>
                            )}
                            {categoryId && (
                                <span className="home-filter-category">
                                    in {categoryData.find(c => c.id === categoryId)?.name}
                                </span>
                            )}
                        </div>

                        <div className="home-filter-controls">
                            <select
                                className="home-filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>

                            <button
                                className="home-filter-clear"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                FEATURED SECTION
            ============================================================ */}
            {featured.length > 0 && (
                <section className="home-featured-amazon">
                    <div className="home-featured-amazon-container">
                        <div className="home-section-header">
                            <div>
                                <span className="home-section-eyebrow">⭐ Featured</span>
                                <h2>Handpicked for You</h2>
                                <p>Quality items from trusted sellers</p>
                            </div>
                        </div>

                        <div className="home-featured-grid">
                            {featured.slice(0, 4).map((item) => (
                                <ListingCard
                                    key={item.id}
                                    listing={item}
                                    featured={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================
                FLASH SALES
            ============================================================ */}
            {flashSales.length > 3 && (
                <section className="home-flash-amazon">
                    <div className="home-flash-amazon-container">
                        <div className="home-section-header">
                            <div>
                                <span className="home-section-eyebrow flash">⚡ Limited Time</span>
                                <h2>
                                    Flash Sales
                                    <span className="home-flash-timer">
                                        <Clock size={16} />
                                        23:45:12
                                    </span>
                                </h2>
                                <p>Grab these deals before they're gone!</p>
                            </div>
                            <button
                                className="home-section-view-all flash"
                                onClick={() => navigate("/marketplace?sort=flash")}
                            >
                                View All
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="home-flash-grid">
                            {flashSales.slice(0, 4).map((item) => (
                                <ListingCard
                                    key={item.id}
                                    listing={item}
                                    flashSale={true}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================
                LATEST LISTINGS
            ============================================================ */}
            <section
                ref={latestSectionRef}
                id="latest-listings"
                className="home-latest-amazon"
            >
                <div className="home-latest-amazon-container">
                    <div className="home-section-header">
                        <div>
                            <span className="home-section-eyebrow">🛍️ New Arrivals</span>
                            <h2>Latest from the Community</h2>
                            <p>Discover what's new and trending</p>
                        </div>
                        <div className="home-latest-actions">
                            {isFiltering && (
                                <button
                                    className="home-latest-clear"
                                    onClick={clearFilters}
                                >
                                    Show All
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredListings.length === 0 && (
                        <div className="home-empty">
                            <div className="home-empty-icon">
                                <Search size={48} />
                            </div>
                            <h3>No listings found</h3>
                            <p>
                                {searchQuery
                                    ? `We couldn't find anything matching "${searchQuery}"`
                                    : "There are no listings in this category yet"}
                            </p>
                            <div className="home-empty-actions">
                                <button
                                    className="home-empty-button primary"
                                    onClick={clearFilters}
                                >
                                    Browse All Listings
                                </button>
                                <button
                                    className="home-empty-button secondary"
                                    onClick={() => navigate("/create-listing")}
                                >
                                    <Package size={18} />
                                    List Your Item
                                </button>
                            </div>
                            {!searchQuery && (
                                <div className="home-empty-suggestions">
                                    <span>Popular categories:</span>
                                    {categoryData.slice(0, 4).map((cat) => (
                                        <button
                                            key={cat.id}
                                            className="home-empty-chip"
                                            onClick={() => navigateToCategory(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {filteredListings.length > 0 && (
                        <>
                            <div className="home-latest-grid">
                                {latest.map((item) => (
                                    <ListingCard
                                        key={item.id}
                                        listing={item}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="home-load-more">
                                    <button
                                        className="home-load-more-button"
                                        onClick={loadMore}
                                    >
                                        Load More Products
                                        <ArrowRight size={18} />
                                    </button>
                                    <span className="home-load-more-count">
                                        Showing {Math.min(visibleItems, filteredListings.length)} of {filteredListings.length} products
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* ============================================================
                SELLER CTA
            ============================================================ */}
            {!isFiltering && (
                <section className="home-seller-cta-amazon">
                    <div className="home-seller-cta-amazon-container">
                        <div className="home-seller-cta-amazon-card">
                            <div className="home-seller-cta-amazon-content">
                                <span className="home-seller-cta-amazon-badge">
                                    🚀 Start Selling
                                </span>
                                <h2>Turn What You Have Into Opportunity</h2>
                                <p>
                                    List your products, services, or skills and connect
                                    with thousands of people in your community.
                                </p>
                                <button
                                    className="home-seller-cta-amazon-button"
                                    onClick={() => navigate("/create-listing")}
                                >
                                    Start Selling Now
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

        </main>
    );
}