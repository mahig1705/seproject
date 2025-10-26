import mongoose, { Schema, Document } from "mongoose";

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    visibleFrom: { type: Date, required: true },
    visibleUntil: { type: Date, required: true },
    pinned: { type: Boolean, default: false },
    audience: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export interface INotice extends Document {
  title: string;
  description: string;
  visibleFrom: Date;
  visibleUntil: Date;
  pinned: boolean;
  audience: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<INotice>("Notice", noticeSchema);


