export function adminOnly(request, reply, done) {
    const role = request.user?.role;
    if (role !== "ADMIN" &&
        role !== "SUPER_ADMIN") {
        return reply.code(403).send({
            message: "Admin access required"
        });
    }
    done();
}
