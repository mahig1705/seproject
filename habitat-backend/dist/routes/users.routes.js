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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/users.routes.ts
const express_1 = require("express");
const UsersController = __importStar(require("../controllers/users.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const enums_1 = require("../utils/enums");
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    console.log(`🟢 Users Route Hit -> Method: ${req.method}, URL: ${req.originalUrl}, Body:`, req.body);
    next();
});
// ✅ Allow Committee to create users
router.post("/", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin, enums_1.UserRole.Committee]), UsersController.createUser);
// ✅ Allow Committee to list users (for dashboard)
router.get("/", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin, enums_1.UserRole.Committee]), UsersController.getAllUsers);
// Get current logged-in user info
router.get("/me", auth_middleware_1.verifyAuth, async (req, res) => {
    return res.json({ success: true, data: req.user });
});
// Admin or Committee can view any user profile
router.get("/:id", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin, enums_1.UserRole.Committee]), UsersController.getUserById);
// ✅ Allow Committee to update users
router.put("/:id", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin, enums_1.UserRole.Committee]), UsersController.updateUser);
// ❌ Only Admin can delete users (Committee cannot)
router.delete("/:id", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin]), UsersController.deleteUser);
exports.default = router;
