import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    getSellerDashboard
} from "./seller.dashboard.service.js";


// =================================
// SELLER DASHBOARD
// =================================

export async function sellerDashboardController(

    request: FastifyRequest,

    reply: FastifyReply

){

    const user =
        request.user as {
            id:string;
        };


    const dashboard =
        await getSellerDashboard(

            request.server,

            user.id

        );


    return reply.send({

        success:true,

        dashboard

    });

}
