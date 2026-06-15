/**
 * Seed MongoDB Atlas with product data.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seed.js
 */

// DNS workaround for networks that block SRV lookups
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const path = require("path");

// Product schema (inline to avoid ESM issues with src/data)
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  rating: Number,
  reviews: Number,
  description: String,
  badge: String,
});

ProductSchema.index({ name: "text", description: "text" });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  {
    name: "Obsidian Mechanical Keyboard",
    price: 189.99,
    originalPrice: 249.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    rating: 4.8,
    reviews: 342,
    description: "Tactile switches, aluminum frame, RGB backlighting. Built for those who take their craft seriously.",
    badge: "SALE",
  },
  {
    name: "Ceramic Pour-Over Set",
    price: 64.0,
    originalPrice: null,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    rating: 4.9,
    reviews: 218,
    description: "Hand-thrown stoneware dripper and carafe. The ritual of coffee, elevated.",
    badge: "NEW",
  },
  {
    name: "Leather Field Notes Cover",
    price: 48.0,
    originalPrice: null,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
    rating: 4.7,
    reviews: 95,
    description: "Full-grain vegetable-tanned leather. Ages beautifully with every use.",
    badge: null,
  },
  {
    name: "Matte Black Desk Lamp",
    price: 129.0,
    originalPrice: 160.0,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    rating: 4.6,
    reviews: 177,
    description: "Articulated arm, touch dimmer, warm-white LED. Focused light for focused work.",
    badge: "SALE",
  },
  {
    name: "Noise-Cancelling Headphones",
    price: 299.0,
    originalPrice: null,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    rating: 4.9,
    reviews: 521,
    description: "40-hour battery, adaptive ANC, premium memory foam. Silence, on demand.",
    badge: "BESTSELLER",
  },
  {
    name: "Merino Wool Tote",
    price: 95.0,
    originalPrice: null,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    rating: 4.5,
    reviews: 64,
    description: "Natural merino, structured base, magnetic closure. Carry what matters.",
    badge: "NEW",
  },
  {
    name: "Cast Iron Skillet",
    price: 79.0,
    originalPrice: null,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
    rating: 4.8,
    reviews: 409,
    description: "Pre-seasoned, heirloom-grade. Pass it down in a hundred years.",
    badge: null,
  },
  {
    name: "Wireless Charging Pad",
    price: 39.99,
    originalPrice: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80",
    rating: 4.4,
    reviews: 288,
    description: "15W fast charge, universal Qi, ultra-slim profile. No cables, no clutter.",
    badge: "SALE",
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ Set MONGODB_URI environment variable first!");
    console.error('   Example: MONGODB_URI="mongodb+srv://..." node scripts/seed.js');
    process.exit(1);
  }

  console.log("⏳ Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  console.log("✅ Connected!");

  console.log("🗑️  Clearing existing products...");
  await Product.deleteMany({});

  console.log("🌱 Seeding products...");
  const docs = await Product.insertMany(products);
  console.log(`✅ Seeded ${docs.length} products!`);

  docs.forEach((p) => console.log(`   • ${p.name} (${p._id})`));

  await mongoose.disconnect();
  console.log("\n🎉 Done! Database is ready.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
