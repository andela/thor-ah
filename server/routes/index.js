import { Router } from 'express';
import apiRoutes from './api';
import notFound from './api/welcome';

const router = Router();
router.use('/api', apiRoutes);
router.use(notFound);

export default router;
