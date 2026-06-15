const connectDB = require("./lib/mongodb");
const Product = require("./lib/models/Product");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    await connectDB();

    const { category, search, sortBy } = req.query;

    // Build query
    const query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort
    let sort = {};
    if (sortBy === "price-asc") sort = { price: 1 };
    else if (sortBy === "price-desc") sort = { price: -1 };
    else if (sortBy === "rating") sort = { rating: -1 };
    else sort = { _id: 1 };

    const products = await Product.find(query).sort(sort).lean();

    return res.status(200).json(products);
  } catch (err) {
    console.error("Products API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
