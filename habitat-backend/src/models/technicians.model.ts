import mongoose, { Schema, Document } from 'mongoose';

export interface ITechnicians extends Document {
  name: string;
  contact?: string;
  specializations: string[];
  availability?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const techniciansSchema: Schema = new Schema({
  name: { type: String, required: true },
  contact: { type: String },
  specializations: [{ type: String }],
  availability: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ITechnicians>('Technicians', techniciansSchema);
