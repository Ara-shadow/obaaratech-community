import {
    useState
} from "react";


interface SearchBarProps {

    onSearch?: (
        query: string,
        category: string,
        location: string
    ) => void;

}



export default function SearchBar({

    onSearch

}: SearchBarProps){


    const [
        query,
        setQuery
    ] = useState("");


    const [
        category,
        setCategory
    ] = useState("");


    const [
        location,
        setLocation
    ] = useState("");



    function handleSearch(){

        if(onSearch){

            onSearch(
                query,
                category,
                location
            );

        }

        else{

            console.log({

                query,

                category,

                location

            });

        }

    }



    return (

        <div className="marketplace-search">


            <div className="marketplace-search-field">


                <input

                    type="text"

                    value={query}

                    onChange={(event) =>
                        setQuery(
                            event.target.value
                        )
                    }

                    placeholder="What are you looking for?"

                />


            </div>



            <select

                value={category}

                onChange={(event) =>
                    setCategory(
                        event.target.value
                    )
                }

            >

                <option value="">
                    All Categories
                </option>

                <option value="electronics">
                    Electronics
                </option>

                <option value="phones">
                    Phones & Tablets
                </option>

                <option value="computers">
                    Computers
                </option>

                <option value="fashion">
                    Fashion
                </option>

                <option value="home">
                    Home & Kitchen
                </option>

                <option value="vehicles">
                    Vehicles
                </option>

                <option value="services">
                    Services
                </option>

            </select>



            <select

                value={location}

                onChange={(event) =>
                    setLocation(
                        event.target.value
                    )
                }

            >

                <option value="">
                    All Locations
                </option>

                <option value="lagos">
                    Lagos
                </option>

                <option value="abuja">
                    Abuja
                </option>

                <option value="ibadan">
                    Ibadan
                </option>

                <option value="port-harcourt">
                    Port Harcourt
                </option>

                <option value="benin">
                    Benin City
                </option>

            </select>



            <button

                type="button"

                onClick={handleSearch}

            >

                Search

            </button>


        </div>

    );

}