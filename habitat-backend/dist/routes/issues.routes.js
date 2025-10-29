"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issues_controller_1 = require("../controllers/issues.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const enums_1 = require("../utils/enums");
const router = (0, express_1.Router)();
const controller = new issues_controller_1.IssuesController();
// ✅ All routes require authentication
router.get("/", auth_middleware_1.verifyAuth, controller.getAll.bind(controller));
router.get("/:id", auth_middleware_1.verifyAuth, controller.getById.bind(controller));
router.post("/", auth_middleware_1.verifyAuth, controller.create.bind(controller)); // ✅ Now sets reporter automatically
router.patch("/:id", auth_middleware_1.verifyAuth, controller.update.bind(controller));
router.delete("/:id", auth_middleware_1.verifyAuth, (0, role_middleware_1.permit)([enums_1.UserRole.Admin]), controller.delete.bind(controller));
exports.default = router;
//# sourceMappingURL=issues.routes.js.map