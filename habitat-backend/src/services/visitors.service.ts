import VisitorsModel, { IVisitors } from '../models/visitors.model';

export class VisitorsService {
    async getAll(): Promise<IVisitors[]> {
        return VisitorsModel.find();
    }

    async getById(id: string) {
        return VisitorsModel.findById(id);
    }

    async create(data: Partial<IVisitors>) {
        return VisitorsModel.create(data);
    }

    async update(id: string, data: Partial<IVisitors>) {
        return VisitorsModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return VisitorsModel.findByIdAndDelete(id);
    }
}
