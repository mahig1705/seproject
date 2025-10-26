import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responses";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) return errorResponse(res, "Authorization header missing", 401);

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) return errorResponse(res, "Invalid auth format", 401);

    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };

    const user = await User.findById(payload.id).select("-password");
    if (!user) return errorResponse(res, "User not found", 401);

    req.user = user;
    next();
  } catch (err: any) {
    return errorResponse(res, err.message || "Authentication failed", 401);
  }
};
