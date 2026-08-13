import {
    useEffect,
    useState
} from "react";


import ListingCard from "../components/ListingCard";


import {
    getFavourites
} from "../api/favourites";


import type {
    Listing
} from "../types/listing";



export default function Favourites(){


    const [listings, setListings] =
        useState<Listing[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");



    useEffect(()=>{


        async function loadFavourites(){


            try {


                const data =
                    await getFavourites();


                setListings(data);



            } catch(err){


                console.error(err);


                setError(
                    "Failed to load favourites"
                );


            } finally {


                setLoading(false);


            }


        }


        loadFavourites();


    },[]);





    if(loading){


        return (

            <div className="page-container">

                <h2>
                    Loading favourites...
                </h2>

            </div>

        );

    }






    if(error){


        return (

            <div className="page-container">

                <h2>
                    {error}
                </h2>

            </div>

        );

    }






    return (


        <div className="page-container">


            <h1>
                ❤️ My Favourites
            </h1>




            {


                listings.length === 0 ?



                (

                    <div className="empty-state">


                        <h3>
                            No saved listings yet
                        </h3>


                        <p>
                            Browse the marketplace and save items you like.
                        </p>


                    </div>

                )



                :



                (

                    <div className="products-grid">


                        {

                            listings.map(

                                listing => (


                                    <ListingCard

                                        key={
                                            listing.id
                                        }

                                        listing={
                                            listing
                                        }

                                    />


                                )

                            )

                        }


                    </div>

                )


            }



        </div>


    );


}