import mongoose, { Schema, Document } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface IBills extends Document {
  user: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  gatewayRef?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const billsSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  gatewayRef: { type: String } // stores payment gateway reference if paid
}, { timestamps: true });

export default mongoose.model<IBills>('Bills', billsSchema);
