import BillsModel, { IBills, PaymentStatus } from '../models/bills.model';

interface GetBillsParams {
  userId?: string;
  status?: PaymentStatus | string;
}

export class BillsService {
  async getAll(params?: GetBillsParams): Promise<IBills[]> {
    const query: any = {};
    if (params?.userId) query.user = params.userId;
    if (params?.status) query.status = params.status;

    return BillsModel.find(query)
      .populate('user', 'name flatNumber')
      .sort({ createdAt: -1 });
  }

  async getById(id: string) {
    return BillsModel.findById(id).populate('user', 'name flatNumber');
  }

  async create(data: Partial<IBills>) {
    return BillsModel.create(data);
  }

  async update(id: string, data: Partial<IBills>) {
    return BillsModel.findByIdAndUpdate(id, data, { new: true }).populate('user', 'name flatNumber');
  }

  async delete(id: string) {
    return BillsModel.findByIdAndDelete(id);
  }

  // ---------------- Custom Payment Logic ----------------
  async payBill(id: string, amount: number, gatewayRef: string) {
    const bill = await BillsModel.findById(id);
    if (!bill) throw new Error('Bill not found');
    if (bill.status !== PaymentStatus.PENDING) throw new Error('Bill already paid or closed');
    if (amount < bill.amount) throw new Error('Amount cannot be less than bill amount');

    bill.status = PaymentStatus.COMPLETED;
    bill.gatewayRef = gatewayRef;
    await bill.save();

    return bill;
  }

  async generateBills(billsData: { user: string; description: string; amount: number; dueDate: Date }[]) {
    return BillsModel.insertMany(billsData);
  }
}
