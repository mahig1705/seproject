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


router.post(
  "/",
  verifyAuth,
  permit([UserRole.Admin]),
  UsersController.createUser
);


// Only admin can list or delete arbitrary users
router.get("/", verifyAuth, permit([UserRole.Admin]), UsersController.getAllUsers);
router.get("/me", verifyAuth, async (req, res) => {
  // simple route: return req.user (already attached)
  return res.json({ success: true, data: req.user });
});

// Admin or the user himself can view or update profile
router.get("/:id", verifyAuth, UsersController.getUserById);
router.put("/:id", verifyAuth, UsersController.updateUser);
router.delete("/:id", verifyAuth, permit([UserRole.Admin]), UsersController.deleteUser);



export default router;
