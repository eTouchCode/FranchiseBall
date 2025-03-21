import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; username: string; email: string };
    (req as any).user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};