import "dotenv/config";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();



async function testDatabase(){

    try {

        console.log(
            "DATABASE:",
            process.env.DATABASE_URL
        );


        const users =
        await prisma.user.findMany({

            select: {

                id:true,
                name:true,
                email:true,
                phone:true,
                role:true,
                createdAt:true

            }

        });


        console.log(users);


    } catch(error){


        console.error(error);


    } finally {


        await prisma.$disconnect();


    }

}



testDatabase();