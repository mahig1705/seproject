"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const technicians_controller_1 = require("../controllers/technicians.controller");
const router = (0, express_1.Router)();
const controller = new technicians_controller_1.TechniciansController();
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
exports.default = router;
//# sourceMappingURL=technicians.routes.js.map