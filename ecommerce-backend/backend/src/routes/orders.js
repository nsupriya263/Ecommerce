const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/auth");

// All order routes require auth
router.use(authMiddleware);

// POST /api/orders — place an order
router.post("/", async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 99 ? 0 : 9.99;

  const order = await Order.create({
    userId: req.user.id,
    items,
    total,
    shipping,
    shippingAddress,
  });

  res.status(201).json(order);
});

// GET /api/orders — user's order history
router.get("/", async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id — single order
router.get("/:id", async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

module.exports = router;
