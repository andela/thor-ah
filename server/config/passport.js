import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import configAuth from './socialConfig';
import SocialAuthController from '../controllers/socialAuth';


// the strategies for getting the user's facebook and google id

// pull in our app id and secret from our social config file
passport.use(new FacebookStrategy({

  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
  profileFields: configAuth.facebookAuth.profileFields
}, SocialAuthController.passportCallback));

// pull in our app id and secret from our social config file
passport.use(new GoogleStrategy({

  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL,
  proxy: true
}, SocialAuthController.passportCallback));
