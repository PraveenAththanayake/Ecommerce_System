import { Request, Response, NextFunction } from "express";
import { ValidateSignature } from "../utility";

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req);

  if (validate) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const AuthorizeArenaAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "arena_admin") {
    next();
  } else {
    return res.status(401).json({ message: "Access denied. Admins only." });
  }
};
