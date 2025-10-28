import { Request, Response } from 'express';
import { VisitorsService } from '../services/visitors.service';

const service = new VisitorsService();

export class VisitorsController {
  // controllers/visitors.controller.ts
async getAll(req: Request, res: Response) {
  try {
    const { date, active } = req.query;

    const filter: any = {};

    // Filter for today's visitors
    if (date) {
      const start = new Date(date as string);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date as string);
      end.setHours(23, 59, 59, 999);
      filter.inTime = { $gte: start, $lte: end };
    }

    // Filter for active visitors (not checked out)
    if (active === 'true') {
      filter.outTime = null;
    }

    const data = await service.getAll(filter);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Get visitors error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch visitors' });
  }
}


  async getById(req: Request, res: Response) {
    try {
      const visitor = await service.getById(req.params.id);
      if (!visitor) return res.status(404).json({ success: false, message: 'Visitor not found' });
      res.json({ success: true, data: visitor });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const visitor = await service.create(req.body);
      res.status(201).json({ success: true, data: visitor });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async checkout(req: Request, res: Response) {
    try {
      const updated = await service.checkoutVisitor(req.params.id);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await service.update(req.params.id, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
