import { Request, Response } from 'express';
import { BillsService } from '../services/bills.service';
const service = new BillsService();

export class BillsController {
  async getAll(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const data = await service.getAll();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch bills' });
  }
}



  async getById(req: Request, res: Response) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Bill not found' });
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Failed to fetch bill' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await service.create(req.body);
      res.status(201).json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Failed to create bill' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await service.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ message: 'Bill not found' });
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Failed to update bill' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Failed to delete bill' });
    }
  }

  // ---------------- Custom Endpoints ----------------
  async payBill(req: Request, res: Response) {
    try {
      const { amount, gatewayRef } = req.body;
      const bill = await service.payBill(req.params.id, amount, gatewayRef);
      res.json(bill);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async generateBills(req: Request, res: Response) {
    try {
      const billsData = req.body; // array of { user, description, amount, dueDate }
      const bills = await service.generateBills(billsData);
      res.status(201).json(bills);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
