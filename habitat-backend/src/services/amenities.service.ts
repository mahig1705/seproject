import AmenitiesModel, { IAmenities } from '../models/amenities.model';

export class AmenitiesService {
    async getAll(): Promise<IAmenities[]> {
        return AmenitiesModel.find();
    }

    async getById(id: string) {
        return AmenitiesModel.findById(id);
    }

    async create(data: Partial<IAmenities>) {
        return AmenitiesModel.create(data);
    }

    async update(id: string, data: Partial<IAmenities>) {
        return AmenitiesModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return AmenitiesModel.findByIdAndDelete(id);
    }
}
