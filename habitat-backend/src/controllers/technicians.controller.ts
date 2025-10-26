import { Request, Response } from 'express';
import { TechniciansService } from '../services/technicians.service';
import techniciansModel from '../models/technicians.model';

const service = new TechniciansService();

export class TechniciansController {
    // GET /api/technicians
    async getAll(req: Request, res: Response) {
        try {
            const data = await service.getAll();
            res.status(200).json({ data }); // wrap in "data"
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // GET /api/technicians/:id
    async getById(req: Request, res: Response) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return res.status(404).json({ message: 'Technician not found' });
            res.status(200).json({ data });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // POST /api/technicians
    async create(req: Request, res: Response) {
        try {
            const { name, contact, specializations, availability } = req.body;
            const newTech = await techniciansModel.create({
                name,
                contact,
                specializations: specializations || [],
                availability,
                isActive: true,
            });
            res.status(201).json({ data: newTech });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // PATCH /api/technicians/:id
    async update(req: Request, res: Response) {
        try {
            const updatedTech = await techniciansModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedTech) return res.status(404).json({ message: 'Technician not found' });
            res.status(200).json({ data: updatedTech });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    // DELETE /api/technicians/:id
    async delete(req: Request, res: Response) {
        try {
            await service.delete(req.params.id);
            res.status(200).json({ message: 'Technician deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
