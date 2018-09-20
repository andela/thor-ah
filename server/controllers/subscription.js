import stripe from 'stripe';
import moment from 'moment';

import { Subscription, User } from '../models';


const stripePayment = stripe(process.env.STRIPE_SECRET_KEY);
/**
 *
 *
 * @class Subscription
 */
class SubscriptionClass {
  /**
   * @description query for subscription
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {number} price subscription amount
   * @param {string} paymentDescription description of payment being made
   * @param {string} paymentPlan customer's payment plan
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof SubscriptionClass
   */
  static subscribtionQuery(req, res, price, paymentDescription, paymentPlan, next) {
    stripePayment.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
      .then(customer => stripePayment.charges.create({
        amount: price,
        description: paymentDescription,
        currency: 'ngn',
        customer: customer.id
      }))
      .then((payment) => {
        User.findOne({
          where: {
            email: payment.source.name
          }
        })
          .then(user => Subscription.create({
            userId: user.id,
            plan: paymentPlan,
            paymentDate: moment(payment.created * 1000),
            transactionKey: payment.balance_transaction
          })
            .then(() => res.render('charge')).catch(next)).catch(next);
      })
      .catch(next);
  }

  /**
   * @description query for subscription
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof SubscriptionClass
   */
  static subscribe(req, res) {
    if (req.params.plan !== 'basic' && req.params.plan !== 'premium') {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'You can only choose between the basic and premium plans'
        }
      });
    }
    if (req.params.plan === 'basic') {
      return SubscriptionClass.subscribtionQuery(req, res, 150000, 'Thor Authors Haven Basic Subscription', 'basic');
    }
    if (req.params.plan === 'premium') {
      return SubscriptionClass.subscribtionQuery(req, res, 200000, 'Thor Authors Haven Premium Subscription', 'premium');
    }
  }

  /**
   * @description get subscriptions made by users
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof SubscriptionClass
   */
  static getUsersSubscriptions(req, res, next) {
    const { userId } = req;

    User.findOne({
      where: { id: userId }
    })
      .then((user) => {
        if (user.role === 'admin' || user.role === 'superAdmin') {
          return Subscription.findAll()
            .then(users => res.status(200).json({
              status: 'success',
              users
            }))
            .catch(next);
        }
        return res.status(401).json({
          status: 'error',
          error: {
            message: 'user not an admin'
          }
        });
      }).catch(next);
  }

  /**
   * @description get subscriptions made by a user
   * @static
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {object} next next middleware
   * @returns {next} next calls next
   * @memberof SubscriptionClass
   */
  static getSingleUserSubscriptions(req, res, next) {
    const { userId } = req;

    User.findOne({
      where: { id: userId }
    })
      .then((user) => {
        if (user.role === 'admin' || user.role === 'superAdmin') {
          return Subscription.findAll({
            where: { userId: req.params.userId }
          })
            .then((subscription) => {
              if (!subscription.length) {
                return res.status(404).json({
                  status: 'error',
                  error: {
                    message: 'user does not have a subscription yet'
                  }
                });
              }
              return res.status(200).json({
                status: 'success',
                subscription
              });
            })
            .catch(next);
        }
        return res.status(401).json({
          status: 'error',
          error: {
            message: 'user not an admin'
          }
        });
      }).catch(next);
  }
}

export default SubscriptionClass;
