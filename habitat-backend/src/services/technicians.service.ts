import TechniciansModel, { ITechnicians } from '../models/technicians.model';

export class TechniciansService {
    async getAll(): Promise<ITechnicians[]> {
        return TechniciansModel.find();
    }

    async getById(id: string) {
        return TechniciansModel.findById(id);
    }

    async create(data: Partial<ITechnicians>) {
        return TechniciansModel.create(data);
    }

    async update(id: string, data: Partial<ITechnicians>) {
        return TechniciansModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return TechniciansModel.findByIdAndDelete(id);
    }
}
