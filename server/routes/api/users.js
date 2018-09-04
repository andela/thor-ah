import { Router } from 'express';
import UserController from '../../controllers/users';
import auth from '../../middleware/auth';

import EmailVerificationController from '../../controllers/emailVerificationController';

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

userRoutes.get('/verify-email/:id', EmailVerificationController.sendVerificationEmail);

userRoutes.get('/confirmation/:token', EmailVerificationController.confirmEmail);

export default userRoutes;
