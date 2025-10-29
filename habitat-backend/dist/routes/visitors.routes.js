"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visitors_controller_1 = require("../controllers/visitors.controller");
const router = (0, express_1.Router)();
const controller = new visitors_controller_1.VisitorsController();
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.patch('/:id/checkout', controller.checkoutVisitor.bind(controller)); // ✅ Fixed: checkout → checkoutVisitor
router.delete('/:id', controller.delete.bind(controller));
exports.default = router;
//# sourceMappingURL=visitors.routes.js.map