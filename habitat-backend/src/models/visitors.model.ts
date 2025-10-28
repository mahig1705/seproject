import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  name: string;
  flatNumber: string;
  purpose: string;
  vehicle?: string;
  inTime?: Date;
  outTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    name: { type: String, required: true },
    flatNumber: { type: String, required: true },
    purpose: { type: String, required: true },
    vehicle: { type: String },
    inTime: { type: Date, default: Date.now },
    outTime: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IVisitor>('Visitor', visitorSchema);
