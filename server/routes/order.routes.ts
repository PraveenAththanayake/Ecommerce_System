import express from "express";
import {
  CreateOrder,
  DeleteOrder,
  GetOrder,
  GetOrders,
  GetUserOrders,
  UpdateOrder,
  UpdateOrderStatus,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/create", Authenticate, CreateOrder);
router.get("/get", GetOrders);
router.get("/get/:id", GetOrder);
router.get("/user/orders", Authenticate, GetUserOrders);
router.put("/update/:id", UpdateOrder);
router.put("/update/:id/status", UpdateOrderStatus);
router.delete("/delete/:id", DeleteOrder);

export { router as OrderRoute };
