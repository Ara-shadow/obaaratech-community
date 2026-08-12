import { z } from "zod";


export const createConversationSchema = z.object({

  message: z
    .string()
    .min(1, "Message is required")

});


export type CreateConversationInput =
  z.infer<typeof createConversationSchema>;
