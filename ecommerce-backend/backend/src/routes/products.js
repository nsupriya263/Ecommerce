const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products — list with filter, search, sort
router.get("/", async (req, res) => {
  const { category, search, sortBy } = req.query;

  let query = {};

  if (category && category !== "All") {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  let sortOption = {};
  if (sortBy === "price-asc") sortOption = { price: 1 };
  else if (sortBy === "price-desc") sortOption = { price: -1 };
  else if (sortBy === "rating") sortOption = { rating: -1 };

  const products = await Product.find(query).sort(sortOption);
  res.json(products);
});

// GET /api/products/categories — unique category list
router.get("/categories", async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(["All", ...categories]);
});

// GET /api/products/:id — single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

module.exports = router;
