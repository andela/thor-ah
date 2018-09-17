import { Router } from 'express';
import UserController from '../../controllers/users';
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

userRoutes.get('/', authenticateUser, UserController.getProfiles);

userRoutes.get('/:username', authenticateUser, UserController.getProfileByUsername);

userRoutes.put('/:userId', authenticateUser, UserController.updateUserProfile);

userRoutes.post('/password/recover', UserController.recoverPassword);

userRoutes.post('/password/reset', UserController.resetPassword);

userRoutes.post('/authors/requests', authenticateUser, authorRequestsController.makeRequest);

userRoutes.get('/authors/requests', authenticateUser, authorRequestsController.getRequests);

userRoutes.get('/authors/requests/:requestId', authenticateUser, authorRequestsController.getRequest);

userRoutes.delete('/authors/requests/:requestId', authenticateUser, authorRequestsController.deleteARequest);

export default userRoutes;
