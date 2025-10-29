import { Document, Schema, model, Types } from "mongoose";

interface IUserRef {
  _id: string;
  name: string;
  email: string;
}

interface IAmenityRef {
  _id: string;
  name: string;
}

export interface IBookings extends Document {
  userId: Types.ObjectId | IUserRef;
  amenityId: Types.ObjectId | IAmenityRef;
  startTime: Date;
  endTime: Date;
  status: string;
}

const bookingsSchema = new Schema<IBookings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amenityId: { type: Schema.Types.ObjectId, ref: "Amenities", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default model<IBookings>("Bookings", bookingsSchema);
