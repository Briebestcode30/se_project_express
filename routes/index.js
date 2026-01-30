const router = require("express").Router();
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors"); // import the 404 constant

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems"); // if created later

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Catch-all 404 handler for unmatched routes
router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
