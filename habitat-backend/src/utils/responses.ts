// src/utils/responses.ts
import { Response } from "express";

export const successResponse = (res: Response, data: any, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const errorResponse = (res: Response, message = "Error", status = 500, data: any = null) =>
  res.status(status).json({ success: false, message, data });
