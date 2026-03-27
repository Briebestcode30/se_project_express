const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const router = express.Router();

router.get("/me", getCurrentUser);

router.patch(
  "/me",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    }),
  }),
  updateCurrentUser,
);

module.exports = router;
