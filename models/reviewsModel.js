import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.reviews || mongoose.model("reviews", ReviewSchema);
export default Dataset;
