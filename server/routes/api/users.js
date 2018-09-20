import { Router } from 'express';
import UserController from '../../controllers/users';
import AdminDeactivateController from '../../controllers/adminDeactivate';
import auth from '../../middleware/auth';

import EmailVerificationController from '../../controllers/emailVerificationController';
import authorRequestsController from '../../controllers/authorRequests';

const userRoutes = Router();
// get authenticateUser method
const { authenticateUser } = auth;

userRoutes.post('/', UserController.userSignup);

userRoutes.get('/confirmation/:token', EmailVerificationController.confirmEmail);

userRoutes.post('/verify/resend-email', EmailVerificationController.resendVerificationEmail);

userRoutes.post('/login', UserController.userLogin);

userRoutes.get('/:username', authenticateUser, UserController.getProfileByUsername);

userRoutes.put('/:userId', authenticateUser, UserController.updateUserProfile);

userRoutes.post('/password/recover', UserController.recoverPassword);

userRoutes.post('/password/reset', UserController.resetPassword);

userRoutes.post('/authors/requests', authenticateUser, authorRequestsController.makeARequest);

userRoutes.get('/authors/requests', authenticateUser, authorRequestsController.getRequestsByAUser);

userRoutes.get('/authors/requests/:requestId', authenticateUser, authorRequestsController.getOneRequest);

userRoutes.delete('/authors/requests/:requestId', authenticateUser, authorRequestsController.deleteARequest);

userRoutes.delete('/delete/:userId', authenticateUser, AdminDeactivateController.deleteUser);


export default userRoutes;
