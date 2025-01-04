import express from "express";
import {
  CreateProduct,
  GetProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
} from "../controllers";

const router = express.Router();

router.post("/create", CreateProduct);
router.get("/get", GetProducts);
router.get("/get/:id", GetProductById);
router.put("/update/:id", UpdateProduct);
router.delete("/delete/:id", DeleteProduct);

export { router as ProductRoute };
