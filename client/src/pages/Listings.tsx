import {
useEffect,
useState
} from "react";


import {
getListings
} from "../services/listing.service";


import type {
Listing
} from "../types/listing";


import ListingCard
from "../components/ListingCard";



export default function Listings(){


const [listings,setListings]=
useState<Listing[]>([]);



useEffect(()=>{


getListings()
.then(setListings);


},[]);



return (

<div>


<h1>
Marketplace
</h1>


<div className="listing-grid">


{
listings.map(item=>(

<ListingCard

key={item.id}

listing={item}

/>

))

}


</div>


</div>

);


}