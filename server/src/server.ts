import "dotenv/config";

import { buildApp } from "./app.js";

import { prisma } from "./lib/prisma.js";


const PORT =
    Number(process.env.PORT) || 5000;



async function start() {

    try {


        await prisma.$connect();


        console.log(
            "✅ Database connected"
        );



        const app =
            await buildApp();



        await app.listen({

            port: PORT,

            host: "0.0.0.0"

        });



        console.log(
            `🚀 Server running on port ${PORT}`
        );


    } catch(error) {


        console.error(
            "❌ Server startup failed:",
            error
        );


        await prisma.$disconnect();


        process.exit(1);

    }

}



start();