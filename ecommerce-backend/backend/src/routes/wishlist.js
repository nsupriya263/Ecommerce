const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

// GET /api/wishlist
router.get("/", async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
  res.json(wishlist ? wishlist.products : []);
});

// POST /api/wishlist/:productId — toggle
router.post("/:productId", async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ userId: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user.id, products: [productId] });
    return res.json({ wishlisted: true });
  }

  const index = wishlist.products.indexOf(productId);
  if (index === -1) {
    wishlist.products.push(productId);
  } else {
    wishlist.products.splice(index, 1);
  }

  await wishlist.save();
  res.json({ wishlisted: index === -1 });
});

module.exports = router;
