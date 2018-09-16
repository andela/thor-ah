import adminDeactivateController from '../../controllers/adminDeactivate';
import auth from '../../middleware/auth';


// get authenticateUser method
const { authenticateUser, authorizeAdmin } = auth;
const router = require('express').Router();


router.post('/delete/:authorId', authenticateUser, authorizeAdmin, adminDeactivateController.deleteAuthor);
router.post('/deactivate/:userId', authenticateUser, authorizeAdmin, adminDeactivateController.deactivateUser);

export default router;
