const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
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
      // No need to manually delete password; model's toJSON() handles it
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
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

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Incorrect email or password" });
  }
};

// ------------------------
// Get currently logged-in user
// ------------------------
const getCurrentUser = (req, res) => {
  const userId = req.user._id; // from auth middleware

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user)) // password hidden automatically
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
    { new: true, runValidators: true }, // return updated doc and run validation
  )
    .orFail()
    .then((updatedUser) => res.status(200).send(updatedUser)) // password hidden automatically
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

module.exports = { createUser, login, getCurrentUser, updateCurrentUser };
