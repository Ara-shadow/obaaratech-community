import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


type CategorySeed = {

  name:string;

  slug:string;

  children?:CategorySeed[];

};



async function createCategoryTree(
  items:CategorySeed[],
  parentId?:string
){


  for(const item of items){


    const category =
      await prisma.category.upsert({


        where:{
          slug:item.slug
        },


        update:{

          name:item.name,

          parentId

        },


        create:{

          name:item.name,

          slug:item.slug,

          parentId

        }


      });



    if(
      item.children &&
      item.children.length > 0
    ){

      await createCategoryTree(
        item.children,
        category.id
      );

    }


  }


}




async function main(){



console.log("🗑 Removing old categories...");


// remove old flat categories
console.log("🗑 Removing old categories...");

await prisma.listing.updateMany({
  data:{
    categoryId:null
  }
});

await prisma.category.deleteMany();



console.log("🌳 Creating marketplace categories...");



const categories:CategorySeed[] = [



{
name:"Phones & Tablets",
slug:"phones-tablets",

children:[


{
name:"Smartphones",
slug:"smartphones",

children:[

{
name:"iPhone",
slug:"iphone"
},

{
name:"Android Phones",
slug:"android-phones"
},

{
name:"Samsung Phones",
slug:"samsung-phones"
}

]

},



{
name:"Tablets",
slug:"tablets",

children:[

{
name:"iPads",
slug:"ipads"
},

{
name:"Android Tablets",
slug:"android-tablets"
},

{
name:"Kids Tablets",
slug:"kids-tablets"
}

]

},



{
name:"Mobile Accessories",
slug:"mobile-accessories",

children:[

{
name:"Power Banks",
slug:"power-banks"
},

{
name:"Phone Cases",
slug:"phone-cases"
},

{
name:"Chargers",
slug:"chargers"
},

{
name:"Bluetooth Headsets",
slug:"bluetooth-headsets"
}

]

}



]

},





{
name:"Electronics",
slug:"electronics",

children:[


{
name:"Television & Video",
slug:"television-video",

children:[

{
name:"Smart TVs",
slug:"smart-tvs"
},

{
name:"LED Monitors",
slug:"led-monitors"
},

{
name:"Home Theater",
slug:"home-theater"
}

]

},



{
name:"Audio",
slug:"audio",

children:[

{
name:"Bluetooth Speakers",
slug:"bluetooth-speakers"
},

{
name:"Soundbars",
slug:"soundbars"
},

{
name:"Headphones",
slug:"headphones"
}

]

},



{
name:"Cameras",
slug:"cameras",

children:[

{
name:"Digital Cameras",
slug:"digital-cameras"
},

{
name:"Security Cameras",
slug:"security-cameras"
},

{
name:"Drones",
slug:"drones"
}

]

}



]

},





{
name:"Computing",
slug:"computing",

children:[


{
name:"Laptops",
slug:"laptops",

children:[

{
name:"Gaming Laptops",
slug:"gaming-laptops"
},

{
name:"Business Laptops",
slug:"business-laptops"
}

]

},



{
name:"Computer Accessories",
slug:"computer-accessories",

children:[

{
name:"Hard Drives",
slug:"hard-drives"
},

{
name:"USB Drives",
slug:"usb-drives"
},

{
name:"Printers",
slug:"printers"
},

{
name:"Routers",
slug:"routers"
}

]

}



]

},





{
name:"Fashion",
slug:"fashion",

children:[


{
name:"Clothing",
slug:"clothing",

children:[

{
name:"T-Shirts",
slug:"t-shirts"
},

{
name:"Jeans",
slug:"jeans"
},

{
name:"Native Wear",
slug:"native-wear"
}

]

},



{
name:"Footwear",
slug:"footwear",

children:[

{
name:"Sneakers",
slug:"sneakers"
},

{
name:"Corporate Shoes",
slug:"corporate-shoes"
},

{
name:"Slides",
slug:"slides"
}

]

},



{
name:"Accessories",
slug:"fashion-accessories",

children:[

{
name:"Wrist Watches",
slug:"wrist-watches"
},

{
name:"Jewelry",
slug:"jewelry"
},

{
name:"Handbags",
slug:"handbags"
}

]

}



]

},





{
name:"Home & Office",
slug:"home-office",

children:[


{
name:"Appliances",
slug:"appliances",

children:[

{
name:"Blenders",
slug:"blenders"
},

{
name:"Air Fryers",
slug:"air-fryers"
},

{
name:"Microwaves",
slug:"microwaves"
}

]

},



{
name:"Furniture",
slug:"furniture",

children:[

{
name:"Office Chairs",
slug:"office-chairs"
},

{
name:"Desks",
slug:"desks"
},

{
name:"Mattresses",
slug:"mattresses"
}

]

}



]

},





{
name:"Gaming",
slug:"gaming",

children:[


{
name:"Consoles",
slug:"consoles",

children:[

{
name:"PlayStation",
slug:"playstation"
},

{
name:"Xbox",
slug:"xbox"
},

{
name:"Nintendo Switch",
slug:"nintendo-switch"
}

]

},



{
name:"Gaming Accessories",
slug:"gaming-accessories",

children:[

{
name:"Controllers",
slug:"controllers"
},

{
name:"Gaming Headsets",
slug:"gaming-headsets"
}

]

}



]

},





{
name:"Jobs",
slug:"jobs",

children:[


{
name:"Information Technology",
slug:"information-technology",

children:[

{
name:"Software Development",
slug:"software-development"
},

{
name:"Cybersecurity",
slug:"cybersecurity"
},

{
name:"Data & AI",
slug:"data-ai"
}

]

},



{
name:"Business & Finance",
slug:"business-finance",

children:[

{
name:"Accounting",
slug:"accounting"
},

{
name:"Human Resources",
slug:"human-resources"
}

]

},



{
name:"Healthcare",
slug:"healthcare",

children:[

{
name:"Doctors",
slug:"doctors"
},

{
name:"Nurses",
slug:"nurses"
}

]

}



]

}



];



await createCategoryTree(categories);



console.log("✅ Categories created");





console.log("🌱 Creating seller plans...");



const plans = [


{
name:"FREE",
price:0,
duration:30,
maxListings:5,
imageLimit:3,
featuredListing:false,
prioritySearch:false,
verifiedBadge:false
},



{
name:"PREMIUM",
price:5000,
duration:30,
maxListings:50,
imageLimit:10,
featuredListing:true,
prioritySearch:true,
verifiedBadge:false
},



{
name:"BUSINESS",
price:15000,
duration:30,
maxListings:150,
imageLimit:30,
featuredListing:true,
prioritySearch:true,
verifiedBadge:true
}


];




for(const plan of plans){


await prisma.sellerPlan.upsert({

where:{
name:plan.name
},

update:plan,

create:plan

});


}



console.log("✅ Seller plans created");

console.log("🎉 Database seeded successfully");



}





main()

.then(async()=>{

await prisma.$disconnect();

console.log("Database disconnected");

})


.catch(async(error)=>{

console.error(error);

await prisma.$disconnect();

process.exit(1);

});