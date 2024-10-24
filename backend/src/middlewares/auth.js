import jwt from "../utils/jwt.js"

export async function authenticateToken(req, res, next) {    
    /*const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))*/
    const token = req.cookies.token; // токен в cookies
    if (!token) return res.status(401).json({message: "Access denied, token is missing."})

    //const token = authHeader.split(" ")[1]

    try {
        const verifiedUser = jwt.verifyToken(token)
        req.user = verifiedUser
        next()
    } catch (err) {
        res.status(403).json({message:"Invalid token."})
    }
}

export async function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        res.status(403).json({message: "Access denied, admin privileges required."})
    }
}