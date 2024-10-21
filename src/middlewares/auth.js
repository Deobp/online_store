import jwt from "../utils/jwt"

async function authenticateToken(req, res, next) {    
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).send("Access denied, token is missing.")

    const token = authHeader.split(" ")[1]

    try {
        const verifiedUser = jwt.verifyToken(token)
        req.user = verifiedUser
        next()
    } catch (err) {
        res.status(403).send("Invalid token.")
    }
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403).send("Access denied, admin privileges required.")
    }
}

module.exports = { authenticateToken, isAdmin }