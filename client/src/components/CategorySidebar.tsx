import "./CategorySidebar.css";

import {categories} from "../data/categories";


export default function CategorySidebar(){


return (

<aside className="category-sidebar">


<h3>
ALL CATEGORIES
</h3>



<ul>


{
categories.map(category=>(


<li 
key={category.name}
className="category-item"
>


<div className="category-title">

<span>

{category.icon}

</span>


{category.name}


<span className="arrow">

&gt;

</span>


</div>




<div className="subcategory-menu">


{
category.subcategories.map(sub=>(

<p key={sub}>

{sub}

</p>

))

}


</div>



</li>


))
}



</ul>



</aside>

);


}