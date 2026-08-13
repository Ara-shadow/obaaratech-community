import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";


export default function Navbar() {

    const navigate =
        useNavigate();


    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();


    const {
        itemCount
    } = useCart();


    const [
        search,
        setSearch
    ] = useState("");


    function handleSearch(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        const value =
            search.trim();


        if (!value) {

            navigate("/");

            return;

        }


        navigate(
            `/?search=${encodeURIComponent(value)}`
        );

    }


    function handleLogout() {

        logout();

        navigate("/");

    }


    return (

        <header className="site-header">

            <div className="top-header">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="logo">

                    <Link to="/">

                        Obaaratech

                    </Link>

                </div>


                {/* =================================================
                    MARKETPLACE SEARCH
                ================================================= */}

                <form
                    className="search-box"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search products, services, jobs and categories"
                        aria-label="Search marketplace"
                    />


                    <button
                        type="submit"
                    >

                        🔍 Search

                    </button>

                </form>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="header-actions">


                    {isAuthenticated ? (

                        <>

                            {/* ACCOUNT */}

                            <Link to="/account">

                                👤{" "}
                                {user?.name ||
                                    "Account"}

                            </Link>


                            {/* PROFILE */}

                            <Link to="/profile">

                                Profile

                            </Link>


                            {/* CART */}

                            <Link to="/cart">

                                🛒 Cart

                                {itemCount > 0 && (

                                    <span
                                        style={{
                                            display:
                                                "inline-flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            minWidth:
                                                "20px",
                                            height:
                                                "20px",
                                            padding:
                                                "0 5px",
                                            marginLeft:
                                                "5px",
                                            borderRadius:
                                                "999px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                700,
                                            lineHeight:
                                                1
                                        }}
                                    >

                                        {itemCount}

                                    </span>

                                )}

                            </Link>


                            {/* SELL */}

                            <Link
                                className="sell-button"
                                to="/create-listing"
                            >

                                + Sell

                            </Link>


                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                            >

                                Logout

                            </button>

                        </>

                    ) : (

                        <>

                            {/* LOGIN */}

                            <Link to="/login">

                                👤 Login

                            </Link>


                            {/* REGISTER */}

                            <Link to="/register">

                                Register

                            </Link>


                            {/* CART */}

                            <Link to="/cart">

                                🛒 Cart

                                {itemCount > 0 && (

                                    <span
                                        style={{
                                            display:
                                                "inline-flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            minWidth:
                                                "20px",
                                            height:
                                                "20px",
                                            padding:
                                                "0 5px",
                                            marginLeft:
                                                "5px",
                                            borderRadius:
                                                "999px",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                700,
                                            lineHeight:
                                                1
                                        }}
                                    >

                                        {itemCount}

                                    </span>

                                )}

                            </Link>


                            {/* SELL */}

                            <Link
                                className="sell-button"
                                to="/create-listing"
                            >

                                + Sell

                            </Link>

                        </>

                    )}

                </div>

            </div>

        </header>

    );

}