const express = require("express");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const { validateUpdateUser } = require("../utils/validation");

const router = express.Router();

router.get("/me", getCurrentUser);

router.patch("/me", validateUpdateUser, updateCurrentUser);

module.exports = router;
