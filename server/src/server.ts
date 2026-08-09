import "dotenv/config";

import { buildApp } from "./app.js";


const start = async()=>{

    const app = await buildApp();


    try{

        await app.listen({

            port:Number(process.env.PORT) || 5000,

            host:"0.0.0.0"

        });


        console.log(
            "🚀 Obaaratech Community API running on port 5000"
        );


    }catch(error){

        app.log.error(error);

        process.exit(1);

    }

};



start();