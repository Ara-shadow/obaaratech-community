import { useEffect,useState } from "react";
import { getListings } from "../api/marketplace";


export default function Marketplace(){

const [listings,setListings] = useState<any[]>([]);


useEffect(()=>{

getListings()
.then(data=>{
    setListings(data.listings);
});

},[]);



return (

<div>

<h1>
Marketplace
</h1>


{
listings.map(item=>(

<div key={item.id}>

<h3>
{item.title}
</h3>

<p>
₦{item.price}
</p>

<p>
{item.location}
</p>

</div>

))

}


</div>

);

}