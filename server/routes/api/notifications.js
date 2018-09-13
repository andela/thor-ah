import Notification from '../../controllers/notifications';
import auth from '../../middleware/auth';

// get authenticateUser method
const { authenticateUser } = auth;

const router = require('express').Router();

router.get('/', authenticateUser, Notification.getNotifications);
router.delete('/:notifId', authenticateUser, Notification.delete);

export default router;
