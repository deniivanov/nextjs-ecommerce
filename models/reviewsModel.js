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
  },
  {
    timestamps: true,
  }
);

let Dataset = mongoose.models.review || mongoose.model("review", ReviewSchema);
export default Dataset;
