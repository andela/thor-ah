import SocialAuthController from '../../controllers/socialAuth';

const router = express.Router();

// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
},
));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', (req, res) => {
  passport.authenticate('facebook', { session: false, }) => {
    SocialAuthController.response;
  }
});

// route for google authentication and login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] },
));

// the callback after google has authenticated the user
router.get('/auth/google/callback', (req, res) => {
  passport.authenticate('google', { session: false }) => {
    SocialAuthController.response;
  }
});

export default router;
