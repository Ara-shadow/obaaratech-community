import prisma from "../../database/prisma";


export function getProfile(userId:string){

    return prisma.user.findUnique({

        where:{
            id:userId
        },

        select:{

            id:true,
            name:true,
            email:true,
            phone:true,
            avatar:true,
            bio:true,
            location:true,
            website:true,
            role:true,
            createdAt:true

        }

    });

}



export function updateProfile(
    userId:string,
    data:any
){

    return prisma.user.update({

        where:{
            id:userId
        },

        data,

        select:{

            id:true,
            name:true,
            email:true,
            phone:true,
            avatar:true,
            bio:true,
            location:true,
            website:true,
            role:true

        }

    });

}