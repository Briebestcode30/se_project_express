const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

// Protected routes
router.get("/me", getCurrentUser); // Get current user
router.patch("/me", updateCurrentUser); // Update current user (name & avatar)

module.exports = router;
