import mongoose, { Schema, Document } from 'mongoose';

export interface IIssues extends Document {
  title: string;
  description: string;
  images?: string[];
  status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
  reporter?: string;
  technician?: string; // Assigned technician (user id)
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const issuesSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    reporter: { type: Schema.Types.ObjectId, ref: 'User' },
    technician: { type: Schema.Types.ObjectId, ref: 'Technicians', default: null },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IIssues>('Issues', issuesSchema);
