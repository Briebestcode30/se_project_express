const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // your user model
const {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  CONFLICT_ERROR_CODE,
} = require("../utils/errors");
const { JWT_SECRET = "dev-secret" } = require("../utils/config");

// Register a new user
const register = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Name, email, and password are required" });
  }

  // Check if user already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: "User with this email already exists" });
      }

      // Hash password
      bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            name,
            avatar,
            email,
            password: hash,
          }),
        )
        .then((user) => {
          // Return a token immediately
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          res.send({ token });
        });
    })
    .catch((err) => res.status(500).send({ message: "Server error", err }));
};

// Login an existing user
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .select("+password") // make sure password field is selected
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: "Invalid email or password" });
      }

      // Compare password
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(UNAUTHORIZED_ERROR_CODE)
            .send({ message: "Invalid email or password" });
        }

        // Issue token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch((err) => res.status(500).send({ message: "Server error", err }));
};

// Verify token (used by frontend)
const checkToken = (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Auth required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    User.findById(payload._id)
      .then((user) => {
        if (!user)
          return res
            .status(UNAUTHORIZED_ERROR_CODE)
            .send({ message: "User not found" });
        res.send(user);
      })
      .catch(() => res.status(500).send({ message: "Server error" }));
  } catch (err) {
    res.status(UNAUTHORIZED_ERROR_CODE).send({ message: "Invalid token" });
  }
};

module.exports = {
  register,
  login,
  checkToken,
};
