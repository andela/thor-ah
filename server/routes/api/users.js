const router = require('express').Router();
const passport = require('passport');
const db = require('../../models');
import EmailVerificationController from '../../controllers/emailVerificationController';

const userRoutes = Router();

userRoutes.post('/', UserController.userSignup);

userRoutes.post('/login', UserController.userLogin);

userRoutes.get('/', UserController.getProfiles);

userRoutes.get('/:username', UserController.getProfileByUsername);

userRoutes.put('/:userId', UserController.updateUserProfile);

router.get('/verify-email/:id', EmailVerificationController.sendVerificationEmail);

router.get('/confirmation/:token', EmailVerificationController.confirmEmail);

module.exports = router;
