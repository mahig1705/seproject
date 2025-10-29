import { Router } from 'express';
import amenitiesRouter from './amenities.routes';
import bookingsRouter from './bookings.routes';
import issuesRouter from './issues.routes';
import billsRouter from './bills.routes';
import techniciansRouter from './technicians.routes';
import visitorsRouter from './visitors.routes';

const router = Router();
router.use('/amenities', amenitiesRouter);
router.use('/bookings', bookingsRouter);
router.use('/issues', issuesRouter);
router.use('/bills', billsRouter);
router.use('/technicians', techniciansRouter);
router.use('/visitors', visitorsRouter);

export default router;

