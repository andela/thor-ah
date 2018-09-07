import db from '../models';


const { UserFollow, User } = db;

/**
 * UserFollow controller class
 */
class FollowsController {
  /**
   * @static
   * @param {reuest} req
   * @param {response} res
   * @param {response} next
   * @return {json} res
   * @description follows a given user .
   */
  static follow(req, res, next) {
    const { email } = req.body;

    User.findOne({
      where: { email }
    }).then((user) => {
      // check user exists
      if (!user) {
        return res.status(404).json({
          errors: {
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
            success: {
              message: `now following ${email}`
            }
          });
        }
        // already exists
        return res.status(400).json({
          errors: {
            message: 'you are already following user'
          }
        });
      })
        .catch(next);
    })
      .catch(next);
  }

  /**
   * @static
   * @param {reuest} req
   * @param {response} res
   * @return {json} res
   * @description gets all users following current user.
   */
  static getFollowers(req, res) {
    User.findById(req.userId, {
      include: [{
        model: User,
        as: 'following',
        attributes: ['email']
      },
      {
        model: User,
        as: 'followers',
        attributes: ['email']
      }],
    }).then((users) => {
      res.status(200).json({ followers: users.followers });
    });
  }

  /**
   * @static
   * @param {reuest} req
   * @param {response} res
   * @return {json} res
   * @description return users current user is following .
   */
  static getFollowings(req, res) {
    User.findById(req.userId, {
      include: [{
        model: User,
        as: 'following',
        attributes: ['email']
      },
      {
        model: User,
        as: 'followers',
        attributes: ['email']
      }],
    }).then((users) => {
      res.status(200).json({ following: users.following });
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
    const { email } = req.body;

    User.findOne({
      where: { email }
    }).then((user) => {
      // check user exists
      if (!user) {
        return res.status(404).json({
          errors: {
            message: 'User you are not following this user',
          }
        });
      }

      const userId = user.id;
      const followerId = req.userId;

      UserFollow.findOne({
        where: { followerId, userId }
      }).then((userFollow) => {
        if (userFollow == null) {
          return res.json({
            errors: {
              error: { message: `you are not following  ${email}` }
            }
          });
        }
        userFollow.destroy()
          .then(() => res.status(200).json({
            message: 'article successfully deleted',
          }))
          .catch(next);
      })
        .catch(next);
    })
      .catch(next);
  }
}

export default FollowsController;
