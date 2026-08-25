import { prisma } from "../../lib/prisma.js";

import {
  Currency,
  ListingStatus,
  ListingType
} from "@prisma/client";


// =====================================================
// CREATE LISTING
// =====================================================

export async function createListing(data: {
  title: string;
  description: string;
  price: number;
  location: string;
  ownerId: string;
  categoryId?: string;
}) {

  return prisma.listing.create({

    data: {

      title: data.title,

      description: data.description,

      price: data.price,

      location: data.location,

      ownerId: data.ownerId,

      categoryId: data.categoryId

    },

    include: {

      images: true,

      category: true

    }

  });

}


// =====================================================
// UPDATE STATUS
// =====================================================

export async function changeListingStatus(
  id: string,
  ownerId: string,
  status: ListingStatus
) {

  const listing =
    await prisma.listing.findFirst({

      where: {
        id,
        ownerId
      }

    });


  if (!listing) {

    throw new Error(
      "Listing not found"
    );

  }


  return prisma.listing.update({

    where: {
      id
    },

    data: {
      status
    }

  });

}


// =====================================================
// GET ALL LISTINGS
// =====================================================

export async function getListings() {

  return prisma.listing.findMany({

    where: {

      status: "ACTIVE",

      available: true

    },

    include: {

      owner: {

        select: {

          id: true,

          name: true,

          phone: true,

          avatar: true,

          verifiedSeller: true

        }

      },


      category: true,


      images: {

        orderBy: {

          id: "asc"

        }

      }

    },


    orderBy: [

      {

        featured: "desc"

      },

      {

        createdAt: "desc"

      }

    ]

  });

}


// =====================================================
// GET SINGLE LISTING
// =====================================================

export async function getListingById(
  id: string
) {

  return prisma.listing.findUnique({

    where: {

      id

    },

    include: {

      owner: {

        select: {

          id: true,

          name: true,

          phone: true,

          email: true

        }

      },


      category: true,


      images: true,


      reviews: true

    }

  });

}


// =====================================================
// GET USER LISTINGS
// =====================================================

export async function getMyListings(
  ownerId: string
) {

  return prisma.listing.findMany({

    where: {

      ownerId

    },

    include: {

      category: true,

      images: true

    },

    orderBy: {

      createdAt: "desc"

    }

  });

}


// =====================================================
// UPDATE LISTING
// =====================================================

export async function updateListing(
  id: string,
  ownerId: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    condition?: string;
    details?: any;
    categoryId?: string;
  }
)
{

  const listing =
    await prisma.listing.findFirst({

      where: {

        id,

        ownerId

      }

    });


  if (!listing) {

    throw new Error(
      "Listing not found"
    );

  }


  return prisma.listing.update({

    where: {

      id

    },

   data: {

    title: data.title,

    description: data.description,

    price: data.price,

    location: data.location,

    condition: data.condition,

    details: data.details,

    categoryId: data.categoryId

}

  });

}


// =====================================================
// SEARCH & FILTER LISTINGS
// =====================================================

export async function searchListings(
  filters: any
) {

  const {

    q,

    categoryId,

    location,

    minPrice,

    maxPrice,

    sort,

    page,

    limit

  } = filters;


  const where: any = {};


  if (q) {

    where.OR = [

      {

        title: {

          contains: q,

          mode: "insensitive"

        }

      },

      {

        description: {

          contains: q,

          mode: "insensitive"

        }

      }

    ];

  }


  if (categoryId) {

    where.categoryId = categoryId;

  }


  if (location) {

    where.location = {

      contains: location,

      mode: "insensitive"

    };

  }


  if (minPrice || maxPrice) {

    where.price = {};


    if (minPrice) {

      where.price.gte = minPrice;

    }


    if (maxPrice) {

      where.price.lte = maxPrice;

    }

  }


  let orderBy: any = {

    createdAt: "desc"

  };


  if (sort === "oldest") {

    orderBy = {

      createdAt: "asc"

    };

  }


  if (sort === "low_price") {

    orderBy = {

      price: "asc"

    };

  }


  if (sort === "high_price") {

    orderBy = {

      price: "desc"

    };

  }


  const currentPage =
    Number(page) || 1;


  const currentLimit =
    Number(limit) || 20;


  const skip =
    (currentPage - 1) *
    currentLimit;


  const [
    listings,
    total
  ] = await Promise.all([

    prisma.listing.findMany({

      where,

      include: {

        images: true,

        category: true

      },

      orderBy,

      skip,

      take: currentLimit

    }),


    prisma.listing.count({

      where

    })

  ]);


  return {

    total,

    page: currentPage,

    limit: currentLimit,

    totalPages:
      Math.ceil(
        total / currentLimit
      ),

    listings

  };

}
// =====================================================
// RELATED LISTINGS
// =====================================================

export async function getRelatedListings(
  listingId: string,
  categoryId?: string | null,
  type?: ListingType,
  location?: string | null
) {

  return prisma.listing.findMany({

    where: {

      id: {
        not: listingId
      },

      status: "ACTIVE",

      available: true,

    OR: [
  ...(categoryId
    ? [
        {
          categoryId
        }
      ]
    : []),

  ...(type
    ? [
        {
          type
        }
      ]
    : []),

  ...(location
    ? [
        {
         location: {
    contains: location.split(",")[0],
    mode: "insensitive" as const
}
        }
      ]
    : [])
],

    },


    include: {

      images: true,

      category: true,

      owner: {

        select: {

          id: true,

          name: true,

          avatar: true,

          verifiedSeller: true

        }

      }

    },


    orderBy: [

      {
        featured: "desc"
      },

      {
        createdAt: "desc"
      }

    ],


    take: 8

  });

}
// =====================================================
// DELETE LISTING
// =====================================================

export async function deleteListing(
  id: string,
  ownerId: string
) {

  const listing =
    await prisma.listing.findUnique({

      where: {

        id

      }

    });


  if (!listing) {

    throw new Error(
      "Listing not found"
    );

  }


  if (listing.ownerId !== ownerId) {

    throw new Error(
      "Not allowed"
    );

  }


  return prisma.listing.delete({

    where: {

      id

    }

  });

}


// =====================================================
// CREATE LISTING WITH SELLER BENEFITS
// =====================================================

export async function createListingWithFeatured(
  data: {
    title: string;

    description: string;

    price: number;

    currency: Currency;

    location: string;

    condition?: string;

    details?: any;

    type?: ListingType;

    negotiable?: boolean;

    available?: boolean;

    status?: ListingStatus;

    ownerId: string;

    categoryId?: string;

    featured: boolean;
  }
)
{

  return prisma.listing.create({

    data: {

      title: data.title,

      description: data.description,

      price: data.price,

      currency: data.currency,

      location: data.location,

      condition: data.condition,

      type:
        data.type ??
        "PRODUCT",

      negotiable:
        data.negotiable ??
        true,

      available:
        data.available ??
        true,

      status:
        data.status ??
        "ACTIVE",

      ownerId: data.ownerId,

     categoryId: data.categoryId,

details: data.details,

featured: data.featured

    },

    include: {

      images: true,

      category: true,

      owner: {

        select: {

          id: true,

          name: true,

          verifiedSeller: true

        }

      }

    }

  });

}