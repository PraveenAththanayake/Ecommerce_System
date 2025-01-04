import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featured: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);

export { Category };
