import { Router } from "express";
import { IssuesController } from "../controllers/issues.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { permit } from "../middlewares/role.middleware";
import { UserRole } from "../utils/enums";

const router = Router();
const controller = new IssuesController();

// ✅ All routes require authentication
router.get("/", verifyAuth, controller.getAll.bind(controller));
router.get("/:id", verifyAuth, controller.getById.bind(controller));
router.post("/", verifyAuth, controller.create.bind(controller)); // ✅ Now sets reporter automatically
router.patch("/:id", verifyAuth, controller.update.bind(controller));
router.delete("/:id", verifyAuth, permit([UserRole.Admin]), controller.delete.bind(controller));

export default router;
