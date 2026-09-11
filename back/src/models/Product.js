const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      type: String, // e.g. "Running", "Casual", "Sports", "Formal"
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    sizes: [
      {
        size: { type: Number, required: true }, // e.g. 6,7,8,9,10
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    colors: [String],
    images: [String], // stored file paths / urls
    totalStock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);