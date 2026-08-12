import type { FastifyInstance } from "fastify";


import {
    marketplaceListingsController,
    listingDetailsController,
    marketplaceSearchController
} from "./marketplace.controller.js";


import {
    whatsappController
} from "./marketplace.whatsapp.controller.js";





export async function marketplaceRoutes(
    app: FastifyInstance
){



    // ==========================
    // ALL MARKETPLACE LISTINGS
    // ==========================

    app.get(

        "/listings",

        marketplaceListingsController

    );







    // ==========================
    // SEARCH MARKETPLACE
    // ==========================

    app.get(

        "/search",

        marketplaceSearchController

    );








    // ==========================
    // WHATSAPP SELLER CONTACT
    // ==========================

    app.get(

        "/listings/:id/whatsapp",

        whatsappController

    );








    // ==========================
    // SINGLE LISTING DETAILS
    // ==========================

    app.get(

        "/listings/:id",

        listingDetailsController

    );



}
