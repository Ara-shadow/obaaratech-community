import { FastifyRequest, FastifyReply } from "fastify";


export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
){

    try{

        await request.jwtVerify();


    }catch(error){

        return reply.code(401).send({

            message:"Unauthorized"

        });

    }

}

export async function authorizeSeller(
    request: any,
    reply: any
) {
    const user = request.user;

    if (
        !user ||
        (
            user.role !== "SELLER" &&
            user.role !== "ADMIN" &&
            user.role !== "SUPER_ADMIN"
        )
    ) {
        return reply.code(403).send({
            success: false,
            message: "Seller access required"
        });
    }
}
