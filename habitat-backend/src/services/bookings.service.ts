import BookingsModel, { IBookings } from '../models/bookings.model';

export class BookingsService {
    async getAll(): Promise<IBookings[]> {
        return BookingsModel.find();
    }

    async getById(id: string) {
        return BookingsModel.findById(id);
    }

    async create(data: Partial<IBookings>) {
        return BookingsModel.create(data);
    }

    async update(id: string, data: Partial<IBookings>) {
        return BookingsModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string) {
        return BookingsModel.findByIdAndDelete(id);
    }
}
