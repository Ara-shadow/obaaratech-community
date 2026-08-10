export interface Category {

  name:string;

  icon:string;

  subcategories:string[];

}



export const categories:Category[] = [


{
name:"Phones & Tablets",
icon:"📱",
subcategories:[

"Smartphones",
"iPhones",
"Android Phones",
"Tablets",
"Phone Accessories",
"Chargers",
"Power Banks",
"Smart Watches"

]
},



{
name:"Computers & Accessories",
icon:"💻",
subcategories:[

"Laptops",
"Desktop Computers",
"Monitors",
"Printers",
"Computer Accessories",
"Networking Equipment"

]
},



{
name:"Electronics",
icon:"📺",
subcategories:[

"Televisions",
"Speakers",
"Cameras",
"Game Consoles",
"Home Electronics"

]
},



{
name:"Vehicles",
icon:"🚗",
subcategories:[

"Cars",
"Motorcycles",
"Trucks",
"Vehicle Spare Parts",
"Vehicle Accessories"

]
},



{
name:"Property",
icon:"🏠",
subcategories:[

"Houses For Sale",
"Houses For Rent",
"Land",
"Offices",
"Shops"

]
},



{
name:"Fashion",
icon:"👕",
subcategories:[

"Men's Clothing",
"Women's Clothing",
"Kids Fashion",
"Shoes",
"Bags",
"Watches"

]
},



{
name:"Home & Furniture",
icon:"🛋️",
subcategories:[

"Sofas",
"Beds",
"Tables",
"Kitchen Items",
"Decorations"

]
},



{
name:"Agriculture",
icon:"🌾",
subcategories:[

"Farm Produce",
"Livestock",
"Farm Equipment",
"Seeds"

]
},



{
name:"Services",
icon:"🛠️",
subcategories:[

"Repairs",
"Cleaning",
"Construction",
"Digital Services",
"Professional Services"

]
},



{
name:"Education",
icon:"📚",
subcategories:[

"Courses",
"Books",
"Training",
"Tutorials"

]
},



{
name:"Jobs",
icon:"💼",
subcategories:[

"Full Time",
"Part Time",
"Freelance",
"Internship"

]
},



{
name:"Others",
icon:"📦",
subcategories:[

"Everything Else"

]
}


];