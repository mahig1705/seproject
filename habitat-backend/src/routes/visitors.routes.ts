import { Router } from 'express';
import { VisitorsController } from '../controllers/visitors.controller';

const router = Router();
const controller = new VisitorsController();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
