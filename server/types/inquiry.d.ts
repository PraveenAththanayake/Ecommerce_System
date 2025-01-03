import { Document, Schema } from "mongoose";

export interface IInquiry extends Document {
  user: Schema.Types.ObjectId;
  name: string;
  email: string;
  inquiry: string;
}
