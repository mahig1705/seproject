"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const responses_1 = require("../utils/responses");
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.default.find().select("-password");
        return (0, responses_1.successResponse)(res, users, "All users fetched successfully");
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message);
    }
};
exports.getAllUsers = getAllUsers;
// GET user by ID
const getUserById = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.params.id).select("-password");
        if (!user)
            return (0, responses_1.errorResponse)(res, "User not found", 404);
        return (0, responses_1.successResponse)(res, user);
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message);
    }
};
exports.getUserById = getUserById;
// UPDATE user
const updateUser = async (req, res) => {
    try {
        const value = req.body; // skip validation
        if (value.password) {
            const salt = await bcryptjs_1.default.genSalt(SALT_ROUNDS);
            value.password = await bcryptjs_1.default.hash(value.password, salt);
        }
        const updatedUser = await user_model_1.default.findByIdAndUpdate(req.params.id, value, {
            new: true,
        }).select("-password");
        if (!updatedUser)
            return (0, responses_1.errorResponse)(res, "User not found", 404);
        return (0, responses_1.successResponse)(res, updatedUser, "User updated successfully");
    }
    catch (err) {
        return (0, responses_1.errorResponse)(res, err.message);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    console.log(`🔴 deleteUser called for ID: ${req.params.id} by user:`, req.user);
    try {
        const deletedUser = await user_model_1.default.findByIdAndDelete(req.params.id).select("-password");
        if (!deletedUser) {
            console.log(`⚠️ User not found: ${req.params.id}`);
            return (0, responses_1.errorResponse)(res, "User not found", 404);
        }
        console.log(`✅ User deleted: ${deletedUser._id}`);
        return (0, responses_1.successResponse)(res, deletedUser, "User deleted successfully");
    }
    catch (err) {
        console.error("❌ deleteUser error:", err.message);
        return (0, responses_1.errorResponse)(res, err.message);
    }
};
exports.deleteUser = deleteUser;
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role, flatNumber } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            flatNumber,
        });
        await user.save();
        console.log("📥 Incoming data:", req.body);
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=users.controller.js.map