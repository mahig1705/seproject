import { Request, Response } from 'express';
import { BookingsService } from '../services/bookings.service';

const service = new BookingsService();

export class BookingsController {
  async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json({ success: true, data });
  }

  async getById(req: Request, res: Response) {
    const data = await service.getById(req.params.id);
    res.json({ success: true, data });
  }

  // bookings.controller.ts
async create(req: Request, res: Response) {
  try {
    // Extract userId from authenticated user (set by verifyAuth middleware)
    const userId = (req as any).user?.id || (req as any).user?._id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    // Merge userId with request body
    const bookingData = {
      ...req.body,
      userId: userId
    };

    const data = await service.create(bookingData);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}


  async update(req: Request, res: Response) {
    const data = await service.update(req.params.id, req.body);
    res.json({ success: true, data });
  }

  async delete(req: Request, res: Response) {
    await service.delete(req.params.id);
    res.json({ success: true });
  }

  // ✅ New method for approving or rejecting a booking
  async approveBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await service.updateStatus(id, status);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      console.error('Approve booking error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
