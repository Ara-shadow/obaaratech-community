import { prisma } from "../../lib/prisma.js";


// =====================================
// GET USER CART
// =====================================

export async function getUserCart(
    userId: string
) {

    let cart =
        await prisma.cart.findUnique({

            where:{
                userId
            },

            include:{

                items:{
                    include:{
                        listing:{
                            include:{
                                images:true,
                                owner:true,
                                category:true
                            }
                        }
                    }
                }

            }

        });


 if(!cart){

    cart =
        await prisma.cart.create({

            data:{
                userId
            },

            include:{
                items:{
                    include:{
                        listing:{
                            include:{
                                images:true,
                                owner:true,
                                category:true
                            }
                        }
                    }
                }
            }

        });

}


    return cart;

}



// =====================================
// ADD ITEM TO CART
// =====================================

export async function addCartItem(
    userId:string,
    listingId:string
){

    const listing =
        await prisma.listing.findFirst({

            where:{

                id:listingId,

                status:"ACTIVE",

                available:true,

                price:{
                    not:null
                }

            },

            select:{

                id:true,

                ownerId:true

            }

        });


    if(!listing){

        throw new Error(
            "This listing is no longer available to add to your cart"
        );

    }


    if(listing.ownerId === userId){

        throw new Error(
            "You cannot add your own listing to your cart"
        );

    }

    let cart =
        await prisma.cart.findUnique({

            where:{
                userId
            }

        });


    if(!cart){

        cart =
            await prisma.cart.create({

                data:{
                    userId
                }

            });

    }



    const existing =
        await prisma.cartItem.findUnique({

            where:{
                cartId_listingId:{
                    cartId:cart.id,
                    listingId
                }
            }

        });



    if(existing){

        return existing;

    }



    return prisma.cartItem.create({

        data:{

            cartId:cart.id,

            listingId,

            quantity:1

        }

    });

}



// =====================================
// UPDATE QUANTITY
// =====================================

export async function updateCartItemQuantity(
    userId:string,
    itemId:string,
    quantity:number
){

    const item =
        await prisma.cartItem.findFirst({

            where:{

                id:itemId,

                cart:{

                    userId

                }

            },

            select:{

                id:true

            }

        });


    if(!item){

        throw new Error(
            "Cart item not found"
        );

    }


    return prisma.cartItem.update({

        where:{
            id:itemId
        },

        data:{
            quantity
        }

    });

}



// =====================================
// REMOVE ITEM
// =====================================

export async function removeCartItem(
    userId:string,
    itemId:string
){

    const item =
        await prisma.cartItem.findFirst({

            where:{

                id:itemId,

                cart:{

                    userId

                }

            },

            select:{

                id:true

            }

        });


    if(!item){

        throw new Error(
            "Cart item not found"
        );

    }


    return prisma.cartItem.delete({

        where:{
            id:item.id
        }

    });

}



// =====================================
// CLEAR CART
// =====================================

export async function clearUserCart(
    userId:string
){

    const cart =
        await prisma.cart.findUnique({

            where:{
                userId
            }

        });


    if(!cart){
        return null;
    }


    return prisma.cartItem.deleteMany({

        where:{
            cartId:cart.id
        }

    });

}
