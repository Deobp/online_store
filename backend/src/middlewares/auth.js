import User from "../models/User.js";
import jwt from "../utils/jwt.js";

export async function authenticateToken(req, res, next) {
  const token = req.cookies.token; // get token
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied, token is missing." });

  try {
    const verifiedUser = jwt.verifyToken(token);
    req.user = verifiedUser;

    const user = await User.findById(req.user.id)

    if(!user) res.status(404).json({ message: "User not found." });
    
    req.userRole = user.role
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
  }
}

export async function isAdmin(req, res, next) {
  if (req.user && req.userRole === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied, admin privileges required." });
  }
}
