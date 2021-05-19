import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    whenToUse: {
      type: String,
      required: true,
    },
    howItWorks: {
      type: String,
    },
    howToUse: {
      type: String,
    },
    reviews: {
      type: mongoose.Types.ObjectId,
      ref: "reviews",
    },
    images: {
      type: Array,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.product || mongoose.model("product", productSchema);
export default Dataset;
