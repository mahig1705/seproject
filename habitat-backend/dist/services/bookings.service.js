"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const bookings_model_1 = __importDefault(require("../models/bookings.model"));
require("../models/amenities.model"); // ✅ make sure this is imported
require("../models/user.model");
class BookingsService {
    async getAll() {
        return bookings_model_1.default.find()
            .populate('userId', 'name email')
            .populate('amenityId', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getById(id) {
        return bookings_model_1.default.findById(id)
            .populate('userId', 'name email')
            .populate('amenityId', 'name')
            .exec();
    }
    async create(data) {
        const booking = new bookings_model_1.default(data);
        return await booking.save();
    }
    async update(id, data) {
        return bookings_model_1.default.findByIdAndUpdate(id, data, { new: true })
            .populate('userId', 'name email')
            .populate('amenityId', 'name')
            .exec();
    }
    async delete(id) {
        return bookings_model_1.default.findByIdAndDelete(id);
    }
    async updateStatus(id, status) {
        return bookings_model_1.default.findByIdAndUpdate(id, { status }, { new: true })
            .populate('userId', 'name email')
            .populate('amenityId', 'name')
            .exec();
    }
}
exports.BookingsService = BookingsService;
