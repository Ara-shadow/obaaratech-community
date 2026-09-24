export function generateToken(app, payload) {
    return app.jwt.sign(payload, {
        expiresIn: "7d",
    });
}
