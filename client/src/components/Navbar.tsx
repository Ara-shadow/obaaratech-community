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


export default function Navbar() {

    const navigate = useNavigate();

const {
    user,
    isAuthenticated,
    logout
} = useAuth();

    const [
        search,
        setSearch
    ] = useState("");


    function handleSearch(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        const value = search.trim();


        if (!value) {

            navigate("/");

            return;

        }


        navigate(
            `/?search=${encodeURIComponent(value)}`
        );

    }


    return (

        <header className="site-header">

            <div className="top-header">


                {/* LOGO */}

                <div className="logo">

                    <Link to="/">

                        Obaaratech

                    </Link>

                </div>


                {/* MARKETPLACE SEARCH */}

                <form
                    className="search-box"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search products, services, jobs and categories"
                        aria-label="Search marketplace"
                    />

                    <button type="submit">

                        🔍 Search

                    </button>

                </form>


                  {/* ACTIONS */}

        <div className="header-actions">

            {
                isAuthenticated ? (

                    <>

                        <Link to="/account">

    👤 {user?.name || "Account"}

</Link>


                        <Link to="/cart">

                            🛒 Cart

                        </Link>


                        <Link
                            className="sell-button"
                            to="/create-listing"
                        >

                            + Sell

                        </Link>


                        <button
                            type="button"
                            onClick={() => {

                                logout();

                                navigate("/");

                            }}
                        >

                            Logout

                        </button>


                    </>


                ) : (

                    <>

                        <Link to="/login">

                            👤 Login

                        </Link>


                        <Link to="/register">

                            Register

                        </Link>


                        <Link to="/cart">

                            🛒 Cart

                        </Link>


                        <Link
                            className="sell-button"
                            to="/create-listing"
                        >

                            + Sell

                        </Link>


                    </>

                )

            }

        </div>


            </div>

        </header>

    );

}