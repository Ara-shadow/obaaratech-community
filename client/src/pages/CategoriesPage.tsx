import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    ChevronRight,
    Filter,
    Grid2x2,
    Search,
    ChevronDown,
    ChevronUp,
    Package,
    ShoppingBag,
    Layers
} from "lucide-react";
import { getCategoryTree, type Category } from "../api/categories";
import { getListings } from "../api/listings";
import type { Listing } from "../types/listing";
import ListingCard from "../components/ListingCard";

interface CategoryNode extends Category {
    children?: CategoryNode[];
}

export default function CategoriesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const currentCategoryId = searchParams.get("category") || "";

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        let mounted = true;

        Promise.all([getCategoryTree(), getListings()])
            .then(([tree, items]) => {
                if (!mounted) return;
                setCategories(tree || []);
                setListings(items || []);
            })
            .catch((error) => {
                console.error("Category page error:", error);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    // =====================================================
    // EXPAND CATEGORY ON SELECT
    // =====================================================

    useEffect(() => {
        if (currentCategoryId) {
            const newExpanded = new Set(expandedCategories);
            let found = false;

            function findAndExpand(nodes: CategoryNode[], targetId: string): boolean {
                for (const node of nodes) {
                    if (node.id === targetId) {
                        return true;
                    }
                    if (node.children?.length && findAndExpand(node.children, targetId)) {
                        newExpanded.add(node.id);
                        return true;
                    }
                }
                return false;
            }

            findAndExpand(categories, currentCategoryId);
            setExpandedCategories(newExpanded);
        }
    }, [currentCategoryId, categories]);

    // =====================================================
    // FLATTEN CATEGORIES FOR SEARCH
    // =====================================================

    const flattenedCategories = useMemo(() => {
        const result: { id: string; name: string; level: number; parentId?: string | null }[] = [];

        function walk(nodes: CategoryNode[], level = 0) {
            for (const category of nodes) {
                result.push({
                    id: category.id,
                    name: category.name,
                    level,
                    parentId: category.parentId
                });

                if (category.children?.length) {
                    walk(category.children, level + 1);
                }
            }
        }

        walk(categories);
        return result;
    }, [categories]);

    // =====================================================
    // FILTER CATEGORIES
    // =====================================================

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return flattenedCategories;
        }
        return flattenedCategories.filter((category) =>
            category.name.toLowerCase().includes(query)
        );
    }, [flattenedCategories, search]);

    // =====================================================
    // SELECTED CATEGORY
    // =====================================================

    const selectedCategory = useMemo(() => {
        const findCategory = (nodes: CategoryNode[]): CategoryNode | null => {
            for (const node of nodes) {
                if (node.id === currentCategoryId) return node;
                const nested = node.children ? findCategory(node.children) : null;
                if (nested) return nested;
            }
            return null;
        };
        return findCategory(categories);
    }, [categories, currentCategoryId]);

    // =====================================================
    // CATEGORY LISTINGS
    // =====================================================

    const categoryListings = useMemo(() => {
        if (!currentCategoryId) {
            return listings;
        }

        return listings.filter((listing) => {
            const categoryId = listing.category?.id;
            if (!categoryId) return false;

            if (categoryId === currentCategoryId) return true;

            const findAncestor = (nodes: CategoryNode[]): boolean => {
                for (const node of nodes) {
                    if (node.id === currentCategoryId) {
                        return node.children?.some((child) => child.id === categoryId) || false;
                    }
                    if (node.children && findAncestor(node.children)) {
                        return true;
                    }
                }
                return false;
            };

            return findAncestor(categories);
        });
    }, [categories, currentCategoryId, listings]);

    // =====================================================
    // DISPLAY LISTINGS
    // =====================================================

    const displayListings = useMemo(() => {
        return categoryListings.filter((listing) => {
            if (!search.trim()) return true;
            const q = search.trim().toLowerCase();
            return (
                listing.title.toLowerCase().includes(q) ||
                listing.description.toLowerCase().includes(q) ||
                listing.category?.name?.toLowerCase().includes(q)
            );
        });
    }, [categoryListings, search]);

    // =====================================================
    // GET CATEGORY PATH
    // =====================================================

    function getCategoryPath(categoryId: string): string[] {
        const stack: string[] = [];

        function walk(nodes: CategoryNode[]): boolean {
            for (const node of nodes) {
                if (node.id === categoryId) {
                    stack.push(node.name);
                    return true;
                }
                if (node.children?.length && walk(node.children)) {
                    stack.push(node.name);
                    return true;
                }
            }
            return false;
        }

        walk(categories);
        return [...stack].reverse();
    }

    // =====================================================
    // HANDLERS
    // =====================================================

    function handleCategorySelect(id: string) {
        setSearchParams({ category: id });
    }

    function clearCategory() {
        setSearchParams({});
    }

    function toggleExpand(categoryId: string) {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    }

    // =====================================================
    // RENDER CATEGORY BRANCH
    // =====================================================

    function renderCategoryBranch(
        category: CategoryNode,
        level: number
    ): React.ReactNode {
        const hasChildren = Boolean(category.children && category.children.length > 0);
        const isSelected = currentCategoryId === category.id;
        const isExpanded = expandedCategories.has(category.id);

        return (
            <div key={category.id} className="categories-tree-branch">
                <button
                    className={`categories-tree-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                        handleCategorySelect(category.id);
                        if (hasChildren) {
                            toggleExpand(category.id);
                        }
                    }}
                    style={{ paddingLeft: `${12 + level * 16}px` }}
                >
                    <span className="categories-tree-item-name">{category.name}</span>
                    {hasChildren && (
                        <span className="categories-tree-item-count">
                            {category.children!.length}
                            {isExpanded ? (
                                <ChevronUp size={14} />
                            ) : (
                                <ChevronDown size={14} />
                            )}
                        </span>
                    )}
                </button>

                {hasChildren && isExpanded && (
                    <div className="categories-tree-children">
                        {category.children!.map((child) =>
                            renderCategoryBranch(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="categories-page">
                <div className="categories-loading">
                    <div className="categories-loading-spinner" />
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="categories-page">

            <div className="categories-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="categories-header">

                    <div className="categories-header-left">
                        <div className="categories-header-icon">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h1>Browse Categories</h1>
                            <p>Explore products and services by category</p>
                        </div>
                    </div>

                    <div className="categories-header-actions">
                        <div className="categories-search">
                            <Search size={16} />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search categories or listings..."
                                aria-label="Search categories and listings"
                            />
                        </div>

                        {currentCategoryId && (
                            <button
                                type="button"
                                className="categories-clear-filter"
                                onClick={clearCategory}
                            >
                                <Filter size={14} />
                                Clear Filter
                            </button>
                        )}
                    </div>

                </div>

                {/* =================================================
                    MAIN LAYOUT
                ================================================= */}

                <div className="categories-layout">

                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="categories-sidebar">

                        <div className="categories-sidebar-header">
                            <Grid2x2 size={16} />
                            <h2>All Categories</h2>
                        </div>

                        <div className="categories-tree">
                            {categories.map((category) =>
                                renderCategoryBranch(category, 0)
                            )}
                        </div>

                    </aside>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="categories-content">

                        {/* Selected Category Summary */}
                        {selectedCategory ? (

                            <div className="categories-summary selected">

                                <div className="categories-summary-header">
                                    <span className="categories-summary-badge">Selected</span>
                                    <h2>{selectedCategory.name}</h2>
                                </div>

                                <div className="categories-summary-breadcrumb">
                                    {getCategoryPath(selectedCategory.id).map((crumb, index, arr) => (
                                        <span key={`${crumb}-${index}`} className="categories-breadcrumb-item">
                                            {crumb}
                                            {index < arr.length - 1 && <ChevronRight size={14} />}
                                        </span>
                                    ))}
                                </div>

                                <p className="categories-summary-count">
                                    {displayListings.length} listing{displayListings.length === 1 ? "" : "s"} in this category
                                </p>

                            </div>

                        ) : (

                            <div className="categories-summary">

                                <div className="categories-summary-header">
                                    <span className="categories-summary-badge">Browse</span>
                                    <h2>All Marketplace Categories</h2>
                                </div>

                                <p>Explore popular categories and discover listings across the community marketplace</p>

                            </div>

                        )}

                        {/* Category Grid */}
                        {filteredCategories.length > 0 ? (

                            <div className="categories-grid">

                                {filteredCategories.map((category) => (
                                    <button
                                        type="button"
                                        key={category.id}
                                        className={`categories-grid-item ${
                                            currentCategoryId === category.id ? "active" : ""
                                        }`}
                                        onClick={() => handleCategorySelect(category.id)}
                                    >
                                        <span className="categories-grid-item-indent">
                                            {category.level > 0 && "↳ "}
                                        </span>
                                        <span className="categories-grid-item-name">
                                            {category.name}
                                        </span>
                                        <ChevronRight size={16} className="categories-grid-item-arrow" />
                                    </button>
                                ))}

                            </div>

                        ) : (

                            <div className="categories-empty">
                                <Search size={32} />
                                <p>No categories match your search</p>
                            </div>

                        )}

                        {/* Listing Grid */}
                        <div className="categories-listings">

                            <div className="categories-listings-header">
                                <h3>
                                    {displayListings.length} Listing{displayListings.length === 1 ? "" : "s"}
                                    {selectedCategory && ` in ${selectedCategory.name}`}
                                </h3>
                            </div>

                            {displayListings.length > 0 ? (

                                <div className="categories-listings-grid">
                                    {displayListings.map((listing) => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                        />
                                    ))}
                                </div>

                            ) : (

                                <div className="categories-listings-empty">
                                    <ShoppingBag size={40} />
                                    <h4>No listings found</h4>
                                    <p>
                                        {search
                                            ? `No listings match "${search}"`
                                            : "There are no listings in this category yet"}
                                    </p>
                                    {search && (
                                        <button
                                            type="button"
                                            className="categories-clear-search"
                                            onClick={() => setSearch("")}
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}