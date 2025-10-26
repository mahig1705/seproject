import { Request, Response } from 'express';
import { VisitorsService } from '../services/visitors.service';
const service = new VisitorsService();

export class VisitorsController {
    async getAll(req: Request, res: Response) {
        const data = await service.getAll();
        res.json(data);
    }

    async getById(req: Request, res: Response) {
        const data = await service.getById(req.params.id);
        res.json(data);
    }

    async create(req: Request, res: Response) {
        const data = await service.create(req.body);
        res.status(201).json(data);
    }

    async update(req: Request, res: Response) {
        const data = await service.update(req.params.id, req.body);
        res.json(data);
    }

    async delete(req: Request, res: Response) {
        await service.delete(req.params.id);
        res.status(204).send();
    }
}
