import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();
const secretKey = process.env.SECRET;

// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, info) => {
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
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });
      res.status(200).send({ message: 'You are logged in!', token, user });
    });
  })(req, res);
});


// // route for twitter authentication and login
// router.get('/auth/twitter', passport.authenticate('twitter'));

// // handle the callback after twitter has authenticated the user
// router.get('/auth/twitter/callback', (req, res, next) => {
//   passport.authenticate('twitter', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).send({
//         message: info ? info.message : 'Login attempt failed',
//         user
//       });
//     }
//     req(user, { session: false }, (err) => {
//       if (err) {
//         res.send(err);
//       }
//       const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });
//       res.status(200).send({ message: 'You are logged in!', token, user });
//     });
//   })(req, res);
// });

// route for google authentication and login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
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
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });
      res.status(200).send({ message: 'You are logged in!', token, user });
    });
  })(req, res);
});

module.exports = router;
