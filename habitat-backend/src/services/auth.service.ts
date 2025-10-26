import User, { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";
const JWT_EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 7 * 24 * 60 * 60); 

if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined in .env");

export const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) throw new Error("Email already registered");

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(payload.password!, salt);

  const user = new User({
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

export const validatePassword = async (candidate: string, hash: string) => {
  return bcrypt.compare(candidate, hash);
};

export const generateToken = (user: Partial<IUser>): string => {
  const payload = { id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN_SECONDS });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
};
