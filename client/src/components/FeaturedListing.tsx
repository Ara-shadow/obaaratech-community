import {
    useNavigate
} from "react-router-dom";

import type {
    Listing
} from "../types/listing";


interface Props {
    listing: Listing;
}


export default function FeaturedListing({
    listing
}: Props) {

    const navigate = useNavigate();

    const hasImage =
        listing.images &&
        listing.images.length > 0;


    return (

        <section
            className="featured-card"
            onClick={() =>
                navigate(
                    `/product/${listing.id}`
                )
            }
        >

            <div className="featured-image">

                {hasImage ? (

                    <img
                        src={listing.images[0].url}
                        alt={listing.title}
                    />

                ) : (

                    <div className="no-image">
                        No Image Available
                    </div>

                )}

            </div>


            <div className="featured-info">

                <span>
                    ⭐ Featured Product
                </span>


                <h1>
                    {listing.title}
                </h1>


                <h2>

                    {listing.price !== null &&
                     listing.price !== undefined

                        ? `₦${listing.price.toLocaleString()}`

                        : "Contact Seller"}

                </h2>


                {listing.location && (

                    <p>
                        📍 {listing.location}
                    </p>

                )}


                {listing.condition && (

                    <p>
                        Condition:{" "}
                        <strong>
                            {listing.condition}
                        </strong>
                    </p>

                )}


                <button
                    type="button"
                    onClick={(event) => {

                        event.stopPropagation();

                        navigate(
                            `/product/${listing.id}`
                        );

                    }}
                >
                    View Details
                </button>

            </div>

        </section>

    );
}