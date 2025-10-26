// controllers/issues.controller.ts
import { Request, Response } from 'express';
import { IssuesService } from '../services/issues.service';

const service = new IssuesService();

export class IssuesController {
    async getAll(req: Request, res: Response) {
        try {
            const data = await service.getAll();
            res.status(200).json({ data });  // ✅ wrap it
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return res.status(404).json({ message: 'Issue not found' });
            res.status(200).json({ data });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data = await service.create(req.body);
            res.status(201).json({ data });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req: Request, res: Response) {
  try {
    const data = await service.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'Issue not found' });
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}


    async delete(req: Request, res: Response) {
        try {
            await service.delete(req.params.id);
            res.status(200).json({ message: 'Issue deleted successfully' });
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
