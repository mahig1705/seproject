"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const amenities_routes_1 = __importDefault(require("./amenities.routes"));
const bookings_routes_1 = __importDefault(require("./bookings.routes"));
const issues_routes_1 = __importDefault(require("./issues.routes"));
const bills_routes_1 = __importDefault(require("./bills.routes"));
const technicians_routes_1 = __importDefault(require("./technicians.routes"));
const visitors_routes_1 = __importDefault(require("./visitors.routes"));
const router = (0, express_1.Router)();
router.use('/amenities', amenities_routes_1.default);
router.use('/bookings', bookings_routes_1.default);
router.use('/issues', issues_routes_1.default);
router.use('/bills', bills_routes_1.default);
router.use('/technicians', technicians_routes_1.default);
router.use('/visitors', visitors_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map