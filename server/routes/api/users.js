import { Router } from 'express';
import UserController from '../../controllers/users';
import auth from '../../middleware/auth';

const userRoutes = Router();
// get authenticateUser method
const { authenticateUser } = auth;

userRoutes.post('/', UserController.userSignup);

userRoutes.post('/login', UserController.userLogin);

userRoutes.get('/', authenticateUser, UserController.getProfiles);

userRoutes.get('/:username', authenticateUser, UserController.getProfileByUsername);

userRoutes.put('/:userId', authenticateUser, UserController.updateUserProfile);

userRoutes.post('/password/recover', UserController.recoverPassword);

userRoutes.post('/password/reset', UserController.resetPassword);

export default userRoutes;
