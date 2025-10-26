import Notice, { INotice } from "../models/notice.model";

export const createNotice = async (data: Partial<INotice>) => {
  const notice = new Notice(data);
  return await notice.save();
};

export const getAllNotices = async () => {
  return await Notice.find().sort({ createdAt: -1 });
};

export const getNoticeById = async (id: string) => {
  return await Notice.findById(id);
};

export const updateNotice = async (id: string, data: Partial<INotice>) => {
  return await Notice.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNotice = async (id: string) => {
  return await Notice.findByIdAndDelete(id);
};
