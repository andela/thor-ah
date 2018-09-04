import { Router } from 'express';
import UserController from '../../controllers/users';
import EmailVerificationController from '../../controllers/emailVerificationController';

const userRoutes = Router();

userRoutes.post('/', UserController.userSignup);

userRoutes.put('/confirmation/:token', EmailVerificationController.confirmEmail);

userRoutes.post('/login', UserController.userLogin);

userRoutes.get('/', UserController.getProfiles);

userRoutes.get('/:username', UserController.getProfileByUsername);

userRoutes.put('/:userId', UserController.updateUserProfile);

export default userRoutes;
