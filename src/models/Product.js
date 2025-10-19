import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Product stock cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    unitType: {
      type: String,
      enum: ["unit", "kg"],
      default: "unit",
      required: [true, "Unit type is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for frequently searched fields
productSchema.index({ category: 1 });
productSchema.index({ name: "text" });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
