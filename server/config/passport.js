
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import db from '../models';
import configAuth from './socialConfig';

const { User } = db;


// the strategies for getting the user's facebook, twitter and google id

module.exports = (passport) => {
  passport.use(new FacebookStrategy({

  // pull in our app id and secret from our auth.js file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },

    // facebook will send back the token and profile
    ((token, refreshToken, profile, done) => {
      process.nextTick(() => {
      // find the user in the database based on their facebook id
        User.findOne({ 'facebook.id': profile.id }, (err, user) => {
          if (err) { return done(err); }

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          }
          // if there is no user found with that facebook id, create them
          const newUser = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id = user.id; // set the users facebook id
          newUser.facebook.name = user.firstName;
          // if facebook return multiple emails take the first
          newUser.facebook.email = user.emails[0].value;

          // save our user to the database
          newUser.save((err) => {
            if (err) { throw err; }

            // if successful, return the new user
            return done(null, newUser);
          });
        });
      });
    })));

  // passport.use(new TwitterStrategy({

  //   // pull in our app id and secret from our auth.js file
  //   clientID: configAuth.twitterAuth.clientID,
  //   clientSecret: configAuth.twitterAuth.clientSecret,
  //   callbackURL: configAuth.twitterAuth.callbackURL
  // },

  //   ((token, tokenSecret, profile, done) => {
  //     process.nextTick(() => {
  //       // find the user in the database based on their facebook id
  //       User.findOne({ 'twitter.id': profile.id }, (err, user) => {
  //         if (err) { return done(err); }

  //         // if the user is found, then log them in
  //         if (user) {
  //           return done(null, user); // user found, return that user
  //         }
  //         // if there is no user found with that facebook id, create them
  //         const newUser = new User();

  //         // set all of the facebook information in our user model
  //         newUser.twitter.id = user.id; // set the users facebook id
  //         newUser.twitter.displayName = user.firstName;
  //         newUser.twitter.username = user.username;

  //         // save our user to the database
  //         newUser.save((err) => {
  //           if (err) { throw err; }

  //           // if successful, return the new user
  //           return done(null, newUser);
  //         });
  //       });
  //     });
  //   })));

  passport.use(new GoogleStrategy({

    // pull in our app id and secret from our auth.js file
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },

    ((token, refreshToken, profile, done) => {
      process.nextTick(() => {
        // find the user in the database based on their facebook id
        User.findOne({ 'google.id': profile.id }, (err, user) => {
          if (err) { return done(err); }

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          }
          // if there is no user found with that facebook id, create them
          const newUser = new User();

          // set all of the facebook information in our user model
          newUser.google.id = user.id; // set the users facebook id
          newUser.google.name = user.firstName;
          // if facebook return multiple emails take the first
          newUser.google.email = user.emails[0].value;

          // save our user to the database
          newUser.save((err) => {
            if (err) { throw err; }

            // if successful, return the new user
            return done(null, newUser);
          });
        });
      });
    })));
};
