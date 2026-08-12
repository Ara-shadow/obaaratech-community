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

    const navigate = useNavigate();


    const [
        categories,
        setCategories
    ] = useState<CategoryTree[]>([]);


    useEffect(() => {

        getCategoryTree()

            .then((data) => {

                setCategories(data);

            })

            .catch((error) => {

                console.error(
                    "Category error:",
                    error
                );

            });

    }, []);


    function handleCategoryClick(
        categoryId: string
    ) {

        navigate(
            `/?category=${encodeURIComponent(categoryId)}`
        );

    }


    return (

        <section className="category-section">


            <div className="section-heading">

                <h2>
                    Popular Categories
                </h2>

            </div>


            <div className="category-grid">


                {
                    categories
                        .slice(0, 8)
                        .map((category) => (

                            <div
                                key={category.id}
                                className="category-card"
                                role="button"
                                tabIndex={0}
                                onClick={() =>
                                    handleCategoryClick(
                                        category.id
                                    )
                                }
                                onKeyDown={(event) => {

                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {

                                        event.preventDefault();

                                        handleCategoryClick(
                                            category.id
                                        );

                                    }

                                }}
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


                            </div>

                        ))
                }


            </div>


        </section>

    );

}