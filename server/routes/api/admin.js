import adminDeactivateController from '../../controllers/adminDeactivate';
import auth from '../../middleware/auth';


// get authenticateUser method
const { authenticateUser, authorizeAdmin } = auth;
const adminRoutes = require('express').Router();


adminRoutes.post('/delete/:authorId', authenticateUser, authorizeAdmin, adminDeactivateController.deleteAuthor);
adminRoutes.post('/deactivate/:userId', authenticateUser, authorizeAdmin, adminDeactivateController.deactivateUser);

export default adminRoutes;
