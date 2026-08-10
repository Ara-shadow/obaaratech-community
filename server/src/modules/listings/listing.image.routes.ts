import type { FastifyInstance } from "fastify";

import {
    addListingImageController,
    deleteListingImageController
} from "./listing.image.controller.js";


export async function listingImageRoutes(
    app: FastifyInstance
){

    app.post(
        "/:id/images",
        {
            preHandler:[
                app.authenticate
            ]
        },
        addListingImageController
    );


    app.delete(
        "/:id/images/:imageId",
        {
            preHandler:[
                app.authenticate
            ]
        },
        deleteListingImageController
    );

}