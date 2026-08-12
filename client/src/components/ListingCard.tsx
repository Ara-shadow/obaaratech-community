import {
    useNavigate
} from "react-router-dom";


import type {
    Listing
} from "../types/listing";



interface Props {

    listing: Listing;

}




export default function ListingCard({

    listing

}: Props){


    const navigate = useNavigate();




    return (


        <article

            className="product-card"

            onClick={()=>


                navigate(
                    `/product/${listing.id}`
                )


            }

        >





            <div className="product-image-container">





                {


                    listing.images &&

                    listing.images.length > 0 ? (



                        <img


                            className="product-image"


                            src={

                                listing.images[0].url

                            }


                            alt={

                                listing.title

                            }


                            loading="lazy"


                        />



                    )



                    :



                    (



                        <div className="no-image">


                            No Image


                        </div>



                    )



                }





            </div>









            <div className="product-info">






                <h3

                    className="product-title"

                >



                    {listing.title}



                </h3>









                <p

                    className="product-price"

                >



                    ₦

                    {


                        listing.price

                        ?

                        listing.price.toLocaleString()

                        :

                        "Contact Seller"



                    }



                </p>









                <p

                    className="product-location"

                >



                    📍 {listing.location}



                </p>









                <p

                    className="product-category"

                >



                    {


                        listing.category?.name

                    }



                </p>







                {


                    listing.condition && (



                        <p

                            className="product-condition"

                        >


                            Condition:

                            {" "}

                            {listing.condition}



                        </p>



                    )



                }







            </div>







        </article>


    );


}