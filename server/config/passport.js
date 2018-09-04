
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import SocialAuthController from '../controllers/socialAuth';

// the strategies for getting the user's facebook, twitter and google id

export default (passport) => {
  passport.use(new FacebookStrategy({

  // pull in our app id and secret from our social config file
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'email', 'name']
  }, SocialAuthController.passportCallback));

  passport.use(new GoogleStrategy({

    // pull in our app id and secret from our social config file
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }, SocialAuthController.passportCallback));
};
