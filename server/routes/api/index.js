import { Router } from 'express';
import articlesRouter from './articles';

import userRoutes from './users';
import userFollowRoutes from './userFollows';
import welcomeRoute from './welcome';
import socialAuth from './socialauth';
import categoryRouter from './categoryRoute';


const routes = Router();

routes.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: Object.keys(err.error).reduce((error, key) => {
        error[key] = err.error[key].message;
        return error;
      }, {})
    });
  }
  return next(err);
});

routes.use('/users', userRoutes);
routes.use('/users/follow', userFollowRoutes);
routes.use('/', welcomeRoute);
routes.use('/', socialAuth);
routes.use('/articles', articlesRouter);
routes.use('/article-categories', categoryRouter);


export default routes;
