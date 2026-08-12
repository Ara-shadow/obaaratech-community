import {
    useEffect,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";


import {
    getListings
} from "../api/listings";


import CategorySection from "../components/CategorySection";

import ListingCard from "../components/ListingCard";


import type {
    Listing
} from "../types/listing";


export default function Marketplace() {


    const [
        listings,
        setListings
    ] = useState<Listing[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        searchParams
    ] = useSearchParams();


    const searchQuery =
        searchParams
            .get("search")
            ?.trim()
            .toLowerCase() || "";


    const categoryId =
        searchParams
            .get("category")
            ?.trim() || "";


    useEffect(() => {

        getListings()

            .then((data) => {

                setListings(data);

            })

            .catch(() => {

                setError(
                    "Unable to load products"
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, []);


    /*
     * SEARCH + CATEGORY FILTER
     */

    const filteredListings =
        listings.filter((listing) => {


            /*
             * SEARCH FILTER
             */

            if (searchQuery) {

                const title =
                    listing.title
                        ?.toLowerCase() || "";


                const description =
                    listing.description
                        ?.toLowerCase() || "";


                const category =
                    listing.category?.name
                        ?.toLowerCase() || "";


                const location =
                    listing.location
                        ?.toLowerCase() || "";


                const matchesSearch =

                    title.includes(searchQuery) ||

                    description.includes(searchQuery) ||

                    category.includes(searchQuery) ||

                    location.includes(searchQuery);


                if (!matchesSearch) {

                    return false;

                }

            }


            /*
             * CATEGORY FILTER
             */

            if (categoryId) {

                if (
                    listing.category?.id !==
                    categoryId
                ) {

                    return false;

                }

            }


            return true;

        });


    const selectedCategory =
        categoryId

            ? listings.find(
                (listing) =>
                    listing.category?.id ===
                    categoryId
            )?.category?.name || ""

            : "";


    const featured =
        filteredListings.filter(
            item => item.featured
        );


    const latest =
        filteredListings.slice(
            0,
            8
        );


    const flashSales =
        filteredListings.slice(
            8,
            16
        );


    const isFiltering =
        Boolean(
            searchQuery ||
            categoryId
        );


    return (

        <main className="marketplace-page">


            {
                loading && (

                    <div className="marketplace-message">

                        Loading marketplace...

                    </div>

                )
            }


            {
                error && (

                    <div className="marketplace-message error">

                        {error}

                    </div>

                )
            }


            {
                !loading &&
                !error && (

                    <>


                        {/* HERO */}

                        <section className="marketplace-hero">

                            <div className="hero-content">


                                <p className="hero-label">

                                    Welcome to Obaaratech Community

                                </p>


                                <h1>

                                    Everything you need,
                                    all in one place

                                </h1>


                                <p>

                                    Discover products, services,
                                    jobs and opportunities from
                                    people and businesses around
                                    your community.

                                </p>


                            </div>

                        </section>



                        {/* SEARCH RESULT */}

                        {
                            searchQuery && (

                                <section className="search-results-header">

                                    <h2>

                                        Search results for:

                                        {" "}

                                        <strong>
                                            "{searchQuery}"
                                        </strong>

                                    </h2>


                                    <p>

                                        {
                                            filteredListings.length
                                        }

                                        {" "}

                                        {
                                            filteredListings.length === 1
                                                ? "listing"
                                                : "listings"
                                        }

                                        {" "}found

                                    </p>

                                </section>

                            )
                        }



                        {/* CATEGORY RESULT */}

                        {
                            categoryId &&
                            selectedCategory && (

                                <section className="search-results-header">

                                    <h2>

                                        Category:

                                        {" "}

                                        <strong>
                                            {selectedCategory}
                                        </strong>

                                    </h2>


                                    <p>

                                        {
                                            filteredListings.length
                                        }

                                        {" "}

                                        {
                                            filteredListings.length === 1
                                                ? "listing"
                                                : "listings"
                                        }

                                        {" "}found

                                    </p>

                                </section>

                            )
                        }



                        {/* CATEGORIES */}

                        {
                            !isFiltering && (

                                <CategorySection />

                            )
                        }



                        {/* NO RESULTS */}

                        {
                            isFiltering &&
                            filteredListings.length === 0 && (

                                <section className="marketplace-section">

                                    <div className="empty-search">


                                        <div className="empty-search-icon">

                                            🔎

                                        </div>


                                        <h2>

                                            No listings found

                                        </h2>


                                        <p>

                                            {
                                                searchQuery
                                                    ? `We couldn't find anything matching "${searchQuery}".`
                                                    : `There are currently no listings in this category.`
                                            }

                                        </p>


                                        <p>

                                            Try another product,
                                            category, location or keyword.

                                        </p>


                                    </div>

                                </section>

                            )
                        }



                        {/* FEATURED */}

                        {
                            featured.length > 0 && (

                                <section className="marketplace-section">


                                    <div className="section-heading">

                                        <h2>

                                            🔥 Featured Products

                                        </h2>

                                    </div>


                                    <div className="listing-grid">

                                        {
                                            featured.map(
                                                (item) => (

                                                    <ListingCard
                                                        key={item.id}
                                                        listing={item}
                                                    />

                                                )
                                            )
                                        }

                                    </div>


                                </section>

                            )
                        }



                        {/* FLASH SALES */}

                        {
                            flashSales.length > 0 && (

                                <section className="marketplace-section">


                                    <div className="section-heading">

                                        <h2>

                                            ⚡ Flash Sales

                                        </h2>

                                    </div>


                                    <div className="listing-grid">

                                        {
                                            flashSales.map(
                                                (item) => (

                                                    <ListingCard
                                                        key={item.id}
                                                        listing={item}
                                                    />

                                                )
                                            )
                                        }

                                    </div>


                                </section>

                            )
                        }



                        {/* LATEST */}

                        {
                            latest.length > 0 && (

                                <section className="marketplace-section">


                                    <div className="section-heading">

                                        <h2>

                                            🆕 Latest Listings

                                        </h2>

                                    </div>


                                    <div className="listing-grid">

                                        {
                                            latest.map(
                                                (item) => (

                                                    <ListingCard
                                                        key={item.id}
                                                        listing={item}
                                                    />

                                                )
                                            )
                                        }

                                    </div>


                                </section>

                            )
                        }


                    </>

                )
            }


        </main>

    );

}