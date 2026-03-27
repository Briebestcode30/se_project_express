const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.get("/", getItems);

router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().required().valid("hot", "warm", "cold"),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem,
);

router.delete(
  "/:itemId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteItem,
);

router.put(
  "/:itemId/likes",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeItem,
);

router.delete(
  "/:itemId/likes",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeItem,
);

module.exports = router;
