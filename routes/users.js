const express = require("express");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const router = express.Router();

router.get("/me", getCurrentUser);

router.patch("/me", updateCurrentUser);

module.exports = router;
