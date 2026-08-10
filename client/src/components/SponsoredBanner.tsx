import { useEffect, useState } from "react";
import "./SponsoredBanner.css";


const banners = [

{
title:"Premium Laptop Deals",
text:"Get quality laptops from verified sellers",
button:"Shop Now",
image:"💻"
},


{
title:"Real Estate Opportunities",
text:"Find your dream property around Nigeria",
button:"Explore",
image:"🏠"
},


{
title:"Verified Sellers",
text:"Buy with confidence from trusted vendors",
button:"View Sellers",
image:"⭐"
}


];


export default function SponsoredBanner(){


const [current,setCurrent]=useState(0);



useEffect(()=>{


const timer=setInterval(()=>{


setCurrent(prev=>
(prev+1)%banners.length
);


},5000);



return()=>clearInterval(timer);


},[]);



const banner=banners[current];



return (

<section className="sponsored-banner">


<div className="banner-icon">

{banner.image}

</div>


<div className="banner-content">


<h2>
{banner.title}
</h2>


<p>
{banner.text}
</p>


<button>
{banner.button}
</button>


</div>


<div className="dots">


{
banners.map((_,index)=>(


<span

key={index}

className={
index===current
?"active-dot"
:""
}

/>


))
}


</div>


</section>

);

}