"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenitiesController = void 0;
const amenities_service_1 = require("../services/amenities.service");
const service = new amenities_service_1.AmenitiesService();
class AmenitiesController {
    // GET /api/amenities
    async getAll(_req, res) {
        try {
            const data = await service.getAll();
            res.status(200).json({ data }); // wrap in "data"
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // GET /api/amenities/:id
    async getById(req, res) {
        try {
            const data = await service.getById(req.params.id);
            if (!data)
                return res.status(404).json({ message: 'Amenity not found' });
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // POST /api/amenities
    async create(req, res) {
        try {
            const newAmenity = await service.create(req.body);
            res.status(201).json({ data: newAmenity });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // PUT /api/amenities/:id
    async update(req, res) {
        try {
            const updatedAmenity = await service.update(req.params.id, req.body);
            if (!updatedAmenity)
                return res.status(404).json({ message: 'Amenity not found' });
            res.status(200).json({ data: updatedAmenity });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // DELETE /api/amenities/:id
    async delete(req, res) {
        try {
            await service.delete(req.params.id);
            res.status(200).json({ message: 'Amenity deleted successfully' });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.AmenitiesController = AmenitiesController;
