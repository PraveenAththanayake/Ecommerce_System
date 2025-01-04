import express from "express";
import {
  CreateInquiry,
  DeleteInquiry,
  GetInquiries,
  GetInquiryById,
  UpdateInquiry,
} from "../controllers";

const router = express.Router();

router.post("/create", CreateInquiry);
router.get("/get", GetInquiries);
router.get("/get/:id", GetInquiryById);
router.put("/update/:id", UpdateInquiry);
router.delete("/delete/:id", DeleteInquiry);

export { router as InquiryRoute };
