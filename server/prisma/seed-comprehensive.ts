import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CategorySeed = {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  children?: CategorySeed[];
};

async function createCategoryTree(
  items: CategorySeed[],
  parentId?: string
) {
  for (const item of items) {
    const category = await prisma.category.upsert({
      where: {
        slug: item.slug
      },
      update: {
        name: item.name,
        parentId,
        description: item.description,
        icon: item.icon
      },
      create: {
        name: item.name,
        slug: item.slug,
        parentId,
        description: item.description,
        icon: item.icon
      }
    });

    if (item.children && item.children.length > 0) {
      await createCategoryTree(item.children, category.id);
    }
  }
}

async function main() {
  console.log("🗑 Removing old categories...");

  await prisma.listing.updateMany({
    data: {
      categoryId: null
    }
  });

  await prisma.category.deleteMany();

  console.log("🌳 Creating comprehensive marketplace categories...");

  const categories: CategorySeed[] = [
    // ========================================
    // FOOD & GROCERIES
    // ========================================
    {
      name: "Food & Groceries",
      slug: "food-groceries",
      description: "Food, groceries, and consumables",
      icon: "🛒",
      children: [
        {
          name: "Groceries",
          slug: "groceries",
          children: [
            { name: "Grains & Cereals", slug: "grains-cereals" },
            { name: "Spices & Seasonings", slug: "spices-seasonings" },
            { name: "Cooking Oils", slug: "cooking-oils" },
            { name: "Salt & Sugar", slug: "salt-sugar" }
          ]
        },
        {
          name: "Fruits & Vegetables",
          slug: "fruits-vegetables",
          children: [
            { name: "Fresh Fruits", slug: "fresh-fruits" },
            { name: "Fresh Vegetables", slug: "fresh-vegetables" },
            { name: "Dried Fruits", slug: "dried-fruits" },
            { name: "Root Vegetables", slug: "root-vegetables" }
          ]
        },
        {
          name: "Meat & Poultry",
          slug: "meat-poultry",
          children: [
            { name: "Fresh Meat", slug: "fresh-meat" },
            { name: "Fresh Poultry", slug: "fresh-poultry" },
            { name: "Processed Meat", slug: "processed-meat" }
          ]
        },
        {
          name: "Fish & Seafood",
          slug: "fish-seafood",
          children: [
            { name: "Fresh Fish", slug: "fresh-fish" },
            { name: "Dried Fish", slug: "dried-fish" },
            { name: "Seafood", slug: "seafood" }
          ]
        },
        {
          name: "Dairy & Eggs",
          slug: "dairy-eggs",
          children: [
            { name: "Fresh Milk", slug: "fresh-milk" },
            { name: "Cheese & Butter", slug: "cheese-butter" },
            { name: "Eggs", slug: "eggs" },
            { name: "Yogurt", slug: "yogurt" }
          ]
        },
        {
          name: "Bread & Bakery",
          slug: "bread-bakery",
          children: [
            { name: "Bread", slug: "bread" },
            { name: "Pastries", slug: "pastries" },
            { name: "Cakes", slug: "cakes" },
            { name: "Baking Ingredients", slug: "baking-ingredients" }
          ]
        },
        {
          name: "Drinks & Beverages",
          slug: "drinks-beverages",
          children: [
            { name: "Soft Drinks", slug: "soft-drinks" },
            { name: "Juices", slug: "juices" },
            { name: "Tea & Coffee", slug: "tea-coffee" },
            { name: "Water & Purifiers", slug: "water-purifiers" },
            { name: "Alcohol", slug: "alcohol" }
          ]
        },
        {
          name: "Snacks & Confectionery",
          slug: "snacks-confectionery",
          children: [
            { name: "Biscuits", slug: "biscuits" },
            { name: "Sweets & Candy", slug: "sweets-candy" },
            { name: "Nuts & Seeds", slug: "nuts-seeds" },
            { name: "Chips & Crackers", slug: "chips-crackers" }
          ]
        },
        {
          name: "Cooking Ingredients",
          slug: "cooking-ingredients",
          children: [
            { name: "Sauces & Pastes", slug: "sauces-pastes" },
            { name: "Flavorings & Extracts", slug: "flavorings-extracts" },
            { name: "Vinegar & Condiments", slug: "vinegar-condiments" }
          ]
        },
        {
          name: "Frozen Foods",
          slug: "frozen-foods",
          children: [
            { name: "Frozen Vegetables", slug: "frozen-vegetables" },
            { name: "Frozen Meats", slug: "frozen-meats" },
            { name: "Frozen Meals", slug: "frozen-meals" }
          ]
        },
        {
          name: "Household Consumables",
          slug: "household-consumables",
          children: [
            { name: "Detergents", slug: "detergents" },
            { name: "Cleaning Products", slug: "cleaning-products" },
            { name: "Toiletries", slug: "toiletries" }
          ]
        }
      ]
    },

    // ========================================
    // ELECTRONICS
    // ========================================
    {
      name: "Electronics",
      slug: "electronics",
      description: "Electrical and electronic devices",
      icon: "⚡",
      children: [
        {
          name: "Phones & Tablets",
          slug: "phones-tablets",
          children: [
            {
              name: "Smartphones",
              slug: "smartphones",
              children: [
                { name: "iPhone", slug: "iphone" },
                { name: "Android Phones", slug: "android-phones" },
                { name: "Samsung Phones", slug: "samsung-phones" }
              ]
            },
            {
              name: "Tablets",
              slug: "tablets",
              children: [
                { name: "iPads", slug: "ipads" },
                { name: "Android Tablets", slug: "android-tablets" }
              ]
            },
            {
              name: "Mobile Accessories",
              slug: "mobile-accessories",
              children: [
                { name: "Power Banks", slug: "power-banks" },
                { name: "Phone Cases", slug: "phone-cases" },
                { name: "Chargers", slug: "chargers" },
                { name: "Bluetooth Headsets", slug: "bluetooth-headsets" },
                { name: "Screen Protectors", slug: "screen-protectors" }
              ]
            }
          ]
        },
        {
          name: "Television & Video",
          slug: "television-video",
          children: [
            { name: "Smart TVs", slug: "smart-tvs" },
            { name: "LED Monitors", slug: "led-monitors" },
            { name: "Home Theater Systems", slug: "home-theater" },
            { name: "Projectors", slug: "projectors" }
          ]
        },
        {
          name: "Audio & Music",
          slug: "audio-music",
          children: [
            { name: "Bluetooth Speakers", slug: "bluetooth-speakers" },
            { name: "Soundbars", slug: "soundbars" },
            { name: "Headphones", slug: "headphones" },
            { name: "Earbuds", slug: "earbuds" },
            { name: "Microphones", slug: "microphones" }
          ]
        },
        {
          name: "Cameras",
          slug: "cameras",
          children: [
            { name: "Digital Cameras", slug: "digital-cameras" },
            { name: "Security Cameras", slug: "security-cameras" },
            { name: "Drones", slug: "drones" },
            { name: "Camera Lenses", slug: "camera-lenses" }
          ]
        },
        {
          name: "Computing",
          slug: "computing",
          children: [
            {
              name: "Laptops",
              slug: "laptops",
              children: [
                { name: "Gaming Laptops", slug: "gaming-laptops" },
                { name: "Business Laptops", slug: "business-laptops" },
                { name: "Ultrabooks", slug: "ultrabooks" }
              ]
            },
            {
              name: "Desktops",
              slug: "desktops",
              children: [
                { name: "Gaming PCs", slug: "gaming-pcs" },
                { name: "Office PCs", slug: "office-pcs" },
                { name: "Workstations", slug: "workstations" }
              ]
            },
            {
              name: "Computer Accessories",
              slug: "computer-accessories",
              children: [
                { name: "Hard Drives & SSDs", slug: "hard-drives-ssd" },
                { name: "RAM & Memory", slug: "ram-memory" },
                { name: "Keyboards & Mice", slug: "keyboards-mice" },
                { name: "Cables & Converters", slug: "cables-converters" },
                { name: "Printers", slug: "printers" }
              ]
            }
          ]
        }
      ]
    },

    // ========================================
    // FASHION & BEAUTY
    // ========================================
    {
      name: "Fashion & Beauty",
      slug: "fashion-beauty",
      description: "Clothing, footwear, and beauty products",
      icon: "👗",
      children: [
        {
          name: "Clothing",
          slug: "clothing",
          children: [
            { name: "Men's Clothing", slug: "mens-clothing" },
            { name: "Women's Clothing", slug: "womens-clothing" },
            { name: "Children's Clothing", slug: "childrens-clothing" },
            { name: "Traditional/Native Wear", slug: "traditional-wear" },
            { name: "Uniforms", slug: "uniforms" }
          ]
        },
        {
          name: "Footwear",
          slug: "footwear",
          children: [
            { name: "Sneakers", slug: "sneakers" },
            { name: "Formal Shoes", slug: "formal-shoes" },
            { name: "Casual Shoes", slug: "casual-shoes" },
            { name: "Sports Shoes", slug: "sports-shoes" },
            { name: "Sandals & Slippers", slug: "sandals-slippers" }
          ]
        },
        {
          name: "Accessories",
          slug: "fashion-accessories",
          children: [
            { name: "Wrist Watches", slug: "wrist-watches" },
            { name: "Jewelry", slug: "jewelry" },
            { name: "Handbags", slug: "handbags" },
            { name: "Belts", slug: "belts" },
            { name: "Scarves & Ties", slug: "scarves-ties" },
            { name: "Sunglasses", slug: "sunglasses" }
          ]
        },
        {
          name: "Beauty & Personal Care",
          slug: "beauty-personal-care",
          children: [
            { name: "Skincare", slug: "skincare" },
            { name: "Hair Care", slug: "hair-care" },
            { name: "Makeup", slug: "makeup" },
            { name: "Fragrances", slug: "fragrances" },
            { name: "Body Care", slug: "body-care" },
            { name: "Oral Care", slug: "oral-care" }
          ]
        },
        {
          name: "Health & Wellness",
          slug: "health-wellness",
          children: [
            { name: "Vitamins & Supplements", slug: "vitamins-supplements" },
            { name: "Medical Supplies", slug: "medical-supplies" },
            { name: "Fitness Supplements", slug: "fitness-supplements" }
          ]
        }
      ]
    },

    // ========================================
    // HOME & OFFICE
    // ========================================
    {
      name: "Home & Living",
      slug: "home-living",
      description: "Furniture, appliances, and home decor",
      icon: "🏠",
      children: [
        {
          name: "Furniture",
          slug: "furniture",
          children: [
            { name: "Living Room Furniture", slug: "living-room-furniture" },
            { name: "Bedroom Furniture", slug: "bedroom-furniture" },
            { name: "Office Furniture", slug: "office-furniture" },
            { name: "Kitchen Furniture", slug: "kitchen-furniture" },
            { name: "Dining Furniture", slug: "dining-furniture" }
          ]
        },
        {
          name: "Home Appliances",
          slug: "home-appliances",
          children: [
            { name: "Kitchen Appliances", slug: "kitchen-appliances" },
            { name: "Refrigerators", slug: "refrigerators" },
            { name: "Washing Machines", slug: "washing-machines" },
            { name: "Air Conditioners", slug: "air-conditioners" },
            { name: "Water Dispensers", slug: "water-dispensers" }
          ]
        },
        {
          name: "Home Decor",
          slug: "home-decor",
          children: [
            { name: "Wall Art & Paintings", slug: "wall-art" },
            { name: "Curtains & Blinds", slug: "curtains-blinds" },
            { name: "Carpets & Rugs", slug: "carpets-rugs" },
            { name: "Lighting", slug: "lighting" },
            { name: "Mirrors", slug: "mirrors" }
          ]
        },
        {
          name: "Bedding & Linens",
          slug: "bedding-linens",
          children: [
            { name: "Bed Sheets", slug: "bed-sheets" },
            { name: "Pillows", slug: "pillows" },
            { name: "Mattresses", slug: "mattresses" },
            { name: "Comforters", slug: "comforters" }
          ]
        },
        {
          name: "Kitchen & Dining",
          slug: "kitchen-dining",
          children: [
            { name: "Cookware", slug: "cookware" },
            { name: "Cutlery", slug: "cutlery" },
            { name: "Dinnerware", slug: "dinnerware" },
            { name: "Glassware", slug: "glassware" }
          ]
        }
      ]
    },

    // ========================================
    // SPORTS & RECREATION
    // ========================================
    {
      name: "Sports & Recreation",
      slug: "sports-recreation",
      description: "Sports equipment and outdoor activities",
      icon: "⚽",
      children: [
        {
          name: "Sports Equipment",
          slug: "sports-equipment",
          children: [
            { name: "Ball Sports", slug: "ball-sports" },
            { name: "Racket Sports", slug: "racket-sports" },
            { name: "Water Sports", slug: "water-sports" },
            { name: "Winter Sports", slug: "winter-sports" },
            { name: "Fitness Equipment", slug: "fitness-equipment" }
          ]
        },
        {
          name: "Fitness & Gym",
          slug: "fitness-gym",
          children: [
            { name: "Dumbbells & Weights", slug: "dumbbells-weights" },
            { name: "Gym Machines", slug: "gym-machines" },
            { name: "Yoga Mats", slug: "yoga-mats" },
            { name: "Resistance Bands", slug: "resistance-bands" }
          ]
        },
        {
          name: "Outdoor & Camping",
          slug: "outdoor-camping",
          children: [
            { name: "Tents & Shelters", slug: "tents-shelters" },
            { name: "Camping Gear", slug: "camping-gear" },
            { name: "Hiking Equipment", slug: "hiking-equipment" },
            { name: "Backpacks", slug: "backpacks" }
          ]
        },
        {
          name: "Gaming & Entertainment",
          slug: "gaming-entertainment",
          children: [
            {
              name: "Gaming Consoles",
              slug: "gaming-consoles",
              children: [
                { name: "PlayStation", slug: "playstation" },
                { name: "Xbox", slug: "xbox" },
                { name: "Nintendo", slug: "nintendo" }
              ]
            },
            {
              name: "Gaming Accessories",
              slug: "gaming-accessories",
              children: [
                { name: "Controllers", slug: "controllers" },
                { name: "Gaming Headsets", slug: "gaming-headsets" },
                { name: "Gaming Mice", slug: "gaming-mice" },
                { name: "Gaming Keyboards", slug: "gaming-keyboards" }
              ]
            },
            { name: "Board Games", slug: "board-games" },
            { name: "Toys", slug: "toys" }
          ]
        }
      ]
    },

    // ========================================
    // VEHICLES & AUTOMOTIVE
    // ========================================
    {
      name: "Vehicles & Automotive",
      slug: "vehicles-automotive",
      description: "Cars, motorcycles, and automotive parts",
      icon: "🚗",
      children: [
        {
          name: "Cars",
          slug: "cars",
          children: [
            { name: "Sedans", slug: "sedans" },
            { name: "SUVs & Crossovers", slug: "suvs-crossovers" },
            { name: "Hatchbacks", slug: "hatchbacks" },
            { name: "Vans & Minivans", slug: "vans-minivans" }
          ]
        },
        {
          name: "Motorcycles & Scooters",
          slug: "motorcycles-scooters",
          children: [
            { name: "Motorcycles", slug: "motorcycles" },
            { name: "Scooters", slug: "scooters" },
            { name: "Tricycles", slug: "tricycles" }
          ]
        },
        {
          name: "Auto Parts & Accessories",
          slug: "auto-parts-accessories",
          children: [
            { name: "Engine Parts", slug: "engine-parts" },
            { name: "Tires & Wheels", slug: "tires-wheels" },
            { name: "Car Electronics", slug: "car-electronics" },
            { name: "Car Maintenance", slug: "car-maintenance" },
            { name: "Car Accessories", slug: "car-accessories" }
          ]
        }
      ]
    },

    // ========================================
    // REAL ESTATE
    // ========================================
    {
      name: "Real Estate",
      slug: "real-estate",
      description: "Property listings and real estate services",
      icon: "🏘️",
      children: [
        {
          name: "Residential",
          slug: "residential",
          children: [
            { name: "Houses", slug: "houses" },
            { name: "Apartments", slug: "apartments" },
            { name: "Studios", slug: "studios" },
            { name: "Flats", slug: "flats" }
          ]
        },
        {
          name: "Commercial",
          slug: "commercial",
          children: [
            { name: "Office Space", slug: "office-space" },
            { name: "Retail Space", slug: "retail-space" },
            { name: "Warehouses", slug: "warehouses" },
            { name: "Industrial Property", slug: "industrial-property" }
          ]
        },
        {
          name: "Land",
          slug: "land",
          children: [
            { name: "Residential Land", slug: "residential-land" },
            { name: "Commercial Land", slug: "commercial-land" },
            { name: "Agricultural Land", slug: "agricultural-land" }
          ]
        },
        {
          name: "Property Services",
          slug: "property-services",
          children: [
            { name: "Real Estate Agents", slug: "real-estate-agents" },
            { name: "Property Management", slug: "property-management" },
            { name: "Property Valuation", slug: "property-valuation" }
          ]
        }
      ]
    },

    // ========================================
    // AGRICULTURE & FARMING
    // ========================================
    {
      name: "Agriculture & Farming",
      slug: "agriculture-farming",
      description: "Agricultural products and farming supplies",
      icon: "🌾",
      children: [
        {
          name: "Farm Produce",
          slug: "farm-produce",
          children: [
            { name: "Crops", slug: "crops" },
            { name: "Livestock", slug: "livestock" },
            { name: "Poultry", slug: "poultry" },
            { name: "Fish & Aquaculture", slug: "fish-aquaculture" }
          ]
        },
        {
          name: "Farming Equipment",
          slug: "farming-equipment",
          children: [
            { name: "Tractors", slug: "tractors" },
            { name: "Farm Tools", slug: "farm-tools" },
            { name: "Irrigation Equipment", slug: "irrigation-equipment" },
            { name: "Processing Equipment", slug: "processing-equipment" }
          ]
        },
        {
          name: "Agricultural Inputs",
          slug: "agricultural-inputs",
          children: [
            { name: "Seeds", slug: "seeds" },
            { name: "Fertilizers", slug: "fertilizers" },
            { name: "Pesticides", slug: "pesticides" },
            { name: "Animal Feed", slug: "animal-feed" }
          ]
        }
      ]
    },

    // ========================================
    // BABY, KIDS & EDUCATION
    // ========================================
    {
      name: "Baby, Kids & Education",
      slug: "baby-kids-education",
      description: "Products and services for children and education",
      icon: "👶",
      children: [
        {
          name: "Baby & Infant",
          slug: "baby-infant",
          children: [
            { name: "Baby Clothing", slug: "baby-clothing" },
            { name: "Diapers & Wipes", slug: "diapers-wipes" },
            { name: "Baby Furniture", slug: "baby-furniture" },
            { name: "Baby Care Products", slug: "baby-care-products" },
            { name: "Toys for Babies", slug: "baby-toys" }
          ]
        },
        {
          name: "Kids Furniture & Gear",
          slug: "kids-furniture-gear",
          children: [
            { name: "Kids Beds", slug: "kids-beds" },
            { name: "School Bags", slug: "school-bags" },
            { name: "Kids Bicycles", slug: "kids-bicycles" }
          ]
        },
        {
          name: "Education & Learning",
          slug: "education-learning",
          children: [
            { name: "Books & Textbooks", slug: "books-textbooks" },
            { name: "Educational Toys", slug: "educational-toys" },
            { name: "School Supplies", slug: "school-supplies" },
            { name: "Online Courses", slug: "online-courses" },
            { name: "Tutoring Services", slug: "tutoring-services" }
          ]
        }
      ]
    },

    // ========================================
    // JOBS & SERVICES
    // ========================================
    {
      name: "Jobs & Services",
      slug: "jobs-services",
      description: "Services and job listings",
      icon: "💼",
      children: [
        {
          name: "Professional Services",
          slug: "professional-services",
          children: [
            { name: "Consulting", slug: "consulting" },
            { name: "IT Services", slug: "it-services" },
            { name: "Design Services", slug: "design-services" },
            { name: "Translation", slug: "translation" },
            { name: "Writing & Editing", slug: "writing-editing" }
          ]
        },
        {
          name: "Trade & Repair",
          slug: "trade-repair",
          children: [
            { name: "Plumbing", slug: "plumbing" },
            { name: "Electrical", slug: "electrical" },
            { name: "Carpentry", slug: "carpentry" },
            { name: "HVAC & Cooling", slug: "hvac-cooling" },
            { name: "Appliance Repair", slug: "appliance-repair" }
          ]
        },
        {
          name: "Cleaning & Maintenance",
          slug: "cleaning-maintenance",
          children: [
            { name: "House Cleaning", slug: "house-cleaning" },
            { name: "Office Cleaning", slug: "office-cleaning" },
            { name: "Pest Control", slug: "pest-control" },
            { name: "Landscaping", slug: "landscaping" }
          ]
        },
        {
          name: "Job Listings",
          slug: "job-listings",
          children: [
            { name: "Full Time Jobs", slug: "full-time-jobs" },
            { name: "Part Time Jobs", slug: "part-time-jobs" },
            { name: "Freelance Jobs", slug: "freelance-jobs" },
            { name: "Internships", slug: "internships" }
          ]
        }
      ]
    },

    // ========================================
    // PETS & ANIMALS
    // ========================================
    {
      name: "Pets & Animals",
      slug: "pets-animals",
      description: "Pet supplies and animal-related products",
      icon: "🐾",
      children: [
        {
          name: "Pet Supplies",
          slug: "pet-supplies",
          children: [
            { name: "Dog Products", slug: "dog-products" },
            { name: "Cat Products", slug: "cat-products" },
            { name: "Bird Products", slug: "bird-products" },
            { name: "Fish & Aquatic Pets", slug: "fish-aquatic-pets" },
            { name: "Small Pets", slug: "small-pets" }
          ]
        },
        {
          name: "Pet Food",
          slug: "pet-food",
          children: [
            { name: "Dog Food", slug: "dog-food" },
            { name: "Cat Food", slug: "cat-food" },
            { name: "Bird Food", slug: "bird-food" },
            { name: "Fish Food", slug: "fish-food" }
          ]
        },
        {
          name: "Pet Services",
          slug: "pet-services",
          children: [
            { name: "Veterinary Services", slug: "veterinary-services" },
            { name: "Pet Grooming", slug: "pet-grooming" },
            { name: "Pet Training", slug: "pet-training" },
            { name: "Pet Boarding", slug: "pet-boarding" }
          ]
        }
      ]
    },

    // ========================================
    // BOOKS & MEDIA
    // ========================================
    {
      name: "Books & Media",
      slug: "books-media",
      description: "Books, magazines, and digital media",
      icon: "📚",
      children: [
        {
          name: "Books",
          slug: "books",
          children: [
            { name: "Fiction", slug: "fiction" },
            { name: "Non-Fiction", slug: "non-fiction" },
            { name: "Educational", slug: "educational-books" },
            { name: "Children's Books", slug: "childrens-books" },
            { name: "Religious & Spiritual", slug: "religious-spiritual" }
          ]
        },
        {
          name: "Magazines & Newspapers",
          slug: "magazines-newspapers",
          children: [
            { name: "Magazines", slug: "magazines" },
            { name: "Newspapers", slug: "newspapers" },
            { name: "E-Magazines", slug: "e-magazines" }
          ]
        },
        {
          name: "Digital Media",
          slug: "digital-media",
          children: [
            { name: "E-Books", slug: "e-books" },
            { name: "Audiobooks", slug: "audiobooks" },
            { name: "Digital Courses", slug: "digital-courses" }
          ]
        }
      ]
    },

    // ========================================
    // INDUSTRIAL & BUSINESS
    // ========================================
    {
      name: "Industrial & Business",
      slug: "industrial-business",
      description: "Business supplies and industrial equipment",
      icon: "🏭",
      children: [
        {
          name: "Office Supplies",
          slug: "office-supplies",
          children: [
            { name: "Stationery", slug: "stationery" },
            { name: "Office Equipment", slug: "office-equipment" },
            { name: "Printing Supplies", slug: "printing-supplies" },
            { name: "Packaging Materials", slug: "packaging-materials" }
          ]
        },
        {
          name: "Industrial Equipment",
          slug: "industrial-equipment",
          children: [
            { name: "Machinery", slug: "machinery" },
            { name: "Tools", slug: "tools" },
            { name: "Safety Equipment", slug: "safety-equipment" },
            { name: "Materials & Raw Materials", slug: "raw-materials" }
          ]
        },
        {
          name: "Business Services",
          slug: "business-services",
          children: [
            { name: "Accounting Services", slug: "accounting-services" },
            { name: "Legal Services", slug: "legal-services" },
            { name: "Marketing Services", slug: "marketing-services" },
            { name: "Business Consulting", slug: "business-consulting" }
          ]
        }
      ]
    },

    // ========================================
    // OTHER
    // ========================================
    {
      name: "Other",
      slug: "other",
      description: "Miscellaneous items and services",
      icon: "📌",
      children: [
        { name: "Arts & Crafts", slug: "arts-crafts" },
        { name: "Collectibles", slug: "collectibles" },
        { name: "Antiques", slug: "antiques" },
        { name: "Used Items", slug: "used-items" },
        { name: "Services", slug: "other-services" },
        { name: "Miscellaneous", slug: "miscellaneous" }
      ]
    }
  ];

  await createCategoryTree(categories);

  console.log("✅ Categories created successfully!");
  console.log(
    `📊 Total categories created: ${await prisma.category.count()}`
  );
}

main()
  .catch((error) => {
    console.error("❌ Error creating categories:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
