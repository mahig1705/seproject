import { Router } from 'express';
import { verifyAuth } from '../middlewares/auth.middleware';
import { IssuesController } from '../controllers/issues.controller';

const router = Router();
const controller = new IssuesController();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', verifyAuth, controller.create.bind(controller));
router.patch('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
