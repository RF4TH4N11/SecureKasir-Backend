import mongoose from "mongoose";

const transactionItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unitType: {
    type: String,
    enum: ["unit", "kg"],
    default: "unit",
  },
  quantity: {
    type: Number,
    required: function () {
      return this.unitType === "unit";
    },
    min: [0, "Quantity cannot be negative"],
  },
  weight: {
    type: Number,
    required: function () {
      return this.unitType === "kg";
    },
    min: [0.1, "Weight must be at least 0.1 kg"],
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    items: [transactionItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "qris", "card"],
      required: true,
    },
    cashReceived: {
      type: Number,
      required: true,
      min: 0,
    },
    change: {
      type: Number,
      default: 0,
      min: 0,
    },
    customerName: {
      type: String,
      trim: true,
      default: "Customer",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "pending"],
      default: "completed",
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate receipt number before saving
transactionSchema.pre("save", async function (next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.receiptNumber = `INV/${year}${month}${day}/${random}`;
  }
  next();
});

// Index for frequently searched fields
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ paymentMethod: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ receiptNumber: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
