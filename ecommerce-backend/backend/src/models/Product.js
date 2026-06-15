const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    description: { type: String, required: true },
    badge: { type: String, default: null }, // "SALE", "NEW", "BESTSELLER"
    stock: { type: Number, default: 100 },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
