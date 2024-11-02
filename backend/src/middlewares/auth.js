import User from "../models/User.js";
import { UserError } from "../utils/errors.js";
import jwt from "../utils/jwt.js";

export async function authenticateToken(req, res, next) {
  const token = req.cookies.token; // get token
  if (!token)
    return next(new UserError("Access denied, token is missing.", 401));

  try {
    const verifiedUser = jwt.verifyToken(token);
    req.user = verifiedUser;

    const user = await User.findById(req.user.id)

    if(!user) return next(new UserError("User not found.", 404));
    
    req.userRole = user.role
    next();
  } catch (error) {
    next(error)
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
