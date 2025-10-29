import { Router } from "express";
import { BookingsController } from "../controllers/bookings.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { permit } from "../middlewares/role.middleware";
import { UserRole } from "../utils/enums";

const router = Router();
const controller = new BookingsController();

// 📌 Normal CRUD
router.get("/", verifyAuth, controller.getAll.bind(controller));
router.get("/:id", verifyAuth, controller.getById.bind(controller));
router.post("/", verifyAuth, controller.create.bind(controller));
router.put("/:id", verifyAuth, controller.update.bind(controller));
router.delete("/:id", verifyAuth, controller.delete.bind(controller));

// ✅ Approve / Reject endpoint (Admin only)
router.patch(
  "/:id/approve",
  verifyAuth,
  permit([UserRole.Admin]),
  controller.approveBooking.bind(controller)
);

export default router;
