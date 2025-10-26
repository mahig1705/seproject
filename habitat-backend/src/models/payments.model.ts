import mongoose, { Schema, Document } from 'mongoose';

export interface IPayments extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const paymentsSchema: Schema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IPayments>('Payments', paymentsSchema);
