"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorsService = void 0;
const visitors_model_1 = __importDefault(require("../models/visitors.model"));
class VisitorsService {
    // Get all visitors
    // services/visitors.service.ts
    async getAll(filter = {}) {
        return visitors_model_1.default.find(filter);
    }
    // Get one visitor
    async getById(id) {
        return visitors_model_1.default.findById(id);
    }
    // Create visitor
    async create(data) {
        if (!data.inTime)
            data.inTime = new Date();
        return visitors_model_1.default.create(data);
    }
    // ✅ Checkout visitor (set outTime)
    async checkoutVisitor(id) {
        return visitors_model_1.default.findByIdAndUpdate(id, { outTime: new Date() }, { new: true });
    }
    // Update visitor
    async update(id, data) {
        return visitors_model_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    // Delete visitor
    async delete(id) {
        return visitors_model_1.default.findByIdAndDelete(id);
    }
}
exports.VisitorsService = VisitorsService;
