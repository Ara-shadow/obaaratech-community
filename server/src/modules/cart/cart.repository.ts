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
    itemId:string,
    quantity:number
){

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
    itemId:string
){

    return prisma.cartItem.delete({

        where:{
            id:itemId
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