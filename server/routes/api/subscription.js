import Sucscription from '../../controllers/subscription';
import auth from '../../middleware/auth';

// get authenticateUser method
const { authenticateUser } = auth;

const router = require('express').Router();

router.post('/', authenticateUser, Sucscription.subscribe);
router.delete('/:notifId', authenticateUser, Sucscription.unsoscribe);

export default router;
