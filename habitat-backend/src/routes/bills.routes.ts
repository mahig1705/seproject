import { Router } from 'express';
import { BillsController } from '../controllers/bills.controller';

const router = Router();
const controller = new BillsController();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
