import type { FastifyInstance } from "fastify";


import {
    createListingController,
    getListingsController,
    getListingByIdController,
    getMyListingsController,
    updateListingController
} from "./listing.controller.js";


export default async function listingRoutes(
    app: FastifyInstance
) {


    console.log(
        "LISTING ROUTES AUTH:",
        typeof (app as any).authenticate
    );



    app.post(
        "/",
        {
            preHandler:[
                async(
                    request,
                    reply
                )=>{

                    console.log(
                        "LISTING AUTH HIT"
                    );


                    await (app as any).authenticate(
                        request,
                        reply
                    );

                }
            ]
        },
        createListingController
    );



    app.get(
        "/my",
        {
            preHandler:[
                (app as any).authenticate
            ]
        },
        getMyListingsController
    );



    app.get(
        "/",
        getListingsController
    );

    
app.put(
    "/:id",
    {
        preHandler:[
            app.authenticate
        ]
    },
    updateListingController
);

    app.get(
        "/:id",
        getListingByIdController
    );


}