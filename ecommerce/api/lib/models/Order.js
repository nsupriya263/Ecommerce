const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [OrderItemSchema],
  shippingAddress: {
    name: String,
    email: String,
    address: String,
    city: String,
    zip: String,
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
