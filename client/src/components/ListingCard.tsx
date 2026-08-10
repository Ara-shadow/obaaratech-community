type Props = {
  listing:any;
};


export default function ListingCard({listing}:Props){

return (

<div className="listing-card">

<h3>
{listing.title}
</h3>


<p>
₦{listing.price?.toLocaleString()}
</p>


<p>
{listing.location}
</p>


{
listing.owner?.verifiedSeller && (

<span>
Verified Seller
</span>

)

}


</div>

);

}