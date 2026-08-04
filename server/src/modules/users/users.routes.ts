import type { FastifyInstance } from "fastify";

import {
    me
} from "./users.controller";


export default async function usersRoutes(
    app: FastifyInstance
) {

    app.get(
        "/me",
        {
            preHandler:[
                (app as any).authenticate
            ]
        },
        me
    );

}