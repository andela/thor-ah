import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import db from '../models';

const { User } = db;

// the strategies for getting the user's facebook, twitter and google id

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
  ((accessToken, refreshToken, profile, done) => {
    User.findOrCreate({
      where: {
        id: profile.id,
        username: profile.name,
        email: profile.name,
        image: profile.image
      }
    }, (err, res, user) => {
      if (err) { return done(res.status(401).send({ message: 'You are not logged in on facebook' })); }
      done(null, user);
    });
  })));

passport.use(new TwitterStrategy({
  clientID: process.env.TWITTER_APP_ID,
  clientSecret: process.env.TWITTER_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/twitter/callback'
},
  ((accessToken, refreshToken, profile, done) => {
    User.findOrCreate({
      where: {
        id: profile.id,
        username: profile.name,
        email: profile.name,
        image: profile.image
      }
    }, (err, res, user) => {
      if (err) { return done(res.status(401).send({ message: 'You are not logged in on twitter' })); }
      done(null, user);
    });
  })));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
  ((accessToken, refreshToken, profile, done) => {
    User.findOrCreate({
      where: {
        id: profile.id,
        username: profile.name,
        email: profile.name,
        image: profile.image
      }
    }, (err, res, user) => {
      if (err) { return done(res.status(401).send({ message: 'You are not logged in on google' })); }
      done(null, user);
    });
  })));
