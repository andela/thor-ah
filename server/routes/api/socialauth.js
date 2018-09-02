import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

// for facebook login
// this redirects users to facebook for authentication
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['profile', 'image', 'email'] }));

// This redirects the user to this URL after approval
router.get('/auth/facebook/callback',
  passport.authenticate('facebook'), { session: false }, (err, req, res, user, info) => {
    if (err || !user) {
      return res.status(400).send({
        message: info ? info.message : 'Login attempt failed',
        user
      });
    }
    req(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.status(200).send({ message: 'You are logged in!', token, user });
    });
  });

// for google login
// this redirects users to google for authentication
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'image', 'email'] }));

// This redirects the user to this URL after approval
router.get('/auth/google/callback',
  passport.authenticate('google'), { session: false }, (err, req, res, user, info) => {
    if (err || !user) {
      return res.status(400).send({
        message: info ? info.message : 'Login attempt failed',
        user
      });
    }
    req(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.status(200).send({ message: 'You are logged in!', token, user });
    });
  });


// for twitter login
// this redirects users to twitter for authentication
router.get('/auth/twitter',
  passport.authenticate('twitter', { scope: ['profile', 'image', 'email'] }));

// This redirects the user to this URL after approval
router.get('/auth/twitter/callback',
  passport.authenticate('twitter'), { session: false }, (err, req, res, user, info) => {
    if (err || !user) {
      return res.status(400).send({
        message: info ? info.message : 'Login attempt failed',
        user
      });
    }
    req(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.status(200).send({ message: 'You are logged in!', token, user });
    });
  });


export default router;
