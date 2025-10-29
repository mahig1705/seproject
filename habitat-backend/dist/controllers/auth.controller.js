"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const responses_1 = require("../utils/responses");
const AuthService = __importStar(require("../services/auth.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
const validator_1 = require("../utils/validator");
const register = async (req, res) => {
    try {
        const { error, value } = validator_1.registerSchema.validate(req.body);
        if (error)
            return (0, responses_1.errorResponse)(res, error.details[0].message, 400);
        const user = await AuthService.createUser(value);
        const token = AuthService.generateToken(user);
        // ✅ Convert Mongoose document to plain JS object safely
        const safeUser = user.toObject();
        delete safeUser.password;
        return (0, responses_1.successResponse)(res, { user: safeUser, token }, "User registered", 201);
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message || "Registration failed", 400);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { error, value } = validator_1.loginSchema.validate(req.body);
        if (error)
            return (0, responses_1.errorResponse)(res, error.details[0].message, 400);
        const user = await user_model_1.default.findOne({ email: value.email });
        if (!user)
            return (0, responses_1.errorResponse)(res, "Invalid credentials", 401);
        const valid = await AuthService.validatePassword(value.password, user.password);
        if (!valid)
            return (0, responses_1.errorResponse)(res, "Invalid credentials", 401);
        const token = AuthService.generateToken(user);
        // ✅ Convert Mongoose document to plain JS object safely
        const safeUser = user.toObject();
        delete safeUser.password;
        return (0, responses_1.successResponse)(res, { user: safeUser, token }, "Logged in successfully");
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message || "Login failed", 400);
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return (0, responses_1.errorResponse)(res, "Unauthorized", 401);
        const user = await user_model_1.default.findById(userId).select("-password");
        if (!user)
            return (0, responses_1.errorResponse)(res, "User not found", 404);
        return (0, responses_1.successResponse)(res, user, "Current user");
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message || "Failed to fetch user", 400);
    }
};
exports.me = me;
