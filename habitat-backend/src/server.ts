import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { ConnectOptions } from "mongoose";

// ✅ Import all models before routes
import "./models/user.model";
import "./models/amenities.model";
import "./models/bookings.model";
import "./models/bills.model";
import "./models/issues.model";
import "./models/technicians.model";
import "./models/visitors.model";
import "./models/notice.model";

// ✅ Then import routes
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import noticeRoutes from "./routes/notices.routes";
import amenitiesRoutes from "./routes/amenities.routes";
import billsRoutes from "./routes/bills.routes";
import bookingsRoutes from "./routes/bookings.routes";
import issuesRoutes from "./routes/issues.routes";
import techniciansRoutes from "./routes/technicians.routes";
import visitorsRoutes from "./routes/visitors.routes";

import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/habitat";

app.use(
  cors({
    origin: ["http://localhost:3000","https://seproject-six.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

mongoose.connect(process.env.MONGO_URI as string, {
  tls: true,
  tlsAllowInvalidCertificates: true
} as ConnectOptions)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("Habitat backend running"));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/amenities", amenitiesRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/technicians", techniciansRoutes);
app.use("/api/visitors", visitorsRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});
