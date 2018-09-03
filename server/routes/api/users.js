import { Router } from 'express';
import UserController from '../../controllers/users';

const userRoutes = Router();

userRoutes.post('/', UserController.userSignup);

userRoutes.post('/login', UserController.userLogin);

userRoutes.get('/', UserController.getProfiles);

userRoutes.get('/:username', UserController.getProfileByUsername);

userRoutes.put('/:userId', UserController.updateUserProfile);

export default userRoutes;
