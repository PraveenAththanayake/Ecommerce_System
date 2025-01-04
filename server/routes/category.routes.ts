import express from "express";
import {
  CreateCategory,
  DeleteCategory,
  GetCategories,
  GetCategoryById,
  UpdateCategory,
} from "../controllers";

const router = express.Router();

router.post("/create", CreateCategory);
router.get("/get", GetCategories);
router.get("/get/:id", GetCategoryById);
router.put("/update/:id", UpdateCategory);
router.delete("/delete/:id", DeleteCategory);

export { router as CategoryRoute };
