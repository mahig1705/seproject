import express from "express";
import * as noticeController from "../controllers/notices.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(verifyAuth);

router.post("/", noticeController.createNotice);
router.get("/", noticeController.getNotices);
router.get("/:id", noticeController.getNotice);
router.put("/:id", noticeController.updateNotice);
router.patch('/:id', noticeController.updateNotice); 
router.delete("/:id", noticeController.deleteNotice);

export default router;
