<<<<<<< HEAD
import { Router } from 'express';
import UserController from '../../controllers/users';
=======
const router = require('express').Router();
const passport = require('passport');
const db = require('../../models');
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1
import EmailVerificationController from '../../controllers/emailVerificationController';

const userRoutes = Router();

userRoutes.post('/', UserController.userSignup);

userRoutes.put('/confirmation/:token', EmailVerificationController.confirmEmail);

userRoutes.post('/login', UserController.userLogin);

userRoutes.get('/', UserController.getProfiles);

userRoutes.get('/:username', UserController.getProfileByUsername);

userRoutes.put('/:userId', UserController.updateUserProfile);

<<<<<<< HEAD
export default userRoutes;
=======
    if (user) {
      return res.json({ user: user.toAuthJSON() });
    }
    return res.status(422).json(info);
  })(req, res, next);
});

router.post('/users', (req, res, next) => {
  const { username, email, password } = req.body.user;
  User
    .create({ username, email, hash: password })
    .then(user => res.json({
      username: user.username,
      email: user.email,
    }))
    .catch(next);
});

router.get('/verify-email/:id', EmailVerificationController.sendVerificationEmail);

router.get('/confirmation/:token', EmailVerificationController.confirmEmail);

module.exports = router;
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1
