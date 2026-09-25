import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getCategoryTree
} from "../api/categories";

import type {
    CategoryTree
} from "../types/category";

export default function CategorySection() {

    const [
        categories,
        setCategories
    ] = useState<CategoryTree[]>([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const navigate = useNavigate();


    /* =====================================================
       LOAD CATEGORY TREE
    ===================================================== */

    useEffect(() => {

        getCategoryTree()

            .then((data) => {

                setCategories(
                    data
                );

            })

            .catch((error) => {

                console.error(
                    "Category error:",
                    error
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, []);


    /* =====================================================
       CATEGORY CLICK
    ===================================================== */

    function handleCategoryClick(
        categoryId: string
    ) {

        navigate(
            `/categories?category=${encodeURIComponent(categoryId)}`
        );

    }


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    function handleCategoryKeyDown(
        event: React.KeyboardEvent<HTMLDivElement>,
        categoryId: string
    ) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            handleCategoryClick(
                categoryId
            );

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="category-section">


            <div className="section-heading">

                <div>

                    <span className="listing-eyebrow">
                        Browse
                    </span>

                    <h2>
                        Popular Categories
                    </h2>

                </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {
                loading && (

                    <div className="category-grid">

                        {
                            Array.from({
                                length: 8
                            }).map(
                                (_, index) => (

                                    <div
                                        key={index}
                                        className="category-card category-card-loading"
                                    >

                                        <div className="category-icon">

                                            📦

                                        </div>

                                        <h3>
                                            Loading...
                                        </h3>

                                    </div>

                                )
                            )
                        }

                    </div>

                )
            }


            {/* =================================================
                CATEGORIES
            ================================================= */}

            {
                !loading &&
                categories.length > 0 && (

                    <div className="category-grid">

                        {
                            categories
                                .slice(0, 8)
                                .map(
                                    (category) => (

                                        <div
                                            key={
                                                category.id
                                            }
                                            className="category-card"
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category.id
                                                )
                                            }
                                            onKeyDown={(event) =>
                                                handleCategoryKeyDown(
                                                    event,
                                                    category.id
                                                )
                                            }
                                        >


                                            <div className="category-icon">

                                                {
                                                    category.icon ||
                                                    "📦"
                                                }

                                            </div>


                                            <h3>

                                                {
                                                    category.name
                                                }

                                            </h3>


                                            {
                                                category.children &&
                                                category.children.length > 0 && (

                                                    <span className="category-count">

                                                        {
                                                            category.children.length
                                                        }{" "}

                                                        {
                                                            category.children.length === 1
                                                                ? "subcategory"
                                                                : "subcategories"
                                                        }

                                                    </span>

                                                )
                                            }


                                        </div>

                                    )
                                )
                        }

                    </div>

                )
            }


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {
                !loading &&
                categories.length === 0 && (

                    <div className="marketplace-message">

                        <div className="category-icon">

                            📦

                        </div>

                        <h3>
                            Categories are currently unavailable
                        </h3>

                        <p>
                            Please try again shortly.
                        </p>

                    </div>

                )
            }


        </section>

    );

}