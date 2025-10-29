"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotice = exports.updateNotice = exports.getNoticeById = exports.getAllNotices = exports.createNotice = void 0;
const notice_model_1 = __importDefault(require("../models/notice.model"));
const createNotice = async (data) => {
    const notice = new notice_model_1.default(data);
    return await notice.save();
};
exports.createNotice = createNotice;
const getAllNotices = async () => {
    return await notice_model_1.default.find().sort({ createdAt: -1 });
};
exports.getAllNotices = getAllNotices;
const getNoticeById = async (id) => {
    return await notice_model_1.default.findById(id);
};
exports.getNoticeById = getNoticeById;
const updateNotice = async (id, data) => {
    return await notice_model_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateNotice = updateNotice;
const deleteNotice = async (id) => {
    return await notice_model_1.default.findByIdAndDelete(id);
};
exports.deleteNotice = deleteNotice;
//# sourceMappingURL=notice.service.js.map