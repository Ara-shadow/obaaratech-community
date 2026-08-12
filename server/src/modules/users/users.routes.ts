import type { FastifyInstance } from "fastify";

import {
    me
} from "./users.controller.js";


export default async function usersRoutes(
    app: FastifyInstance
) {

    app.get(
        "/me",
        {
            preHandler:[
                app.authenticate
            ]
        },
        me
    );

}
