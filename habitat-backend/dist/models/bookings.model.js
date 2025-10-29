"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amenityId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Amenities", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Bookings", bookingsSchema);
