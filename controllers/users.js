const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");
const { JWT_SECRET = "your-very-secret-key" } = require("../utils/config");

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Name, email, and password are required" });
    }

    const user = await User.create({
      name,
      avatar,
      email,
      password,
    });

    res.status(201).send(user);
  } catch (err) {
    console.error("FULL SIGNUP ERROR:", err);

    if (err.code === 11000) {
      return res
        .status(CONFLICT_ERROR_CODE)
        .send({ message: "Email already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    }

    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return res
        .status(UNAUTHORIZED_ERROR_CODE)
        .json({ message: "Incorrect email or password" });
    }

    console.error("Login error:", err);

    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ message: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: "User not found" });
    }

    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: err.message });
  }
};

// Update current user
const updateCurrentUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true },
    ).orFail();

    res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: "User not found" });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    }

    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: err.message });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
