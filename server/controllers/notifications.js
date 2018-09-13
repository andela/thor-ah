import Pusher from 'pusher';
import env from 'dotenv';
import { User, Notification } from '../models';
import articleNotification from '../utils/articleNotify';
import commentNotification from '../utils/commentNotify';

env.config();

const pusher = new Pusher({
  appId: process.env.PUSER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSER_SEC,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: process.env.PUSHER_ENC
});

/**
 * In-App notifications Class
*/
class Notifications {
  /**
   * @param {List} userIds
   * @param {String} articleSlug
   * @param {String} message
   * @description
   * @returns {object} res
   */
  static save(userIds, articleSlug, message) {
    const newNotifications = userIds.map(userId => ({ userId, articleSlug, message }));
    newNotifications.forEach((newNotification) => {
      Notification.findOrCreate({
        where: {
          userId: newNotification.userId,
          articleSlug: newNotification.articleSlug
        },
        defaults: { message }
        // newNotification
      });
    });
  }

  /**
   * @param {List} userIds
   * @param {String} message
   * @description
   * @returns {object} res
   */
  static pushInApp(userIds, message) {
    userIds.forEach((userId) => {
      pusher.trigger('notifications', `${userId}-event`, {
        message
      });
    });
  }

  /**
   * @param {Integer} userId
   * @param {String} articleSlug
   * @param {String} title
   * @param {String} authorUsername
   * @description
   * @returns {object} res
   */
  static notifyForArticle(userId, articleSlug, title, authorUsername) {
    const message = `There is a new article by ${authorUsername} titled ${title}`;

    User
      .findById(userId, {
        include: [{
          model: User,
          as: 'following',
          attributes: { exclude: ['emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
        },
        {
          model: User,
          as: 'followers',
          attributes: { exclude: ['emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
        }],
      }).then((users) => {
        const author = users.firstName;
        const emails = users.followers.map(user => user.email);
        const userIds = users.followers.map(user => user.id);

        if (emails.length > 0) {
          articleNotification.sendNotificationEmail(emails, author, articleSlug);
          Notifications.save(userIds, articleSlug, message);
          Notifications.pushInApp(userIds, message);
        }
      }).catch();
  }


  /**
   * @param {String} title
   * @param {String} articleSlug
   * @param {object} repliers
   * @param {Integer} replierId
   * @description
   * @returns {object} res
   */
  static notifyForCommentReplies(title, articleSlug, repliers, replierId) {
    const message = `${title} has new interactions`;
    const emails = repliers.map(replier => replier.email);
    const userIds = repliers.map(replier => replier.id).filter(id => id !== replierId);

    if (emails.length > 0) {
      commentNotification.sendNotificationEmail(emails, articleSlug);
      Notifications.save(userIds, articleSlug, message);
      Notifications.pushInApp(userIds, message);
    }
  }


  /**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @description
   * @returns {object} jsonResponse
   */
  static getNotifications(req, res, next) {
    Notification.findAll({
      where: {
        userId: req.userId
      },
      attributes: ['id', 'message', 'articleSlug']
    }).then(notifications => res.status(200).json({
      status: 'success',
      notifications
    })).catch(next);
  }

  /**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @description
   * @returns {object} jsonResponse
   */
  static delete(req, res, next) {
    const id = req.params.notifId;
    return Notification.findOne({ where: { id, userId: req.userId } })
      .then((notification) => {
        if (!notification) {
          return res.status(404).json({
            error: { message: 'notification not found' },
            status: 'error'
          });
        }

        return notification.destroy()
          .then(() => res.status(200).json({
            message: 'notification successfully deleted',
            status: 'success'
          }))
          .catch(next);
      })
      .catch(next);
  }
}

export default Notifications;
