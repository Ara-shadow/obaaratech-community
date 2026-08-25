import {
    useEffect,
    useState
} from "react";

import {
    useSearchParams
} from "react-router-dom";

import {
    ArrowRight,
    BriefcaseBusiness,
    ChevronRight,
    Heart,
    Home,
    Laptop,
    MapPin,
     Phone,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Store,
    Truck,
    Users,
    Wrench
} from "lucide-react";

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


    const filteredListings =
        listings.filter((listing) => {

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

                        <div className="homepage-loading-icon">
                            <ShoppingBag size={30} />
                        </div>

                        <h2>
                            Loading Obaaratech...
                        </h2>

                        <p>
                            Bringing the marketplace to you.
                        </p>

                    </div>

                )
            }


            {
                error && (

                    <div className="marketplace-message error">

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>

                )
            }


            {
                !loading &&
                !error && (

                    <>


                        {/* =====================================================
                            HERO
                        ===================================================== */}

                        {
                            !isFiltering && (

                                <section className="homepage-hero">

                                    <div className="homepage-hero-background">

                                        <div className="hero-glow hero-glow-one" />
                                        <div className="hero-glow hero-glow-two" />

                                    </div>


                                    <div className="homepage-hero-container">


                                        <div className="homepage-hero-content">


                                            <div className="homepage-hero-badge">

                                                <Sparkles
                                                    size={16}
                                                />

                                                <span>
                                                    Your community marketplace
                                                </span>

                                            </div>


                                            <h1>

                                                Buy.

                                                <span>
                                                    Sell.
                                                </span>

                                                Connect.

                                            </h1>


                                            <p>

                                                Discover products, services,
                                                jobs and opportunities from
                                                people and businesses around
                                                your community.

                                            </p>


                                            <div className="homepage-hero-actions">

                                                <a
                                                    href="#latest-listings"
                                                    className="homepage-primary-button"
                                                >

                                                    <ShoppingBag
                                                        size={18}
                                                    />

                                                    Explore Marketplace

                                                    <ArrowRight
                                                        size={18}
                                                    />

                                                </a>


                                                <a
                                                    href="/create-listing"
                                                    className="homepage-secondary-button"
                                                >

                                                    <Store
                                                        size={18}
                                                    />

                                                    Start Selling

                                                </a>

                                            </div>


                                            <div className="homepage-hero-trust">

                                                <div>

                                                    <ShieldCheck
                                                        size={17}
                                                    />

                                                    <span>
                                                        Trusted community
                                                    </span>

                                                </div>


                                                <div>

                                                    <Users
                                                        size={17}
                                                    />

                                                    <span>
                                                        Local connections
                                                    </span>

                                                </div>


                                                <div>

                                                    <Truck
                                                        size={17}
                                                    />

                                                    <span>
                                                        Easy transactions
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        <div className="homepage-hero-visual">


                                            <div className="hero-logo-card">

                                                <img
                                                    src="/logo.jpg"
                                                    alt="Obaaratech"
                                                />

                                            </div>


                                            <div className="floating-market-card floating-card-one">

                                                <div className="floating-icon">

                                                    <ShoppingBag
                                                        size={19}
                                                    />

                                                </div>

                                                <div>

                                                    <strong>
                                                        Marketplace
                                                    </strong>

                                                    <span>
                                                        Products & deals
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="floating-market-card floating-card-two">

                                                <div className="floating-icon">

                                                    <BriefcaseBusiness
                                                        size={19}
                                                    />

                                                </div>

                                                <div>

                                                    <strong>
                                                        Opportunities
                                                    </strong>

                                                    <span>
                                                        Jobs & services
                                                    </span>

                                                </div>

                                            </div>


                                        </div>

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            SEARCH RESULT
                        ===================================================== */}

                        {
                            searchQuery && (

                                <section className="search-results-header homepage-results-header">

                                    <div>

                                        <span className="results-eyebrow">
                                            Marketplace Search
                                        </span>

                                        <h2>

                                            Results for{" "}

                                            <strong>
                                                "{searchQuery}"
                                            </strong>

                                        </h2>

                                        <p>

                                            {filteredListings.length}{" "}

                                            {
                                                filteredListings.length === 1
                                                    ? "listing"
                                                    : "listings"
                                            }

                                            {" "}found

                                        </p>

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            CATEGORY RESULT
                        ===================================================== */}

                        {
                            categoryId &&
                            selectedCategory && (

                                <section className="search-results-header homepage-results-header">

                                    <div>

                                        <span className="results-eyebrow">
                                            Category
                                        </span>

                                        <h2>

                                            {selectedCategory}

                                        </h2>

                                        <p>

                                            {filteredListings.length}{" "}

                                            {
                                                filteredListings.length === 1
                                                    ? "listing"
                                                    : "listings"
                                            }

                                            {" "}available

                                        </p>

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            QUICK CATEGORIES
                        ===================================================== */}

                        {
                            !isFiltering && (

                                <section className="homepage-category-strip">

                                    <div className="homepage-container">


                                        <div className="homepage-section-heading compact-heading">

                                            <div>

                                                <span>
                                                    Browse
                                                </span>

                                                <h2>
                                                    Explore popular categories
                                                </h2>

                                            </div>


                                            <a href="#categories">

                                                View all

                                                <ChevronRight
                                                    size={17}
                                                />

                                            </a>

                                        </div>


                                        <div className="homepage-quick-categories">


                                            <a
                                                href="/marketplace"
                                                className="quick-category-card"
                                            >

                                                <span className="quick-category-icon blue">
                                                    <Laptop size={22} />
                                                </span>

                                                <strong>
                                                    Electronics
                                                </strong>

                                                <small>
                                                    Devices & gadgets
                                                </small>

                                            </a>


                                            <a
                                                href="/marketplace"
                                                className="quick-category-card"
                                            >

                                                <span className="quick-category-icon purple">
                                                    <Phone size={22} />
                                                </span>

                                                <strong>
                                                    Phones & Tablets
                                                </strong>

                                                <small>
                                                    Mobile technology
                                                </small>

                                            </a>


                                            <a
                                                href="/marketplace"
                                                className="quick-category-card"
                                            >

                                                <span className="quick-category-icon orange">
                                                    <ShoppingBag size={22} />
                                                </span>

                                                <strong>
                                                    Fashion
                                                </strong>

                                                <small>
                                                    Clothes & accessories
                                                </small>

                                            </a>


                                            <a
                                                href="/marketplace"
                                                className="quick-category-card"
                                            >

                                                <span className="quick-category-icon green">
                                                    <Home size={22} />
                                                </span>

                                                <strong>
                                                    Home & Living
                                                </strong>

                                                <small>
                                                    Everything for home
                                                </small>

                                            </a>


                                            <a
                                                href="/marketplace"
                                                className="quick-category-card"
                                            >

                                                <span className="quick-category-icon red">
                                                    <Truck size={22} />
                                                </span>

                                                <strong>
                                                    Vehicles
                                                </strong>

                                                <small>
                                                    Cars & transportation
                                                </small>

                                            </a>


                                            <a
                                                href="/marketplace"
                                                className="quick-category-card"
                                            >

                                                <span className="quick-category-icon teal">
                                                    <Wrench size={22} />
                                                </span>

                                                <strong>
                                                    Services
                                                </strong>

                                                <small>
                                                    Local professionals
                                                </small>

                                            </a>


                                        </div>

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            EXISTING CATEGORY COMPONENT
                        ===================================================== */}

                        {
                            !isFiltering && (

                                <section
                                    id="categories"
                                    className="homepage-existing-categories"
                                >

                                    <CategorySection />

                                </section>

                            )
                        }



                        {/* =====================================================
                            VALUE PROPOSITION
                        ===================================================== */}

                        {
                            !isFiltering && (

                                <section className="homepage-value-section">

                                    <div className="homepage-container">


                                        <div className="homepage-section-heading">

                                            <div>

                                                <span>
                                                    Why Obaaratech?
                                                </span>

                                                <h2>
                                                    More than a marketplace
                                                </h2>

                                            </div>

                                        </div>


                                        <div className="homepage-value-grid">


                                            <div className="homepage-value-card">

                                                <div className="homepage-value-icon">

                                                    <MapPin
                                                        size={23}
                                                    />

                                                </div>

                                                <h3>
                                                    Built for your community
                                                </h3>

                                                <p>
                                                    Find products, services and
                                                    opportunities around you.
                                                </p>

                                            </div>


                                            <div className="homepage-value-card">

                                                <div className="homepage-value-icon">

                                                    <ShieldCheck
                                                        size={23}
                                                    />

                                                </div>

                                                <h3>
                                                    Shop with confidence
                                                </h3>

                                                <p>
                                                    Connect directly with sellers
                                                    and discover useful information
                                                    before you buy.
                                                </p>

                                            </div>


                                            <div className="homepage-value-card">

                                                <div className="homepage-value-icon">

                                                    <Store
                                                        size={23}
                                                    />

                                                </div>

                                                <h3>
                                                    Sell what you offer
                                                </h3>

                                                <p>
                                                    Turn your products, skills and
                                                    services into new opportunities.
                                                </p>

                                            </div>


                                            <div className="homepage-value-card">

                                                <div className="homepage-value-icon">

                                                    <Heart
                                                        size={23}
                                                    />

                                                </div>

                                                <h3>
                                                    Discover more
                                                </h3>

                                                <p>
                                                    Save your favourites and build
                                                    your own personalised marketplace.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            EMPTY RESULTS
                        ===================================================== */}

                        {
                            isFiltering &&
                            filteredListings.length === 0 && (

                                <section className="marketplace-section">

                                    <div className="empty-search homepage-empty-search">

                                        <div className="empty-search-icon">
                                            <Search size={42} />
                                        </div>

                                        <h2>
                                            No listings found
                                        </h2>

                                        <p>

                                            {
                                                searchQuery
                                                    ? `We couldn't find anything matching "${searchQuery}".`
                                                    : "There are currently no listings in this category."
                                            }

                                        </p>

                                        <p>
                                            Try another product, category,
                                            location or keyword.
                                        </p>

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            FEATURED
                        ===================================================== */}

                        {
                            featured.length > 0 && (

                                <section className="marketplace-section homepage-listing-section">

                                    <div className="section-heading homepage-listing-heading">

                                        <div>

                                            <span className="listing-eyebrow">
                                                Handpicked for you
                                            </span>

                                            <h2>
                                                Featured Products
                                            </h2>

                                        </div>

                                        <a
                                            href="#latest-listings"
                                            className="view-all"
                                        >

                                            View marketplace

                                            <ArrowRight size={16} />

                                        </a>

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



                        {/* =====================================================
                            FLASH SALES
                        ===================================================== */}

                        {
                            flashSales.length > 0 && (

                                <section className="homepage-flash-section">

                                    <div className="homepage-container">

                                        <div className="section-heading homepage-listing-heading">

                                            <div>

                                                <span className="listing-eyebrow">
                                                    Limited opportunities
                                                </span>

                                                <h2>
                                                    Flash Sales
                                                </h2>

                                            </div>

                                            <a
                                                href="#latest-listings"
                                                className="view-all"
                                            >

                                                Explore deals

                                                <ArrowRight size={16} />

                                            </a>

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

                                    </div>

                                </section>

                            )
                        }



                        {/* =====================================================
                            LATEST
                        ===================================================== */}

                        {
                            latest.length > 0 && (

                                <section
                                    id="latest-listings"
                                    className="marketplace-section homepage-listing-section homepage-latest-section"
                                >

                                    <div className="section-heading homepage-listing-heading">

                                        <div>

                                            <span className="listing-eyebrow">
                                                Fresh from the community
                                            </span>

                                            <h2>
                                                Latest Listings
                                            </h2>

                                        </div>

                                        <a
                                            href="/marketplace"
                                            className="view-all"
                                        >

                                            View all listings

                                            <ArrowRight size={16} />

                                        </a>

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



                        {/* =====================================================
                            SELL CTA
                        ===================================================== */}

                        {
                            !isFiltering && (

                                <section className="homepage-seller-cta">

                                    <div className="homepage-container">

                                        <div className="homepage-seller-cta-inner">


                                            <div className="seller-cta-icon">

                                                <Store size={30} />

                                            </div>


                                            <div className="seller-cta-content">

                                                <span>
                                                    Have something to offer?
                                                </span>

                                                <h2>
                                                    Turn what you have into opportunity.
                                                </h2>

                                                <p>
                                                    List your products, services or
                                                    opportunities and connect with
                                                    people in your community.
                                                </p>

                                            </div>


                                            <a
                                                href="/create-listing"
                                                className="homepage-cta-button"
                                            >

                                                Start Selling

                                                <ArrowRight
                                                    size={18}
                                                />

                                            </a>

                                        </div>

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