import { Router } from 'express';
import articlesRouter from './articles';
import userRoutes from './users';
import welcomeRoute from './welcome';
import socialAuth from './socialauth';


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
routes.use('/', socialAuth);
routes.use('/articles', articlesRouter);


export default routes;
