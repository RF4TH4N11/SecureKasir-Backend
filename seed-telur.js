/**
 * Seeder script untuk update produk Telur ke unitType="kg"
 * Run: node seed-telur.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";

dotenv.config();

const seedTelur = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/pos-kasir"
    );
    console.log("✅ MongoDB connected");

    // Update semua produk dengan nama mengandung "Telur" menjadi unitType="kg"
    const result = await Product.updateMany(
      { name: { $regex: "telur", $options: "i" } },
      { unitType: "kg" },
      { new: true }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} telur products to unitType="kg"`
    );

    // Show hasil
    const telurProducts = await Product.find({
      name: { $regex: "telur", $options: "i" },
    });
    console.log("\n📋 Telur Products:");
    telurProducts.forEach((p) => {
      console.log(`  - ${p.name} (${p.unitType}): Rp ${p.price}`);
    });

    // Disconnect
    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedTelur();
