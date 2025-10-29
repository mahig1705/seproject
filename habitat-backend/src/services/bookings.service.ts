import BookingsModel, { IBookings } from '../models/bookings.model';
import '../models/amenities.model'; // ✅ make sure this is imported
import '../models/user.model';

export class BookingsService {
  async getAll(): Promise<IBookings[]> {
    return BookingsModel.find()
      .populate('userId', 'name email')
      .populate('amenityId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getById(id: string): Promise<IBookings | null> {
    return BookingsModel.findById(id)
      .populate('userId', 'name email')
      .populate('amenityId', 'name')
      .exec();
  }

  async create(data: Partial<IBookings>): Promise<IBookings> {
    const booking = new BookingsModel(data);
    return await booking.save();
  }

  async update(id: string, data: Partial<IBookings>): Promise<IBookings | null> {
    return BookingsModel.findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name email')
      .populate('amenityId', 'name')
      .exec();
  }

  async delete(id: string): Promise<IBookings | null> {
    return BookingsModel.findByIdAndDelete(id);
  }

  async updateStatus(id: string, status: string): Promise<IBookings | null> {
    return BookingsModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('amenityId', 'name')
      .exec();
  }
}
