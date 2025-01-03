import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  imageUrl: string;
  slug: string;
  category: string;
}
