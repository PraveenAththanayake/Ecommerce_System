import { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}
