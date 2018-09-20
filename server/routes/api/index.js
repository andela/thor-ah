import { Router } from 'express';

import articlesRouter from './articles';
import userRoutes from './users';
import userFollowRoutes from './userFollows';
import welcomeRoute from './welcome';
import socialAuth from './socialauth';
import categoryRouter from './categoryRoute';
import favoriteArticle from './favoriteArticle';
import adminRoutes from './admin';
import notificationsRoute from './notifications';
import readingStatsRouter from './readingStatsRoute';
import subscriptionRoutes from './subscription';


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

routes.use('/users/follow', userFollowRoutes);
routes.use('/users/notifications', notificationsRoute);
routes.use('/users', userRoutes);
routes.use('/', welcomeRoute);
routes.use('/', socialAuth);
routes.use('/articles', articlesRouter);
routes.use('/article-categories', categoryRouter);
routes.use('/admin', adminRoutes);
routes.use('/user-reading-stats', readingStatsRouter);
routes.use('/', favoriteArticle);
routes.use('/subscription', subscriptionRoutes);

export default routes;
