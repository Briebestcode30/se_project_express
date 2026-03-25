const express = require("express");

const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");

const { validateSignup, validateSignin } = require("../middlewares/validation");

const NotFoundError = require("../errors/not-found-err");

const router = express.Router();

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);

router.use("/users", auth, userRouter);

router.get("/items", clothingItemRouter);

router.use("/items", auth, clothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
