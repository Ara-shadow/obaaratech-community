import "./ProductCard.css";


interface ProductCardProps{

listing:any;

}



export default function ProductCard({
listing
}:ProductCardProps){


return (

<div className="product-card">


{
listing.images?.length > 0 ?

<img

src={listing.images[0].url}

alt={listing.title}

/>

:

<div className="product-placeholder">

No Image

</div>

}



<div className="product-info">


<h3>

{listing.title}

</h3>



<p className="price">

₦{listing.price.toLocaleString()}

</p>



<p>

📍 {listing.location}

</p>



<p>

{
listing.owner?.verifiedSeller
?
"⭐ Verified Seller"
:
"Seller"
}

</p>


</div>


</div>

);

}