import AdminDeactivateController from '../../controllers/adminDeactivate';
import auth from '../../middleware/auth';


// get authenticateUser method
const { authenticateUser, authorizeAdmin } = auth;
const adminRoutes = require('express').Router();


adminRoutes.delete('/delete/:authorId', authenticateUser, authorizeAdmin, AdminDeactivateController.deleteAuthor);
adminRoutes.put('/deactivate/:userId', authenticateUser, authorizeAdmin, AdminDeactivateController.deactivateUser);

export default adminRoutes;
