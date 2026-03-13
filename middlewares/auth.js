const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if Authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }

  // Extract token
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    // Verify token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Invalid token" });
  }

  // Attach user id to request
  req.user = payload;

  // Continue request
  return next();
};

module.exports = auth;
