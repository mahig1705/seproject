import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", verifyAuth, AuthController.me);

export default router;
