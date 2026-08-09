import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {

  console.log("🌱 Creating categories...");

  const categories = [
    "Electronics",
    "Fashion",
    "Services",
    "Vehicles",
    "Real Estate",
    "Phones",
    "Computers",
    "Home Appliances",
    "Furniture",
    "Agriculture",
  ];


  for (const name of categories) {

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-");


    await prisma.category.upsert({

      where:{
        slug
      },

      update:{
        name
      },

      create:{
        name,
        slug
      }

    });

  }


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
      verifiedBadge:false,
    },


    {
      name:"PREMIUM",
      price:5000,
      duration:30,
      maxListings:50,
      imageLimit:10,
      featuredListing:true,
      prioritySearch:true,
      verifiedBadge:false,
    },


    {
      name:"BUSINESS",
      price:15000,
      duration:30,
      maxListings:200,
      imageLimit:50,
      featuredListing:true,
      prioritySearch:true,
      verifiedBadge:true,
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

.then(()=>{

  prisma.$disconnect();

})


.catch(async(error)=>{

  console.error(error);

  await prisma.$disconnect();

  process.exit(1);

});