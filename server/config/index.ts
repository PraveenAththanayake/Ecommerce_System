import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
// export const MONGO_URI = "mongodb://localhost:27017/ecommerce";
export const APP_SECRET = process.env.APP_SECRET || "defaultsecret";
