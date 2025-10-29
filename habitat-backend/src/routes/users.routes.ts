// src/routes/users.routes.ts
import { Router } from "express";
import * as UsersController from "../controllers/users.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { permit } from "../middlewares/role.middleware";
import { UserRole } from "../utils/enums";

const router = Router();

router.use((req, res, next) => {
  console.log(`🟢 Users Route Hit -> Method: ${req.method}, URL: ${req.originalUrl}, Body:`, req.body);
  next();
});

// ✅ Allow Committee to create users
router.post(
  "/",
  verifyAuth,
  permit([UserRole.Admin, UserRole.Committee]),
  UsersController.createUser
);

// ✅ Allow Committee to list users (for dashboard)
router.get("/", verifyAuth, permit([UserRole.Admin, UserRole.Committee]), UsersController.getAllUsers);

// Get current logged-in user info
router.get("/me", verifyAuth, async (req, res) => {
  return res.json({ success: true, data: req.user });
});

// Admin or Committee can view any user profile
router.get("/:id", verifyAuth, permit([UserRole.Admin, UserRole.Committee]), UsersController.getUserById);

// ✅ Allow Committee to update users
router.put("/:id", verifyAuth, permit([UserRole.Admin, UserRole.Committee]), UsersController.updateUser);

// ❌ Only Admin can delete users (Committee cannot)
router.delete("/:id", verifyAuth, permit([UserRole.Admin]), UsersController.deleteUser);

export default router;
