const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

// GET all items
const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({}).lean().exec();
    res.status(200).send(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "Server error fetching items" });
  }
};

// CREATE a new item
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Missing required fields" });
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });

    res.status(201).send(item);
  } catch (err) {
    console.error("Error creating item:", err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Invalid data" });
    }
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "Server error creating item" });
  }
};

// DELETE an item
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findById(itemId);
    if (!item)
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: "Item not found" });
    if (item.owner.toString() !== userId.toString())
      return res
        .status(FORBIDDEN_ERROR_CODE)
        .send({ message: "Not allowed to delete this item" });

    await item.deleteOne();
    res.send({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Invalid item ID" });
    }
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "Server error deleting item" });
  }
};

// LIKE an item
const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );

    if (!item)
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: "Item not found" });
    res.send(item);
  } catch (err) {
    console.error("Error liking item:", err);
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Invalid item ID" });
    }
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "Server error liking item" });
  }
};

// DISLIKE an item
const dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!item)
      return res
        .status(NOT_FOUND_ERROR_CODE)
        .send({ message: "Item not found" });
    res.send(item);
  } catch (err) {
    console.error("Error disliking item:", err);
    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR_CODE)
        .send({ message: "Invalid item ID" });
    }
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: "Server error disliking item" });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
