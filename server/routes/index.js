import { Router } from 'express';
import apiRoutes from './api';
import notFound from './api/welcome';

<<<<<<< HEAD
const router = Router();
router.use('/api', apiRoutes);
router.use(notFound);
=======
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authors Haven API is live'
  })
});

router.use('/api', require('./api'));
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1

export default router;
