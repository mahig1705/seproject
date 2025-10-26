import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses";
import { UserRole } from "../utils/enums";

/**
 * Middleware to restrict routes to specific roles
 * @param roles Array of roles allowed to access the route
 */
export const permit = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any; // req.user is set in auth.middleware
    if (!user) return errorResponse(res, "Unauthorized", 401);

    if (!roles.includes(user.role)) {
      return errorResponse(res, "Forbidden: insufficient permissions", 403);
    }

    next();
  };
};
