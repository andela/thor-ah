import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import SocialAuthController from '../controllers/socialAuth';


// the strategies for getting the user's facebook and google id

// pull in our app id and secret from our social config file
passport.use(new FacebookStrategy({

  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
  profileFields: ['id', 'emails', 'name', 'photos', 'displayName']
}, SocialAuthController.passportCallback));

// pull in our app id and secret from our social config file
passport.use(new GoogleStrategy({

  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  proxy: true
}, SocialAuthController.passportCallback));
