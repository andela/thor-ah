import passport from 'passport';
import { Router } from 'express';
import SocialAuthController from '../../controllers/socialAuth';

const router = Router();

// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }), SocialAuthController.response);

// route for google authentication and login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }), SocialAuthController.response);

export default router;
