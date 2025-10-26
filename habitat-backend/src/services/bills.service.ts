import BillsModel, { IBills } from '../models/bills.model';

export class BillsService {
    async getAll(): Promise<IBills[]> {
        return BillsModel.find();
    }

    async getById(id: string) {
        return BillsModel.findById(id);
    }

    async create(data: Partial<IBills>) {
        return BillsModel.create(data);
    }

    async update(id: string, data: Partial<IBills>) {
        return BillsModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return BillsModel.findByIdAndDelete(id);
    }
}
