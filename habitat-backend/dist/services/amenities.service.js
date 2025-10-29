"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenitiesService = void 0;
const amenities_model_1 = __importDefault(require("../models/amenities.model"));
class AmenitiesService {
    async getAll() {
        return amenities_model_1.default.find();
    }
    async getById(id) {
        return amenities_model_1.default.findById(id);
    }
    async create(data) {
        return amenities_model_1.default.create(data);
    }
    async update(id, data) {
        return amenities_model_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return amenities_model_1.default.findByIdAndDelete(id);
    }
}
exports.AmenitiesService = AmenitiesService;
//# sourceMappingURL=amenities.service.js.map