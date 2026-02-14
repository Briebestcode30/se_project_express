const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_ERROR_CODE = 401 } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config"); // Make sure you have this

// Middleware function
const auth = (req, res, next) => {
  const { method, path } = req;

  // Skip unprotected routes
  if (
    (method === "POST" && (path === "/signin" || path === "/signup")) ||
    (method === "GET" && path === "/items")
  ) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET); // verify token
    req.user = payload; // attach payload to request
    next(); // proceed to next middleware/route
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }
};

module.exports = auth;
