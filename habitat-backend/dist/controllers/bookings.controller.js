"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const bookings_service_1 = require("../services/bookings.service");
const service = new bookings_service_1.BookingsService();
class BookingsController {
    async getAll(req, res) {
        const data = await service.getAll();
        res.json({ success: true, data });
    }
    async getById(req, res) {
        const data = await service.getById(req.params.id);
        res.json({ success: true, data });
    }
    // bookings.controller.ts
    async create(req, res) {
        try {
            // Extract userId from authenticated user (set by verifyAuth middleware)
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            // Merge userId with request body
            const bookingData = {
                ...req.body,
                userId: userId
            };
            const data = await service.create(bookingData);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async update(req, res) {
        const data = await service.update(req.params.id, req.body);
        res.json({ success: true, data });
    }
    async delete(req, res) {
        await service.delete(req.params.id);
        res.json({ success: true });
    }
    // ✅ New method for approving or rejecting a booking
    async approveBooking(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await service.updateStatus(id, status);
            res.json({ success: true, data: updated });
        }
        catch (error) {
            console.error('Approve booking error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.BookingsController = BookingsController;
//# sourceMappingURL=bookings.controller.js.map