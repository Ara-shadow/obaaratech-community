export function adminOnly(
    request:any,
    reply:any,
    done:any
){

    const role = request.user?.role;


    if(
        role !== "ADMIN" &&
        role !== "SUPER_ADMIN"
    ){

        return reply.code(403).send({

            message:"Admin access required"

        });

    }


    done();

}