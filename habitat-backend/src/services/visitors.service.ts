import VisitorModel, { IVisitor } from '../models/visitors.model';

export class VisitorsService {
  // Get all visitors
  // services/visitors.service.ts
async getAll(filter: any = {}): Promise<IVisitor[]> {
  return VisitorModel.find(filter);
}

  // Get one visitor
  async getById(id: string): Promise<IVisitor | null> {
    return VisitorModel.findById(id);
  }

  // Create visitor
  async create(data: Partial<IVisitor>): Promise<IVisitor> {
    if (!data.inTime) data.inTime = new Date();
    return VisitorModel.create(data);
  }

  // ✅ Checkout visitor (set outTime)
  async checkoutVisitor(id: string): Promise<IVisitor | null> {
    return VisitorModel.findByIdAndUpdate(
      id,
      { outTime: new Date() },
      { new: true }
    );
  }

  // Update visitor
  async update(id: string, data: Partial<IVisitor>): Promise<IVisitor | null> {
    return VisitorModel.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete visitor
  async delete(id: string): Promise<IVisitor | null> {
    return VisitorModel.findByIdAndDelete(id);
  }
}
