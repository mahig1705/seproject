"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = require("../utils/responses");
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";
const verifyAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header)
            return (0, responses_1.errorResponse)(res, "Authorization header missing", 401);
        const [scheme, token] = header.split(" ");
        if (scheme !== "Bearer" || !token)
            return (0, responses_1.errorResponse)(res, "Invalid auth format", 401);
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await user_model_1.default.findById(payload.id).select("-password");
        if (!user)
            return (0, responses_1.errorResponse)(res, "User not found", 401);
        req.user = user;
        next();
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message || "Authentication failed", 401);
    }
};
exports.verifyAuth = verifyAuth;
//# sourceMappingURL=auth.middleware.js.map