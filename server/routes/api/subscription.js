import auth from '../../middleware/auth';
import Subscription from '../../controllers/subscription';

// get authenticateUser method
const { authenticateUser } = auth;
const subscriptionRoutes = require('express').Router();

const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY;

subscriptionRoutes.get('/', ((req, res) => {
  res.render('index', { keyPublishable });
}));

subscriptionRoutes.post('/subscribe/:plan', Subscription.subscribe);

subscriptionRoutes.get('/user-subscription', authenticateUser, Subscription.getUsersSubscriptions);

subscriptionRoutes.get('/user-subscription/:userId', authenticateUser, Subscription.getSingleUserSubscriptions);

export default subscriptionRoutes;
