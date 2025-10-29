"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("../controllers/bookings.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const enums_1 = require("../utils/enums");
const router = (0, express_1.Router)();
const controller = new bookings_controller_1.BookingsController();
// 📌 Normal CRUD
router.get("/", auth_middleware_1.verifyAuth, controller.getAll.bind(controller));
router.get("/:id", auth_middleware_1.verifyAuth, controller.getById.bind(controller));
router.post("/", auth_middleware_1.verifyAuth, controller.create.bind(controller));
router.put("/:id", auth_middleware_1.verifyAuth, controller.update.bind(controller));
router.delete("/:id", auth_middleware_1.verifyAuth, controller.delete.bind(controller));
// ✅ Approve / Reject endpoint (Admin only)
router.patch("/:id/approve", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin]), controller.approveBooking.bind(controller));
exports.default = router;
