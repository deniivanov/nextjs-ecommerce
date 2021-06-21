import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      ref: "user",
    },
    address: Object,
    mobile: String,
    cart: Array,
    total: Number,
    payment: String,
    delivered: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    dateOfPayment: Date,
  },
  {
    timestamps: true,
  }
);

let Dataset = mongoose.models.order || mongoose.model("order", orderSchema);
export default Dataset;
