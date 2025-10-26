import mongoose, { Schema, Document } from 'mongoose';

export interface IBookings extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const bookingsSchema: Schema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IBookings>('Bookings', bookingsSchema);
