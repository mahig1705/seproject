"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.validatePassword = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";
const JWT_EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 7 * 24 * 60 * 60);
if (!JWT_SECRET)
    throw new Error("JWT_SECRET must be defined in .env");
const createUser = async (payload) => {
    const existing = await user_model_1.default.findOne({ email: payload.email });
    if (existing)
        throw new Error("Email already registered");
    const salt = await bcryptjs_1.default.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, salt);
    const user = new user_model_1.default({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        role: payload.role ?? "resident",
        flatNumber: payload.flatNumber,
    });
    await user.save();
    return user;
};
exports.createUser = createUser;
const validatePassword = async (candidate, hash) => {
    return bcryptjs_1.default.compare(candidate, hash);
};
exports.validatePassword = validatePassword;
const generateToken = (user) => {
    const payload = { id: user._id, email: user.email, role: user.role };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN_SECONDS });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.service.js.map