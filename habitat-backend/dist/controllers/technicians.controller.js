"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechniciansController = void 0;
const technicians_service_1 = require("../services/technicians.service");
const technicians_model_1 = __importDefault(require("../models/technicians.model"));
const service = new technicians_service_1.TechniciansService();
class TechniciansController {
    // GET /api/technicians
    async getAll(req, res) {
        try {
            const data = await service.getAll();
            res.status(200).json({ data }); // wrap in "data"
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // GET /api/technicians/:id
    async getById(req, res) {
        try {
            const data = await service.getById(req.params.id);
            if (!data)
                return res.status(404).json({ message: 'Technician not found' });
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // POST /api/technicians
    async create(req, res) {
        try {
            const { name, contact, specializations, availability } = req.body;
            const newTech = await technicians_model_1.default.create({
                name,
                contact,
                specializations: specializations || [],
                availability,
                isActive: true,
            });
            res.status(201).json({ data: newTech });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // PATCH /api/technicians/:id
    async update(req, res) {
        try {
            const updatedTech = await technicians_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedTech)
                return res.status(404).json({ message: 'Technician not found' });
            res.status(200).json({ data: updatedTech });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // DELETE /api/technicians/:id
    async delete(req, res) {
        try {
            await service.delete(req.params.id);
            res.status(200).json({ message: 'Technician deleted successfully' });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.TechniciansController = TechniciansController;
