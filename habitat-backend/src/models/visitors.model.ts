import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitors extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const visitorsSchema: Schema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IVisitors>('Visitors', visitorsSchema);
