type Props = {
 name:string;
 icon:string;
}


export default function CategoryCard({
name,
icon
}:Props){


return (

<div className="category-card">

<div className="category-icon">
{icon}
</div>


<h3>
{name}
</h3>


</div>

);

}