import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    fetchSellerBusinessHours,
    updateSellerBusinessHours
} from "./seller.hours.service.js";


// =====================================================
// GET SELLER BUSINESS HOURS
// =====================================================

export async function getSellerBusinessHoursController(

    request: FastifyRequest,

    reply: FastifyReply

) {

    try {

        const user =
            request.user as {

                id: string;

            };


        const hours =
            await fetchSellerBusinessHours(
                user.id
            );


        return reply.send({

            success: true,

            hours

        });

    } catch (error: any) {

        return reply.code(400).send({

            success: false,

            message:
                error?.message ||
                "Unable to load business hours"

        });

    }

}


// =====================================================
// UPDATE SELLER BUSINESS HOURS
// =====================================================

export async function updateSellerBusinessHoursController(

    request: FastifyRequest,

    reply: FastifyReply

) {

    try {

        const user =
            request.user as {

                id: string;

            };


        const hours =
            await updateSellerBusinessHours(

                user.id,

                request.body

            );


        return reply.send({

            success: true,

            message:
                "Business hours updated successfully",

            hours

        });

    } catch (error: any) {

        return reply.code(400).send({

            success: false,

            message:
                error?.message ||
                "Unable to update business hours"

        });

    }

}