import { Router } from 'express';
import apiRoutes from './api';
import notFound from './api/welcome';

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authors Haven API is live'
  })
});

router.use('/api', require('./api'));

export default router;
