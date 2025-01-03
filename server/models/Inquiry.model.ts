import mongoose, { Schema } from "mongoose";
import { IInquiry } from "../types";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    inquiry: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model<IInquiry>("Inquiry", InquirySchema);

export { Inquiry };
