import { Router } from 'express';
import { BillsController } from '../controllers/bills.controller';

const router = Router();
const controller = new BillsController();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

// Custom routes
router.patch('/:id/pay', controller.payBill.bind(controller));
router.post('/generate', controller.generateBills.bind(controller));
router.post('/:id/pay', controller.payBill.bind(controller));

export default router;
