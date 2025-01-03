import express, { Request, Response, NextFunction } from "express";
import { CreateUser } from "../controllers";

const router = express.Router();

router.post("/register", CreateUser);

export { router as UserRoute };
