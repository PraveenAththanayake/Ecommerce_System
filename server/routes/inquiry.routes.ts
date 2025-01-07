import express from "express";
import {
  CreateInquiry,
  DeleteInquiry,
  GetInquiries,
  GetInquiryById,
  UpdateInquiry,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/create", Authenticate, CreateInquiry);
router.get("/get", GetInquiries);
router.get("/get/:id", GetInquiryById);
router.put("/update/:id", Authenticate, UpdateInquiry);
router.delete("/delete/:id", DeleteInquiry);

export { router as InquiryRoute };
