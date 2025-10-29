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
exports.deleteNotice = exports.updateNotice = exports.getNotice = exports.getNotices = exports.createNotice = void 0;
const noticeService = __importStar(require("../services/notice.service"));
const createNotice = async (req, res) => {
    try {
        const { title, description, visibleFrom, visibleUntil, pinned, audience } = req.body;
        if (!title || !description || !visibleFrom || !visibleUntil || !audience)
            return res.status(400).json({ message: "Missing required fields" });
        const notice = await noticeService.createNotice({
            title,
            description,
            visibleFrom: new Date(visibleFrom),
            visibleUntil: new Date(visibleUntil),
            pinned: pinned || false,
            audience
        });
        res.status(201).json({ data: notice });
    }
    catch (err) {
        console.error("Error creating notice:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.createNotice = createNotice;
const getNotices = async (req, res) => {
    try {
        const notices = await noticeService.getAllNotices();
        res.status(200).json({ data: notices }); // wrap array in 'data'
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getNotices = getNotices;
const getNotice = async (req, res) => {
    try {
        const notice = await noticeService.getNoticeById(req.params.id);
        if (!notice)
            return res.status(404).json({ message: "Notice not found" });
        res.status(200).json(notice);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getNotice = getNotice;
const updateNotice = async (req, res) => {
    try {
        const notice = await noticeService.updateNotice(req.params.id, req.body);
        res.status(200).json(notice);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateNotice = updateNotice;
const deleteNotice = async (req, res) => {
    try {
        await noticeService.deleteNotice(req.params.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteNotice = deleteNotice;
//# sourceMappingURL=notices.controller.js.map