"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
// ✅ Import all models before routes
require("./models/user.model");
require("./models/amenities.model");
require("./models/bookings.model");
require("./models/bills.model");
require("./models/issues.model");
require("./models/technicians.model");
require("./models/visitors.model");
require("./models/notice.model");
// ✅ Then import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const notices_routes_1 = __importDefault(require("./routes/notices.routes"));
const amenities_routes_1 = __importDefault(require("./routes/amenities.routes"));
const bills_routes_1 = __importDefault(require("./routes/bills.routes"));
const bookings_routes_1 = __importDefault(require("./routes/bookings.routes"));
const issues_routes_1 = __importDefault(require("./routes/issues.routes"));
const technicians_routes_1 = __importDefault(require("./routes/technicians.routes"));
const visitors_routes_1 = __importDefault(require("./routes/visitors.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/habitat";
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
mongoose_1.default
    .connect(MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true, // 👈 local testing only
})
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
});
app.get("/", (req, res) => res.send("Habitat backend running"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/notices", notices_routes_1.default);
app.use("/api/amenities", amenities_routes_1.default);
app.use("/api/bills", bills_routes_1.default);
app.use("/api/bookings", bookings_routes_1.default);
app.use("/api/issues", issues_routes_1.default);
app.use("/api/technicians", technicians_routes_1.default);
app.use("/api/visitors", visitors_routes_1.default);
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await mongoose_1.default.connection.close();
    process.exit(0);
});
