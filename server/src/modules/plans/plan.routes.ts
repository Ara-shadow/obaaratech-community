import type {
    FastifyInstance
} from "fastify";


import {
    getPlansController,
    getMyPlanController,
    adminGetSellerPlansController,
    adminGetSellerPlanController,
    adminUpdateSellerPlanController
}
from "./plan.controller.js";


import {
    adminOnly
}
from "../../middleware/role.js";


// =================================
// SELLER PLAN ROUTES
// =================================

export default async function planRoutes(

    app:FastifyInstance

){

    // =================================
    // PUBLIC — ACTIVE PLANS
    // =================================

    app.get(

        "/",

        getPlansController

    );


    // =================================
    // SELLER — MY PLAN
    // =================================

    app.get(

        "/me",

        {

            preHandler:[

                app.authenticate

            ]

        },

        getMyPlanController

    );


    // =================================
    // ADMIN — ALL PLANS
    // =================================

    app.get(

        "/admin",

        {

            preHandler:[

                app.authenticate,

                adminOnly

            ]

        },

        adminGetSellerPlansController

    );


    // =================================
    // ADMIN — SINGLE PLAN
    // =================================

    app.get(

        "/admin/:id",

        {

            preHandler:[

                app.authenticate,

                adminOnly

            ]

        },

        adminGetSellerPlanController

    );


    // =================================
    // ADMIN — UPDATE PLAN
    // =================================

    app.patch(

        "/admin/:id",

        {

            preHandler:[

                app.authenticate,

                adminOnly

            ]

        },

        adminUpdateSellerPlanController

    );

}