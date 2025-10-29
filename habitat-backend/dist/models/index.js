"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitors = exports.Technicians = exports.Bills = exports.Issues = exports.Bookings = exports.Amenities = void 0;
var amenities_model_1 = require("./amenities.model");
Object.defineProperty(exports, "Amenities", { enumerable: true, get: function () { return __importDefault(amenities_model_1).default; } });
var bookings_model_1 = require("./bookings.model");
Object.defineProperty(exports, "Bookings", { enumerable: true, get: function () { return __importDefault(bookings_model_1).default; } });
var issues_model_1 = require("./issues.model");
Object.defineProperty(exports, "Issues", { enumerable: true, get: function () { return __importDefault(issues_model_1).default; } });
var bills_model_1 = require("./bills.model");
Object.defineProperty(exports, "Bills", { enumerable: true, get: function () { return __importDefault(bills_model_1).default; } });
var technicians_model_1 = require("./technicians.model");
Object.defineProperty(exports, "Technicians", { enumerable: true, get: function () { return __importDefault(technicians_model_1).default; } });
var visitors_model_1 = require("./visitors.model");
Object.defineProperty(exports, "Visitors", { enumerable: true, get: function () { return __importDefault(visitors_model_1).default; } });
//# sourceMappingURL=index.js.map