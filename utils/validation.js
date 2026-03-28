const { celebrate, Joi, Segments } = require("celebrate");

const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
    imageUrl: Joi.string().uri().required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
});

module.exports = {
  validateCreateItem,
  validateItemId,
  validateUpdateUser,
};
