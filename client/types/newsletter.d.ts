// types/newsletter.ts
export interface INewsletterPreferences {
  frequency: "daily" | "weekly" | "monthly";
  categories: string[];
}

export interface INewsletter {
  _id: string;
  email: string;
  user: string;
  subscribed: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  subscriptionStatus: "active" | "unsubscribed" | "pending";
  preferences: INewsletterPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginationData {
  total: number;
  page: number;
  pages: number;
}

export interface INewsletterResponse {
  success: boolean;
  message: string;
  subscribers?: INewsletter[];
  pagination?: IPaginationData;
  isExisting?: boolean;
  statusCode?: number;
  subscriber?: INewsletter;
}
