"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = void 0;
const issues_model_1 = __importDefault(require("../models/issues.model"));
class IssuesService {
    // Get all issues and populate reporter + technician
    async getAll() {
        return issues_model_1.default.find()
            .populate('reporter', 'name')
            .populate('technician', 'name'); // populate technician
    }
    // Get single issue by ID
    async getById(id) {
        return issues_model_1.default.findById(id)
            .populate('reporter', 'name')
            .populate('technician', 'name');
    }
    // Create a new issue
    async create(data) {
        const newIssue = await issues_model_1.default.create(data); // await first
        await newIssue.populate('reporter', 'name'); // populate reporter
        await newIssue.populate('technician', 'name'); // populate technician
        return newIssue;
    }
    // Update issue by ID
    async update(id, data) {
        const updatedIssue = await issues_model_1.default.findByIdAndUpdate(id, data, { new: true });
        if (!updatedIssue)
            return null;
        await updatedIssue.populate('reporter', 'name');
        await updatedIssue.populate('technician', 'name');
        return updatedIssue;
    }
    // Delete issue by ID
    async delete(id) {
        return issues_model_1.default.findByIdAndDelete(id);
    }
}
exports.IssuesService = IssuesService;
//# sourceMappingURL=issues.service.js.map