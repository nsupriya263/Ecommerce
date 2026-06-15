const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  category: { type: String, required: true, index: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  description: { type: String, default: "" },
  badge: { type: String, default: null },
});

// Text index for search
ProductSchema.index({ name: "text", description: "text" });

module.exports =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
