"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesController = void 0;
const issues_service_1 = require("../services/issues.service");
const service = new issues_service_1.IssuesService();
class IssuesController {
    async getAll(req, res) {
        try {
            const data = await service.getAll();
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async getById(req, res) {
        try {
            const data = await service.getById(req.params.id);
            if (!data)
                return res.status(404).json({ message: 'Issue not found' });
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // ✅ FIXED: Automatically set reporter from JWT token
    async create(req, res) {
        try {
            // Extract userId from authenticated user (set by verifyAuth middleware)
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            // ✅ Merge reporter with request body
            const issueData = {
                ...req.body,
                reporter: userId // Set reporter automatically from JWT
            };
            const data = await service.create(issueData);
            res.status(201).json({ data });
        }
        catch (err) {
            console.error('Create issue error:', err);
            res.status(500).json({ message: err.message });
        }
    }
    async update(req, res) {
        try {
            const data = await service.update(req.params.id, req.body);
            if (!data)
                return res.status(404).json({ message: 'Issue not found' });
            res.status(200).json({ data });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async delete(req, res) {
        try {
            await service.delete(req.params.id);
            res.status(200).json({ message: 'Issue deleted successfully' });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.IssuesController = IssuesController;
