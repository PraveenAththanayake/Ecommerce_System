export interface INewsletter extends Document {
  email: string;
  user: Schema.Types.ObjectId;
  subscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  lastUpdated: Date;
  subscriptionStatus: "active" | "unsubscribed" | "pending";
  preferences?: {
    frequency: "daily" | "weekly" | "monthly";
    categories: string[];
  };
}
