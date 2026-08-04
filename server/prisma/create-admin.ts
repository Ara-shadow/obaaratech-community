import prisma from "../src/database/prisma";
import bcrypt from "bcrypt";


async function createAdmin(){

    const password = await bcrypt.hash(
        "Admin@123456",
        10
    );


    const admin = await prisma.user.upsert({

        where:{
            email:"admin@obaaratech.com"
        },


        update:{
            role:"SUPER_ADMIN"
        },


        create:{

            name:"Obaaratech Admin",

            email:"admin@obaaratech.com",

            password,

            phone:"08000000000",

            role:"SUPER_ADMIN"

        }

    });



    console.log(
        "Admin created:",
        admin.email,
        admin.role
    );


    process.exit();

}



createAdmin();