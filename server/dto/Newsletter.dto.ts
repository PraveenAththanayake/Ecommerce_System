export interface NewsletterDto {
  email: string;
  user: string;
  subscribed?: boolean;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  subscriptionStatus?: "active" | "unsubscribed" | "pending";
  preferences?: {
    frequency: "daily" | "weekly" | "monthly";
    categories: string[];
  };
}
