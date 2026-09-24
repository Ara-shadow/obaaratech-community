import { generateWhatsAppLink } from "./marketplace.whatsapp.service.js";
export async function whatsappController(request, reply) {
    const params = request.params;
    try {
        const result = await generateWhatsAppLink(request.server, params.id);
        return reply.send({
            success: true,
            whatsapp: result
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
