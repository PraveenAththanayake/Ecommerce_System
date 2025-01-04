import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { MONGO_URI } from "./config";
import {
  CategoryRoute,
  InquiryRoute,
  UserRoute,
  OrderRoute,
  ProductRoute,
} from "./routes";

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/user", UserRoute);
app.use("/category", CategoryRoute);
app.use("/inquiry", InquiryRoute);
app.use("/order", OrderRoute);
app.use("/product", ProductRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(8000, () => {
  console.clear();
  console.log("Server is running on http://localhost:8000");
});
