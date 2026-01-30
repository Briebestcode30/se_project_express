const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// GET all items
router.get("/", getItems);

// POST a new item
router.post("/", createItem);

// DELETE an item by id
router.delete("/:itemId", deleteItem);

// PUT / DELETE likes
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
