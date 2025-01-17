import express from "express";
import {
  CreateReview,
  DeleteReview,
  GetReviewById,
  GetReviews,
  GetUserReviews,
  UpdateReview,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/create", Authenticate, CreateReview);

router.get("/product/:productId", GetReviews);

router.get("/get/:id", GetReviewById);

router.put("/update/:id", Authenticate, UpdateReview);

router.delete("/delete/:id", Authenticate, DeleteReview);

router.get("/user", Authenticate, GetUserReviews);

export { router as ReviewRoute };
