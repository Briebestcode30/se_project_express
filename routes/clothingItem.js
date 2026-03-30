const router = require("express").Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

router.post("/", validateCreateItem, createItem);

router.delete("/:itemId", validateItemId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeItem);

router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
