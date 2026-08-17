export function getToken(req) {

    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        throw new Error("Missing Bearer token.");
    }

    return header.substring(7);

}