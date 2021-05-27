import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.newsletter || mongoose.model("newsletter", NewsletterSchema);
export default Dataset;
