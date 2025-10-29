"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsService = void 0;
const bills_model_1 = __importStar(require("../models/bills.model"));
class BillsService {
    async getAll(params) {
        const query = {};
        if (params?.userId)
            query.user = params.userId;
        if (params?.status)
            query.status = params.status;
        return bills_model_1.default.find(query)
            .populate('user', 'name flatNumber')
            .sort({ createdAt: -1 });
    }
    async getById(id) {
        return bills_model_1.default.findById(id).populate('user', 'name flatNumber');
    }
    async create(data) {
        return bills_model_1.default.create(data);
    }
    async update(id, data) {
        return bills_model_1.default.findByIdAndUpdate(id, data, { new: true }).populate('user', 'name flatNumber');
    }
    async delete(id) {
        return bills_model_1.default.findByIdAndDelete(id);
    }
    // ---------------- Custom Payment Logic ----------------
    async payBill(id, amount, gatewayRef) {
        const bill = await bills_model_1.default.findById(id);
        if (!bill)
            throw new Error('Bill not found');
        if (bill.status !== bills_model_1.PaymentStatus.PENDING)
            throw new Error('Bill already paid or closed');
        if (amount < bill.amount)
            throw new Error('Amount cannot be less than bill amount');
        bill.status = bills_model_1.PaymentStatus.COMPLETED;
        bill.gatewayRef = gatewayRef;
        await bill.save();
        return bill;
    }
    async generateBills(billsData) {
        return bills_model_1.default.insertMany(billsData);
    }
}
exports.BillsService = BillsService;
