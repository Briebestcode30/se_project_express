const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// ------------------------
// Create a new user
// ------------------------
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })
    .then((user) => {
      res.status(201).send(user); // password hidden by toJSON()
    })
    .catch((err) => {
      console.error(err);

      // Duplicate email
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR_CODE)
          .send({ message: "Email already exists" });
      }

      // Validation error
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }

      // Unexpected error
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// ------------------------
// Login user and return JWT
// ------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);

    // Known invalid credentials case
    if (err.message === "Incorrect email or password") {
      return res
        .status(UNAUTHORIZED_ERROR_CODE)
        .json({ message: "Incorrect email or password" });
    }

    // Any unexpected error
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ message: "An error has occurred on the server" });
  }
};

// ------------------------
// Get currently logged-in user
// ------------------------
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// ------------------------
// Update currently logged-in user's profile
// ------------------------
const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
