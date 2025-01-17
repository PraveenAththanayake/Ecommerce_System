import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    numReviews: { type: Number },
    rating: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export { Product };
