import {
    useEffect,
    useState
} from "react";

import {
    getCategoryTree
} from "../api/categories";

import type {
    CategoryTree
} from "../types/category";

interface CategoryItemProps {
    category: CategoryTree;
    level?: number;
}

function CategoryItem({
    category,
    level = 0
}: CategoryItemProps) {

    const [open, setOpen] =
        useState(false);

    const hasChildren =
        Boolean(
            category.children &&
            category.children.length > 0
        );

    return (
        <div
            className={`category-block category-level-${level}`}
        >

            <button
                type="button"
                className={
                    open
                        ? "category-name active"
                        : "category-name"
                }
                onClick={() => {
                    if (hasChildren) {
                        setOpen(!open);
                    }
                }}
                aria-expanded={
                    hasChildren
                        ? open
                        : undefined
                }
            >

                <span className="category-icon">
                    {category.icon || "📦"}
                </span>

                <span className="category-label">
                    {category.name}
                </span>

                {hasChildren && (
                    <span
                        className="arrow"
                        aria-hidden="true"
                    >
                        {open ? "⌃" : "›"}
                    </span>
                )}

            </button>

            {open && hasChildren && (

                <div className="subcategory-list">

                    {category.children!.map(
                        (child) => (

                            <CategoryItem
                                key={child.id}
                                category={child}
                                level={level + 1}
                            />

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default function CategorySidebar() {

    const [categories, setCategories] =
        useState<CategoryTree[]>([]);

    useEffect(() => {

        getCategoryTree()
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error(
                    "Category loading error:",
                    error
                );
            });

    }, []);

    return (
        <aside className="category-sidebar">

            <h3>
                Categories
            </h3>

            <div className="category-sidebar-list">

                {categories.map(
                    (category) => (

                        <CategoryItem
                            key={category.id}
                            category={category}
                        />

                    )
                )}

            </div>

        </aside>
    );
}