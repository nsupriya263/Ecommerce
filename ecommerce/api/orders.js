const connectDB = require("./lib/mongodb");
const Order = require("./lib/models/Order");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();

    const { orderId, items, shippingAddress, subtotal, shipping, total } = req.body;

    if (!orderId || !items || !items.length || !shippingAddress || total == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await Order.create({
      orderId,
      items,
      shippingAddress,
      subtotal,
      shipping,
      total,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      _id: order._id,
    });
  } catch (err) {
    console.error("Orders API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
