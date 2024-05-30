import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true, trim: true },
    Description: { type: String, default: "", trim: true },
    Price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
