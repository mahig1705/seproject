import { Request, Response } from 'express';
import { AmenitiesService } from '../services/amenities.service';
const service = new AmenitiesService();

export class AmenitiesController {
    // GET /api/amenities
    async getAll(_req: Request, res: Response) {
        try {
            const data = await service.getAll();
            res.status(200).json({ data }); // wrap in "data"
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // GET /api/amenities/:id
    async getById(req: Request, res: Response) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return res.status(404).json({ message: 'Amenity not found' });
            res.status(200).json({ data });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // POST /api/amenities
    async create(req: Request, res: Response) {
        try {
            const newAmenity = await service.create(req.body);
            res.status(201).json({ data: newAmenity });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // PUT /api/amenities/:id
    async update(req: Request, res: Response) {
        try {
            const updatedAmenity = await service.update(req.params.id, req.body);
            if (!updatedAmenity) return res.status(404).json({ message: 'Amenity not found' });
            res.status(200).json({ data: updatedAmenity });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // DELETE /api/amenities/:id
    async delete(req: Request, res: Response) {
        try {
            await service.delete(req.params.id);
            res.status(200).json({ message: 'Amenity deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
