"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsController = void 0;
const bills_service_1 = require("../services/bills.service");
const service = new bills_service_1.BillsService();
class BillsController {
    // ✅ FIX: Wrap response in consistent format
    async getAll(_req, res) {
        try {
            const { userId, status } = _req.query;
            const data = await service.getAll({
                userId: userId,
                status: status
            });
            res.json({ success: true, data }); // ✅ Consistent wrapper
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message || 'Failed to fetch bills' });
        }
    }
    async getById(_req, res) {
        try {
            const data = await service.getById(_req.params.id);
            if (!data)
                return res.status(404).json({ success: false, message: 'Bill not found' });
            res.json({ success: true, data }); // ✅ Wrapped
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async create(_req, res) {
        try {
            const data = await service.create(_req.body);
            res.status(201).json({ success: true, data }); // ✅ Wrapped
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
    async update(_req, res) {
        try {
            const data = await service.update(_req.params.id, _req.body);
            if (!data)
                return res.status(404).json({ success: false, message: 'Bill not found' });
            res.json({ success: true, data }); // ✅ Wrapped
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
    async delete(_req, res) {
        try {
            await service.delete(_req.params.id);
            res.json({ success: true, message: 'Bill deleted' }); // ✅ Changed from 204
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async payBill(_req, res) {
        try {
            const { amount, gatewayRef } = _req.body;
            const data = await service.payBill(_req.params.id, amount, gatewayRef);
            res.json({ success: true, data }); // ✅ Wrapped
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
    async generateBills(_req, res) {
        try {
            const billsData = _req.body;
            const data = await service.generateBills(billsData);
            res.status(201).json({ success: true, data }); // ✅ Wrapped
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
}
exports.BillsController = BillsController;
