import {useEffect,useState} from "react";
import {getListings} from "../services/marketplace";
import ProductCard from "../components/ProductCard";


export default function MarketplaceHome(){

const [listings,setListings]=useState<any[]>([]);
const [loading,setLoading]=useState(true);


useEffect(()=>{

getListings()
.then(data=>{
setListings(data.listings);
})
.catch(console.error)
.finally(()=>{
setLoading(false);
});

},[]);



if(loading){
return <h2>Loading marketplace...</h2>
}


return (

<div className="marketplace">

<section className="hero">

<h1>
Obaaratech Marketplace
</h1>

<p>
Buy and sell trusted products around you.
</p>

</section>


<section className="products">

{
listings.map(item=>(
<ProductCard 
key={item.id}
listing={item}
/>
))
}

</section>


</div>

)

}