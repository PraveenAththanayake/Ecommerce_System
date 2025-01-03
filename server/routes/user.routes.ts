import express, { Request, Response, NextFunction } from "express";
import { CreateUser, GetUserById, GetUsers, UserLogin } from "../controllers";

const router = express.Router();

router.post("/register", CreateUser);

router.post("/login", UserLogin);

router.get("/users", GetUsers);

router.get("/users/:id", GetUserById);

export { router as UserRoute };
