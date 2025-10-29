"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
// src/utils/validator.ts
const joi_1 = __importDefault(require("joi"));
const enums_1 = require("./enums");
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    phone: joi_1.default.string().optional(),
    role: joi_1.default.string().valid(...Object.values(enums_1.UserRole)).optional(),
    flatNumber: joi_1.default.string().optional()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    phone: joi_1.default.string().optional(),
    flatNumber: joi_1.default.string().optional(),
    role: joi_1.default.string().valid(...Object.values(enums_1.UserRole)).optional(),
    isActive: joi_1.default.boolean().optional()
});
//# sourceMappingURL=validator.js.map