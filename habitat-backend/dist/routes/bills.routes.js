"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bills_controller_1 = require("../controllers/bills.controller");
const router = (0, express_1.Router)();
const controller = new bills_controller_1.BillsController();
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
// Custom routes
router.patch('/:id/pay', controller.payBill.bind(controller));
router.post('/generate', controller.generateBills.bind(controller));
router.post('/:id/pay', controller.payBill.bind(controller));
exports.default = router;
