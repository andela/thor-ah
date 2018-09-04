import { Router } from 'express';

<<<<<<< HEAD
import userRoutes from './users';
import welcomeRoute from './welcome';
=======

router.use('/', require('./users'));
>>>>>>> 3abec737d5c9cf4e9e271bed04f8e4c075e72ef1

const routes = Router();

routes.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  return next(err);
});

routes.use('/users', userRoutes);
routes.use('/', welcomeRoute);


export default routes;
