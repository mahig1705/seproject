"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechniciansService = void 0;
const technicians_model_1 = __importDefault(require("../models/technicians.model"));
class TechniciansService {
    async getAll() {
        return technicians_model_1.default.find();
    }
    async getById(id) {
        return technicians_model_1.default.findById(id);
    }
    async create(data) {
        return technicians_model_1.default.create(data);
    }
    async update(id, data) {
        return technicians_model_1.default.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return technicians_model_1.default.findByIdAndDelete(id);
    }
}
exports.TechniciansService = TechniciansService;
