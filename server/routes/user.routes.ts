import express from "express";
import {
  CreateUser,
  GetUserById,
  GetUsers,
  UserLogin,
  GetUserProfile,
  UpdateUserProfile,
  DeleteUser,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// User Registration
router.post("/register", CreateUser);

// User Login
router.post("/login", UserLogin);

// Fetch All Users
router.get("/users", GetUsers);

// Fetch User by ID
router.get("/users/:id", GetUserById);

// Get Current User Profile (Protected Route)
router.get("/profile", Authenticate, GetUserProfile);

// Update User Profile (Protected Route)
router.put("/update", Authenticate, UpdateUserProfile);

// Delete Current User (Protected Route)
router.delete("/delete", Authenticate, DeleteUser);

export { router as UserRoute };
