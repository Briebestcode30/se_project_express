const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem"); // <-- add this

router.use("/users", userRouter);
router.use("/items", clothingItemRouter); // <-- add this

// 404 handler
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
