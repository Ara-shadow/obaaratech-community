import type {
    FastifyInstance
} from "fastify";


import {
    sellerDashboardController
} from "./seller.dashboard.controller.js";


export default async function sellerDashboardRoutes(

    app:FastifyInstance

){


    app.get(

        "/dashboard",

        {

            preHandler:[

                app.authenticate

            ]

        },

        sellerDashboardController

    );


}