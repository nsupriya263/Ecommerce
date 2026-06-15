const connectDB = require("../lib/mongodb");
const Product = require("../lib/models/Product");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();

    const { id } = req.query;
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error("Product detail error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
