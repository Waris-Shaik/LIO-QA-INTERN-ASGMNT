import mongoose from "mongoose";

const item = new mongoose.Schema(
  {
    ProductID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    Name: { type: String },
    Description: { type: String },
    Quantity: { type: Number },
    Price: { type: Number },
    OrderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    OrderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Orders: { type: [item], default: [] },
    TotalPrice: { type: Number, default: 0 },
    Status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
