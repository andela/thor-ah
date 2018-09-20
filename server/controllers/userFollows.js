import { UserFollow, User } from '../models';

/**
 * UserFollow controller class
 */
class FollowsController {
  /**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description follows a given user .
   */
  static follow(req, res, next) {
    const { username } = req.body;

    User.findOne({
      where: { username }
    }).then((user) => {
      // check user exists
      if (!user) {
        return res.status(404).json({
          status: 'error',
          error: {
            message: 'User you are trying to follow is missing',
          }
        });
      }

      const userId = user.id;
      const followerId = req.userId;

      // follow user if not already following them
      UserFollow.findOrCreate({
        where: { userId, followerId }
      }).spread((follow, created) => {
        // if created
        if (created) {
          return res.status(201).json({
            status: 'success',
            message: `now following ${username}`
          });
        }
        // already exists
        return res.status(400).json({
          status: 'error',
          error: {
            message: 'you are already following this user'
          }
        });
      })
        .catch(next);
    })
      .catch(next);
  }

  /**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description gets all users following current user.
   */
  static getFollowers(req, res) {
    User.findById(req.userId, {
      include: [{
        model: User,
        as: 'following',
        attributes: { exclude: ['email', 'emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
      },
      {
        model: User,
        as: 'followers',
        attributes: { exclude: ['email', 'emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
      }],
    }).then((users) => {
      res.status(200).json({
        status: 'success',
        message: 'successful',
        followers: users.followers
      });
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description return users current user is following .
   */
  static getFollowings(req, res) {
    User.findById(req.userId, {
      include: [{
        model: User,
        as: 'following',
        attributes: { exclude: ['email', 'emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
      },
      {
        model: User,
        as: 'followers',
        attributes: { exclude: ['email', 'emailVerified', 'role', 'hash', 'createdAt', 'updatedAt'] }
      }],
    }).then((users) => {
      res.status(200).json({
        status: 'success',
        message: 'successful',
        following: users.following
      });
    });
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {json} res
   * @description return users current user is following .
   */
  static unfollow(req, res, next) {
    const { username } = req.body;

    User.findOne({
      where: { username }
    }).then((user) => {
      // check user exists
      if (!user) {
        return res.status(404).json({
          status: 'error',
          error: {
            message: 'You are not following this user',
          }
        });
      }

      const userId = user.id;
      const followerId = req.userId;

      UserFollow.findOne({
        where: { followerId, userId }
      }).then((userFollow) => {
        if (userFollow == null) {
          return res.status(404).json({
            status: 'error',
            error: {
              message: `you are not following ${username}`,
            }
          });
        }
        userFollow.destroy()
          .then(() => res.status(200).json({
            status: 'success',
            message: 'unfllow successful',
          }))
          .catch(next);
      })
        .catch(next);
    })
      .catch(next);
  }
}

export default FollowsController;
