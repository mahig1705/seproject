import { Request, Response } from 'express';
import { BillsService } from '../services/bills.service';
const service = new BillsService();

export class BillsController {
  // ✅ FIX: Wrap response in consistent format
  async getAll(req: Request, res: Response) {
    try {
      const { userId, status } = req.query;
      const data = await service.getAll({ 
        userId: userId as string, 
        status: status as string 
      });
      res.json({ success: true, data }); // ✅ Consistent wrapper
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch bills' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Bill not found' });
      res.json({ success: true, data }); // ✅ Wrapped
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data }); // ✅ Wrapped
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await service.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ success: false, message: 'Bill not found' });
      res.json({ success: true, data }); // ✅ Wrapped
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      res.json({ success: true, message: 'Bill deleted' }); // ✅ Changed from 204
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async payBill(req: Request, res: Response) {
    try {
      const { amount, gatewayRef } = req.body;
      const data = await service.payBill(req.params.id, amount, gatewayRef);
      res.json({ success: true, data }); // ✅ Wrapped
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async generateBills(req: Request, res: Response) {
    try {
      const billsData = req.body;
      const data = await service.generateBills(billsData);
      res.status(201).json({ success: true, data }); // ✅ Wrapped
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
