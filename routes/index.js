const express = require("express");

const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
