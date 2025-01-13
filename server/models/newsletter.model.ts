import mongoose, { Schema } from "mongoose";
import { INewsletter } from "../types";

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "unsubscribed", "pending"],
      default: "active",
    },
    preferences: {
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
      categories: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

NewsletterSchema.index({ email: 1, user: 1 });
NewsletterSchema.index({ subscriptionStatus: 1 });

const Newsletter = mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export { Newsletter };
