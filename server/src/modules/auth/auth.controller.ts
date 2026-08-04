import {
    registerUser,
    loginUser
} from "./auth.service";



export async function register(
    request: any,
    reply: any
) {

    try {

        const result = await registerUser(
            request.body
        );

        return reply.send(result);

    } catch (error: any) {

        return reply.status(400).send({
            message: error.message
        });

    }

}



export async function login(
    request: any,
    reply: any
) {

    try {

        const {
            email,
            password
        } = request.body;


        const result = await loginUser(
            email,
            password
        );


        return reply.send(result);


    } catch (error: any) {

        return reply.status(400).send({
            message: error.message
        });

    }

}