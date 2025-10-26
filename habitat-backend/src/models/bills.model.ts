import mongoose, { Schema, Document } from 'mongoose';

export interface IBills extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const billsSchema: Schema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IBills>('Bills', billsSchema);
