import { z } from "zod";


export const createSubscriptionSchema = z.object({

  planId:z.string()

});


export type CreateSubscriptionInput =
  z.infer<typeof createSubscriptionSchema>;