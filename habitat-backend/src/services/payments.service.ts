import PaymentsModel, { IPayments } from '../models/payments.model';

export class PaymentsService {
    async getAll(): Promise<IPayments[]> {
        return PaymentsModel.find();
    }

    async getById(id: string) {
        return PaymentsModel.findById(id);
    }

    async create(data: Partial<IPayments>) {
        return PaymentsModel.create(data);
    }

    async update(id: string, data: Partial<IPayments>) {
        return PaymentsModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return PaymentsModel.findByIdAndDelete(id);
    }
}
