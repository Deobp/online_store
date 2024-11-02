import jwt from "jsonwebtoken";

function createToken(user) {
  return jwt.sign({ id: user._id/*, role: user.role */}, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default { createToken, verifyToken };
