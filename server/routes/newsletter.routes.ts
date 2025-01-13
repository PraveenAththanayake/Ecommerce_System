import express from "express";
import {
  BulkUpdateSubscribers,
  DeleteSubscriber,
  GetAllSubscribers,
  GetSubscriberById,
  Subscribe,
  Unsubscribe,
  UpdateSubscriber,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// Public routes (requires authentication)
router.post("/subscribe", Authenticate, Subscribe);
router.post("/unsubscribe", Authenticate, Unsubscribe);

// Admin routes
router.get("/get", Authenticate, GetAllSubscribers);
router.get("/get/:email", Authenticate, GetSubscriberById);
router.put("/update/:email", Authenticate, UpdateSubscriber);
router.delete("/delete/:id", Authenticate, DeleteSubscriber);
router.post("/bulk-update", Authenticate, BulkUpdateSubscribers);

export { router as NewsletterRoute };
