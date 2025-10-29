"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permit = void 0;
const responses_1 = require("../utils/responses");
/**
 * Middleware to restrict routes to specific roles
 * @param roles Array of roles allowed to access the route
 */
const permit = (roles) => {
    return (req, res, next) => {
        const user = req.user; // req.user is set in auth.middleware
        if (!user)
            return (0, responses_1.errorResponse)(res, "Unauthorized", 401);
        if (!roles.includes(user.role)) {
            return (0, responses_1.errorResponse)(res, "Forbidden: insufficient permissions", 403);
        }
        next();
    };
};
exports.permit = permit;
