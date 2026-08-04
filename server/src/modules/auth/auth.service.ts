import type { FastifyInstance } from "fastify";

import { prisma } from "../../database/prisma.js";

import bcrypt from "bcrypt";



export async function registerUser(
    app: FastifyInstance,
    data:any
) {


    const existingUser =
        await prisma.user.findUnique({

            where:{
                email:data.email
            }

        });



    if(existingUser){

        throw new Error(
            "Email already registered"
        );

    }



    const hashedPassword =
        await bcrypt.hash(
            data.password,
            10
        );



    const user =
        await prisma.user.create({

            data:{

                name:data.name,

                email:data.email,

                phone:data.phone,

                whatsapp:data.whatsapp,

                password:hashedPassword,

                role:"USER"

            }

        });



    const token =
        app.jwt.sign({

            id:user.id,

            email:user.email,

            role:user.role

        },{
            expiresIn:"7d"
        });



    return {

        message:"Registration successful",

        user:{

            id:user.id,

            name:user.name,

            email:user.email,

            phone:user.phone,

            whatsapp:user.whatsapp,

            role:user.role

        },

        token

    };


}





export async function loginUser(
    app:FastifyInstance,
    email:string,
    password:string
){


    const user =
        await prisma.user.findUnique({

            where:{
                email
            }

        });



    if(!user){

        throw new Error(
            "Invalid email or password"
        );

    }




    const validPassword =
        await bcrypt.compare(

            password,

            user.password

        );



    if(!validPassword){

        throw new Error(
            "Invalid email or password"
        );

    }




    const token =
        app.jwt.sign({

            id:user.id,

            email:user.email,

            role:user.role

        },{
            expiresIn:"7d"
        });





    return {

        message:"Login successful",


        user:{

            id:user.id,

            name:user.name,

            email:user.email,

            phone:user.phone,

            role:user.role

        },


        token

    };


}