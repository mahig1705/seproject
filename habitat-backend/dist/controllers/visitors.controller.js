"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorsController = void 0;
const visitors_service_1 = require("../services/visitors.service");
const service = new visitors_service_1.VisitorsService();
class VisitorsController {
    async getAll(req, res) {
        try {
            const { flatNumber } = req.query;
            const filter = flatNumber ? { flatNumber } : {};
            const data = await service.getAll(filter);
            res.json({ success: true, data }); // ✅ Wrapped
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async getById(req, res) {
        try {
            const data = await service.getById(req.params.id);
            if (!data)
                return res.status(404).json({ success: false, message: 'Visitor not found' });
            res.json({ success: true, data });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async create(req, res) {
        try {
            const data = await service.create(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
    async checkoutVisitor(req, res) {
        try {
            const data = await service.checkoutVisitor(req.params.id);
            if (!data)
                return res.status(404).json({ success: false, message: 'Visitor not found' });
            res.json({ success: true, data });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async update(req, res) {
        try {
            const data = await service.update(req.params.id, req.body);
            if (!data)
                return res.status(404).json({ success: false, message: 'Visitor not found' });
            res.json({ success: true, data });
        }
        catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
    async delete(req, res) {
        try {
            await service.delete(req.params.id);
            res.json({ success: true, message: 'Visitor deleted' });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.VisitorsController = VisitorsController;
//# sourceMappingURL=visitors.controller.js.map