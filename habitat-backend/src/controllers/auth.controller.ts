// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/responses";
import * as AuthService from "../services/auth.service";
import User from "../models/user.model";
import { registerSchema, loginSchema } from "../utils/validator";

export const register = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message, 400);

    const user = await AuthService.createUser(value);
    const token = AuthService.generateToken(user);

    // ✅ Convert Mongoose document to plain JS object safely
    const safeUser = user.toObject() as Record<string, any>;
    delete safeUser.password;

    return successResponse(res, { user: safeUser, token }, "User registered", 201);
  } catch (err: any) {
    return errorResponse(res, err.message || "Registration failed", 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return errorResponse(res, error.details[0].message, 400);

    const user = await User.findOne({ email: value.email });
    if (!user) return errorResponse(res, "Invalid credentials", 401);

    const valid = await AuthService.validatePassword(value.password, user.password);
    if (!valid) return errorResponse(res, "Invalid credentials", 401);

    const token = AuthService.generateToken(user);

    // ✅ Convert Mongoose document to plain JS object safely
    const safeUser = user.toObject() as Record<string, any>;
    delete safeUser.password;

    return successResponse(res, { user: safeUser, token }, "Logged in successfully");
  } catch (err: any) {
    return errorResponse(res, err.message || "Login failed", 400);
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) return errorResponse(res, "Unauthorized", 401);

    const user = await User.findById(userId).select("-password");
    if (!user) return errorResponse(res, "User not found", 404);

    return successResponse(res, user, "Current user");
  } catch (err: any) {
    return errorResponse(res, err.message || "Failed to fetch user", 400);
  }
};
