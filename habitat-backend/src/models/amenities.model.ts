import mongoose, { Schema, Document } from 'mongoose';

export interface IAmenities extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const amenitiesSchema: Schema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IAmenities>('Amenities', amenitiesSchema);
